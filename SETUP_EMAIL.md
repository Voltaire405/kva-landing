# Configuración del Sistema de Envío de Correos

Este proyecto utiliza **Resend** con su SDK oficial para el envío de correos electrónicos desde el formulario de contacto.

> **Nota sobre Turbopack:** El build de producción (`bun run build`) no usa Turbopack debido a una incompatibilidad conocida con el SDK de Resend. El modo desarrollo (`bun run dev`) sigue usando Turbopack para mayor velocidad.

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

### 3. Configurar Variables de Entorno Localmente

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y actualiza los valores:
   ```env
   RESEND_API_KEY=re_tu_api_key_aqui
   ADMIN_EMAIL=kvatelsoluciones@gmail.com
   ```

### 4. Configurar en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Settings → Environment Variables
3. Agrega las siguientes variables:
   - `RESEND_API_KEY`: Tu API key de Resend
   - `ADMIN_EMAIL`: El email donde recibirás los mensajes (ej: kvatelsoluciones@gmail.com)
4. Asegúrate de marcar las variables para: Production, Preview y Development
5. Haz un nuevo deploy o espera al próximo push

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

## 🔒 Seguridad

- ✅ Las API keys están en `.env.local` (ignorado por git)
- ✅ Validación de datos en el servidor
- ✅ Rate limiting incluido por Resend
- ✅ No se exponen credenciales en el cliente

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

## 📝 Límites del Plan Gratuito

- 100 correos por día
- 3,000 correos por mes
- 1 dominio personalizado
- Soporte por email

Si necesitas más, considera [actualizar el plan](https://resend.com/pricing).
