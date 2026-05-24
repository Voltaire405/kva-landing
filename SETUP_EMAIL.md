# Configuración del Sistema de Envío de Correos

Este proyecto utiliza **Resend** con su SDK oficial para el envío de correos electrónicos desde el formulario de contacto, protegido con **anti-spam ligero** (honeypot, tiempo mínimo de envío) y **rate limiting persistente** en Turso.

> **Nota sobre Turbopack:** Turbopack ha sido deshabilitado tanto en desarrollo como en producción debido a incompatibilidades con el SDK de Resend. El proyecto usa el compilador estándar de Next.js que es completamente compatible.

## Características de Seguridad

- **Honeypot**: campo oculto (`website`) que solo rellenan bots; respuesta de éxito falso sin guardar
- **Tiempo mínimo**: rechaza envíos en menos de 3 segundos desde que se carga el formulario
- **Rate limiting**: máximo 3 intentos por IP cada 24 horas (persistido en Turso)
- **Límite diario global**: máximo 50 mensajes guardados por día calendario (America/Bogota); configurable con `CONTACT_DAILY_MESSAGE_LIMIT`
- **Validación de datos**: email, nombre y mensaje requeridos
- **Headers de seguridad**: `X-RateLimit-Remaining` y `X-RateLimit-Reset`

## Pasos de Configuración

### 1. Crear cuenta en Resend

