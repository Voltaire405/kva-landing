# Configuración del Sistema de Envío de Correos

Este proyecto utiliza **Resend** con su SDK oficial para el envío de correos electrónicos desde el formulario de contacto, protegido con **Google reCAPTCHA v3** y **rate limiting** para prevenir spam.

> **Nota sobre Turbopack:** Turbopack ha sido deshabilitado tanto en desarrollo como en producción debido a incompatibilidades con el SDK de Resend. El proyecto usa el compilador estándar de Next.js que es completamente compatible.

## 🛡️ Características de Seguridad

- ✅ **reCAPTCHA v3**: Protección invisible contra bots (score mínimo: 0.5)
- ✅ **Rate Limiting**: Máximo 3 intentos por minuto por IP
- ✅ **Validación de datos**: Email, nombre y mensaje requeridos
- ✅ **Headers de seguridad**: X-RateLimit-Remaining y X-RateLimit-Reset

## 🚀 Pasos de Configuración

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

### 3. Configurar Google reCAPTCHA v3

1. Ve a [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. Haz clic en **Crear**
3. Configuración:
   - **Etiqueta**: KvaTel Contact Form (o el nombre que prefieras)
   - **Tipo de reCAPTCHA**: Selecciona **reCAPTCHA v3**
   - **Dominios**: Agrega:
     - `localhost` (para desarrollo)
     - Tu dominio de producción (ej: `kvatel.com`)
     - Tu dominio de Vercel (ej: `tu-proyecto.vercel.app`)
4. Acepta los términos y haz clic en **Enviar**
5. Copia las dos claves que aparecen:
   - **Clave del sitio** (Site Key) - Para el frontend
   - **Clave secreta** (Secret Key) - Para el backend

### 4. Configurar Variables de Entorno Localmente

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y actualiza los valores:
   ```env
   RESEND_API_KEY=re_tu_api_key_aqui
   ADMIN_EMAIL=kvatelsoluciones@gmail.com
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_site_key_aqui
   RECAPTCHA_SECRET_KEY=tu_secret_key_aqui
   ```

### 5. Configurar en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Settings → Environment Variables
3. Agrega las siguientes variables:
   - `RESEND_API_KEY`: Tu API key de Resend
   - `ADMIN_EMAIL`: El email donde recibirás los mensajes (ej: kvatelsoluciones@gmail.com)
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: Tu Site Key de reCAPTCHA
   - `RECAPTCHA_SECRET_KEY`: Tu Secret Key de reCAPTCHA
4. Asegúrate de marcar las variables para: Production, Preview y Development
5. Haz un nuevo deploy o espera al próximo push

> **Importante**: Las variables que comienzan con `NEXT_PUBLIC_` son visibles en el cliente, por eso es seguro usar la Site Key ahí. La Secret Key NUNCA debe exponerse al cliente.

## 📧 Configuración de Dominio (Opcional pero Recomendado)

Por defecto, los correos se envían desde `onboarding@resend.dev`. Para usar tu propio dominio:

### Opción A: Usar dominio personalizado

1. En Resend, ve a **Domains**
2. Haz clic en **Add Domain**
3. Ingresa tu dominio (ej: `kvatel.com`)
4. Sigue las instrucciones para agregar los registros DNS
5. Espera la verificación (puede tardar hasta 48 horas)
6. Actualiza el `from` en `app/api/contact/route.ts`:
   ```typescript
   from: 'Contacto KvaTel <noreply@kvatel.com>',
   ```

### Opción B: Usar subdominio de Resend (Gratis)

Si no tienes un dominio propio, Resend te proporciona un subdominio gratuito `yourusername.resend.dev` que ya está verificado. Solo actualiza:

```typescript
from: 'Contacto KvaTel <contacto@tuusuario.resend.dev>',
```

## 🧪 Probar Localmente

1. Asegúrate de tener las variables de entorno en `.env.local`
2. Inicia el servidor de desarrollo:
   ```bash
   bun dev
   ```
3. Abre http://localhost:3000
4. Ve a la sección de **Contáctanos**
5. Llena el formulario y envía
6. Verifica que el email llegue a tu bandeja de entrada

## 📊 Monitoreo

Para ver el estado de tus emails enviados:

1. Inicia sesión en [Resend](https://resend.com/)
2. Ve a **Emails** en el menú lateral
3. Aquí verás todos los emails enviados con su estado (Delivered, Bounced, etc.)

## 🔒 Seguridad y Anti-Spam

### Protección Implementada

1. **reCAPTCHA v3 (Invisible)**
   - Score mínimo: 0.5 (configurable en `/app/api/contact/route.ts`)
   - Sin interacción del usuario (completamente invisible)
   - Tokens válidos por 2 minutos y uso único

2. **Rate Limiting por IP**
   - Límite: 3 intentos por minuto
   - Se reinicia automáticamente después de 1 minuto
   - Headers informativos: `X-RateLimit-Remaining` y `X-RateLimit-Reset`
   - Almacenamiento en memoria (se reinicia con cold starts de serverless)

3. **Validaciones del Servidor**
   - Campos requeridos: nombre, email, mensaje
   - Formato de email válido
   - Token de reCAPTCHA válido

4. **Mejores Prácticas**
   - ✅ Las API keys están en `.env.local` (ignorado por git)
   - ✅ Secret keys nunca se exponen al cliente
   - ✅ Logging detallado de intentos sospechosos
   - ✅ Mensajes de error informativos pero seguros

## 🆘 Solución de Problemas

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

### Error "Token de CAPTCHA no proporcionado" o score bajo

1. Verifica que las keys de reCAPTCHA estén configuradas correctamente
2. Asegúrate de usar reCAPTCHA v3, NO v2
3. Verifica que el dominio esté agregado en la consola de reCAPTCHA
4. Si el score es muy bajo (<0.5), puede ser:
   - Navegación en modo incógnito
   - VPN o proxy activo
   - Comportamiento sospechoso del usuario
   - Puedes ajustar el umbral en `RECAPTCHA_THRESHOLD` en la API

### Error "Demasiados intentos"

1. Esto es normal - es el rate limiting funcionando
2. Espera 1 minuto antes de intentar nuevamente
3. Si necesitas cambiar el límite, edita `/lib/rate-limiter.ts`:
   - `MAX_REQUESTS_PER_WINDOW`: Número de intentos
   - `RATE_LIMIT_WINDOW`: Ventana de tiempo en ms

## 📝 Límites del Plan Gratuito

### Resend
- 100 correos por día
- 3,000 correos por mes
- 1 dominio personalizado
- Soporte por email

Si necesitas más, considera [actualizar el plan](https://resend.com/pricing).

### Google reCAPTCHA
- 1,000,000 de evaluaciones por mes (gratis)
- Más que suficiente para la mayoría de sitios web

## 🎯 Ajustes Recomendados

### Configuración de Score de reCAPTCHA

Edita `/app/api/contact/route.ts` para ajustar el umbral:

```typescript
const RECAPTCHA_THRESHOLD = 0.5; // Cambia este valor según necesites
```

- **0.0-0.3**: Muy probable que sea un bot
- **0.3-0.5**: Sospechoso
- **0.5-0.7**: Neutral (recomendado)
- **0.7-0.9**: Probablemente humano
- **0.9-1.0**: Muy probablemente humano

### Configuración de Rate Limiting

Edita `/lib/rate-limiter.ts`:

```typescript
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto (en ms)
const MAX_REQUESTS_PER_WINDOW = 3; // intentos por ventana
```

Ajusta según tus necesidades y tráfico esperado.
