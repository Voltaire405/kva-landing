# KvaTel Landing

Landing page corporativa de **KvaTel Soluciones** — instalaciones eléctricas y redes de telecomunicaciones. Incluye formulario de contacto protegido y un panel de administración para editar el contenido sin tocar código.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Base de datos | Turso (SQLite) + Drizzle ORM |
| Imágenes | Vercel Blob |
| Email | Resend (opcional — inmediato o lote programado vía Vercel Cron) |
| Anti-spam | Honeypot + tiempo mínimo + rate limiting en Turso (omitible en modo test local) |

## Funcionalidades

**Landing pública** (`/`)

- Hero, servicios, portafolio, clientes, testimonios y contacto
- Formulario de contacto con persistencia en Turso, anti-spam ligero, límite global diario y rate limiting por IP
- Contenido servido desde Turso, con fallback a valores por defecto si la BD no está disponible

**Panel de administración** (`/admin`)

- Acceso exclusivo por URL (sin enlaces en la landing)
- Autenticación mediante código de acceso (bootstrap vía `.env`, persistido en Turso desde Configuración)
- CRUD de servicios, trabajos, clientes, testimonios e información de contacto
- Bandeja de mensajes recibidos del formulario (`/admin/messages`): listado, lectura y eliminación
- Notificaciones por correo en lote cada hora (`CONTACT_EMAIL_CRON_ENABLED=true`)
- Subida de imágenes del portafolio a Vercel Blob

## Estructura del proyecto

```
app/
  page.tsx                 # Landing (composición de secciones)
  admin/                   # Panel de administración
  api/
    contact/               # Envío del formulario → Turso (email opcional)
    cron/notifications/    # Cron Vercel — resumen en lote de mensajes
    admin/                 # API CRUD + auth + upload + messages
components/                # Secciones de la landing y UI del admin
db/
  schema.ts                # Esquema Drizzle
  seed.ts                  # Datos iniciales
lib/
  content.ts               # Queries de contenido y mensajes de contacto
  admin-auth.ts            # Sesión del panel
  contact-email.ts         # Plantillas y envío Resend (individual y lote)
  contact-spam-guard.ts    # Honeypot y tiempo mínimo de envío
  contact-daily-limit.ts   # Límite global diario de mensajes
  rate-limiter.ts          # Rate limiting persistente por IP (Turso)
  notification-schedule.ts # Zona horaria America/Bogota (plantillas de email)
drizzle/                   # Migraciones generadas
```

Documentación adicional: [SETUP_EMAIL.md](./SETUP_EMAIL.md) (configuración detallada de Resend y anti-spam).

## Requisitos

- [Bun](https://bun.sh) (recomendado) o Node.js 20+
- Cuenta en [Turso](https://turso.tech)
- Cuenta en [Vercel](https://vercel.com) con Blob Storage (para imágenes del portafolio)
- Cuenta en [Resend](https://resend.com) (solo si quieres notificación por email)

## Configuración local

1. Instalar dependencias:

```bash
bun install
```

2. Crear variables de entorno:

```bash
cp .env.example .env.local
```

Completar todas las variables en `.env.local`:

| Variable | Uso |
|---|---|
| `TURSO_DATABASE_URL` | URL de la base Turso |
| `TURSO_AUTH_TOKEN` | Token de autenticación Turso |
| `ADMIN_ACCESS_CODE` | Código de acceso bootstrap al panel `/admin` (solo hasta guardar uno nuevo en Configuración) |
| `BLOB_READ_WRITE_TOKEN` | Token de escritura Vercel Blob |
| `BLOB_STORE_ID` | ID del store de Blob |
| `CONTACT_TEST_MODE` | `true` en local para omitir honeypot, tiempo mínimo y límite diario en la API |
| `CONTACT_DAILY_MESSAGE_LIMIT` | Máximo de mensajes guardados por día (default `50`; día calendario America/Bogota) |
| `SEND_CONTACT_EMAIL` | `true` para enviar notificación inmediata por email al recibir un mensaje (anula el cron) |
| `CONTACT_EMAIL_CRON_ENABLED` | `true` para resumen en lote cada hora vía Vercel Cron |
| `RESEND_API_KEY` | API key de Resend (inmediato y/o lote programado) |
| `RESEND_FROM_EMAIL` | Remitente (opcional; default `Formulario KvaTel <onboarding@resend.dev>`) |
| `CRON_SECRET` | Secreto para autenticar el cron (Vercel lo inyecta en producción; definir en local para pruebas) |

3. Aplicar migraciones y cargar datos iniciales:

```bash
bun run db:migrate
bun run db:seed
```

4. Iniciar el servidor de desarrollo:

```bash
bun dev
```

- Landing: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### Modo test del formulario de contacto

Para pruebas locales sin esperar el tiempo mínimo de envío ni validar honeypot:

```env
CONTACT_TEST_MODE=true
```

En producción no configures esta variable (o déjala en `false`).

## Scripts

| Comando | Descripción |
|---|---|
| `bun dev` | Servidor de desarrollo |
| `bun build` | Build de producción |
| `bun start` | Servidor de producción |
| `bun lint` | ESLint |
| `bun run db:generate` | Generar migraciones desde el esquema |
| `bun run db:migrate` | Aplicar migraciones |
| `bun run db:seed` | Insertar contenido inicial (solo si la BD está vacía) |

## Despliegue en Vercel

1. Conectar el repositorio en Vercel.
2. Configurar las mismas variables de entorno que en `.env.example`.
3. Tras el primer deploy, ejecutar `db:migrate` y `db:seed` contra la base Turso de producción.
4. El panel admin queda disponible en `https://tu-dominio.vercel.app/admin/login`.
5. Configura `RESEND_API_KEY`, `CONTACT_EMAIL_CRON_ENABLED=true` (o `SEND_CONTACT_EMAIL=true` para modo inmediato) y verifica que el email de contacto en `/admin/contact` sea válido. El cron en `vercel.json` se ejecuta cada hora (`0 * * * *`).

## Notas

- **Formulario de contacto:** los mensajes se guardan en la tabla `contact_messages` de Turso. Límite global de **50 mensajes/día** por defecto (`CONTACT_DAILY_MESSAGE_LIMIT`); al alcanzarlo la API responde 503. Modos de email con Resend:
  - **Inmediato:** `SEND_CONTACT_EMAIL=true` — un correo por mensaje; el cron no procesa.
  - **Lote horario:** `CONTACT_EMAIL_CRON_ENABLED=true` — resumen cada hora si hay mensajes nuevos. Destinatario: email en `/admin/contact`.
  - **Ninguno:** sin esas variables — solo Turso y panel admin.
- **Autenticación admin:** `ADMIN_ACCESS_CODE` permite el primer acceso cuando aún no hay código en la base de datos. Tras guardar un código en `/admin/settings`, el login valida exclusivamente contra Turso y la variable de entorno deja de usarse.
- Resend está externalizado en `next.config.ts` (`serverExternalPackages`) para compatibilidad con el bundler de Next.js en desarrollo.
- El contenido editable vive en Turso. Si la BD está vacía o no configurada, la landing muestra los valores por defecto definidos en `lib/content-defaults.ts`.