1. Ve a [https://resend.com/signup](https://resend.com/signup)
2. Crea una cuenta gratuita (incluye 100 correos/día, 3,000/mes)
3. Verifica tu email

### 2. Obtener API Key

1. Inicia sesión en [https://resend.com/](https://resend.com/)
2. Ve a **API Keys** en el menú lateral
3. Haz clic en **Create API Key**
4. Dale un nombre (ej: "KvaTel Production")
5. Copia la API key (solo se muestra una vez)

### 3. Configurar Variables de Entorno Localmente

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y actualiza los valores:
   ```env
   RESEND_API_KEY=re_tu_api_key_aqui
   CRON_SECRET=un_secreto_largo_para_pruebas_locales
   CONTACT_TEST_MODE=true
   ```

   `CONTACT_TEST_MODE=true` omite honeypot y tiempo mínimo en la API durante desarrollo local.

### 4. Notificaciones en lote (Vercel Cron)

Además del envío inmediato (`SEND_CONTACT_EMAIL=true`), puedes activar un **resumen horario** con:

```env
CONTACT_EMAIL_CRON_ENABLED=true
```

| Modo | Variable | Comportamiento |
|---|---|---|
| Inmediato | `SEND_CONTACT_EMAIL=true` | Un correo por mensaje; el cron no procesa |
| Lote horario | `CONTACT_EMAIL_CRON_ENABLED=true` | Resumen cada hora si hay mensajes nuevos |
| Ninguno | (ninguna) | Solo Turso + panel admin |

**Variables adicionales en Vercel:**

- `CRON_SECRET`: Vercel lo genera e inyecta automáticamente en el header `Authorization` al invocar crons. En local, defínelo en `.env.local` para probar manualmente.
- `RESEND_API_KEY`: requerida para el envío en lote e inmediato.
- El destinatario se toma del **email de contacto** configurado en `/admin/contact` (tabla `contact_info` en Turso).

**Cron en `vercel.json`:** se ejecuta **cada hora** (`0 * * * *`). Solo envía si hay mensajes sin notificar y el email de contacto es válido.

**Probar el cron localmente:**

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/notifications
```

Respuestas posibles: `{ sent: true, count: N }`, `{ skipped: true, reason: "immediate_email_enabled" | "cron_disabled" | "invalid_recipient_email" | "no_messages" }`.

### 5. Configurar en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Settings → Environment Variables
3. Agrega las siguientes variables:
   - `RESEND_API_KEY`: Tu API key de Resend
   - `CRON_SECRET`: Secreto para el cron (Vercel puede generarlo automáticamente)
4. Asegúrate de marcar las variables para: Production, Preview y Development
5. Haz un nuevo deploy o espera al próximo push

## Configuración de Dominio (Opcional pero Recomendado)

Por defecto, los correos se envían desde `onboarding@resend.dev`. Para usar tu propio dominio:

### Opción A: Usar dominio personalizado

1. En Resend, ve a **Domains**
2. Haz clic en **Add Domain**
3. Ingresa tu dominio (ej: `kvatel.com`)
4. Sigue las instrucciones para agregar los registros DNS
5. Espera la verificación (puede tardar hasta 48 horas)
6. Configura la variable de entorno `RESEND_FROM_EMAIL`:
   ```env
   RESEND_FROM_EMAIL=Contacto KvaTel <noreply@kvatel.com>
   ```

### Opción B: Usar subdominio de Resend (Gratis)

Si no tienes un dominio propio, Resend te proporciona un subdominio gratuito `yourusername.resend.dev` que ya está verificado. Configura:

```env
RESEND_FROM_EMAIL=Contacto KvaTel <contacto@tuusuario.resend.dev>
```

Si no defines `RESEND_FROM_EMAIL`, se usa el fallback `Formulario KvaTel <onboarding@resend.dev>`.

## Probar Localmente

1. Asegúrate de tener las variables de entorno en `.env.local`
2. Inicia el servidor de desarrollo:
   ```bash
   bun dev
   ```
3. Abre http://localhost:3000
4. Ve a la sección de **Contáctanos**
5. Llena el formulario y envía (con `CONTACT_TEST_MODE=true` no necesitas esperar 3 segundos)
6. Verifica que el email llegue a tu bandeja de entrada

## Monitoreo

Para ver el estado de tus emails enviados:

1. Inicia sesión en [Resend](https://resend.com/)
2. Ve a **Emails** en el menú lateral
3. Aquí verás todos los emails enviados con su estado (Delivered, Bounced, etc.)

## Seguridad y Anti-Spam

### Protección Implementada

1. **Honeypot (`website`)**
   - Campo oculto en el formulario; los bots suelen rellenarlo
   - Si tiene valor: respuesta 200 de éxito falso, sin guardar en BD
   - Configurable en [`lib/contact-spam-guard.ts`](lib/contact-spam-guard.ts)

2. **Tiempo mínimo de envío**
   - El cliente envía `formLoadedAt` al montar el formulario
   - Envíos en menos de 3 segundos se tratan como bot (éxito falso)
   - Ajustable con `MIN_FORM_SUBMIT_MS` en [`lib/contact-spam-guard.ts`](lib/contact-spam-guard.ts)

3. **Rate limiting por IP**
   - Límite: 3 intentos cada 24 horas
   - Persistido en tabla `contact_rate_limits` de Turso
   - Headers informativos: `X-RateLimit-Remaining` y `X-RateLimit-Reset`

4. **Límite diario global**
   - Default: 50 mensajes guardados por día (calendario America/Bogota)
   - Solo cuenta mensajes persistidos en `contact_messages` (bots rechazados no consumen cupo)
   - Al alcanzarlo: HTTP 503 con mensaje genérico al usuario
   - Configurable con `CONTACT_DAILY_MESSAGE_LIMIT` (omitido con `CONTACT_TEST_MODE=true`)

5. **Validaciones del servidor**
   - Campos requeridos: nombre, email, mensaje
   - Formato de email válido

6. **Mejores prácticas**
   - Las API keys están en `.env.local` (ignorado por git)
   - Logging de intentos sospechosos (`Contact spam rejected`)
   - Mensajes de error informativos pero seguros

## Solución de Problemas

### El formulario no envía emails

1. Verifica que `RESEND_API_KEY` esté configurado correctamente
2. Revisa los logs en la consola del navegador
3. Revisa los logs de Vercel en el dashboard
4. Verifica que la API key tenga permisos de envío

### Los emails van a spam

1. Configura un dominio personalizado con registros SPF/DKIM
2. Verifica que el dominio esté completamente verificado en Resend
3. Evita palabras spam en el asunto y contenido

### Error "Invalid API Key"

1. Verifica que copiaste la API key completa
2. Asegúrate de que la variable se llame exactamente `RESEND_API_KEY`
3. Si estás en Vercel, verifica que la variable esté en el environment correcto

### Error "Demasiados intentos"

1. Es el rate limiting funcionando (3 envíos por IP cada 24 h)
2. Espera a que expire la ventana o ajusta los límites en [`lib/rate-limiter.ts`](lib/rate-limiter.ts):
   - `MAX_REQUESTS_PER_WINDOW`: número de intentos
   - `RATE_LIMIT_WINDOW`: ventana de tiempo en ms

### Error "No podemos recibir más mensajes hoy"

1. Se alcanzó el límite diario global del formulario
2. El contador se reinicia al día siguiente (America/Bogota)
3. Ajusta `CONTACT_DAILY_MESSAGE_LIMIT` en Vercel si necesitas más capacidad (default: 50)

### El formulario parece enviarse pero no aparece en admin

1. Puede ser un bot detectado (honeypot o tiempo mínimo): revisa logs del servidor
2. En producción, espera al menos 3 segundos antes de enviar
3. No rellenes el campo oculto del formulario

## Límites del Plan Gratuito

### Resend
- 100 correos por día
- 3,000 correos por mes
- 1 dominio personalizado
- Soporte por email

Si necesitas más, considera [actualizar el plan](https://resend.com/pricing).

## Ajustes Recomendados

### Anti-spam

Edita [`lib/contact-spam-guard.ts`](lib/contact-spam-guard.ts):

```typescript
export const MIN_FORM_SUBMIT_MS = 3000; // milisegundos mínimos antes de enviar
```

### Rate limiting

Edita [`lib/rate-limiter.ts`](lib/rate-limiter.ts):

```typescript
export const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 horas (en ms)
export const MAX_REQUESTS_PER_WINDOW = 3; // intentos por ventana
```

### Límite diario global

Variable de entorno (recomendado):

```env
CONTACT_DAILY_MESSAGE_LIMIT=50
```

O edita el default en [`lib/contact-daily-limit.ts`](lib/contact-daily-limit.ts):

```typescript
export const DEFAULT_CONTACT_DAILY_MESSAGE_LIMIT = 50;
```

Ajusta según tus necesidades y tráfico esperado.
