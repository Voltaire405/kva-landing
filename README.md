# KvaTel Landing

Landing page corporativa de **KvaTel Soluciones** — instalaciones eléctricas y redes de telecomunicaciones. Incluye formulario de contacto protegido y un panel de administración para editar el contenido sin tocar código.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Base de datos | Turso (SQLite) + Drizzle ORM |
| Imágenes | Vercel Blob |
| Email | Resend |
| Anti-spam | Google reCAPTCHA v3 |

## Funcionalidades

**Landing pública** (`/`)

- Hero, servicios, portafolio, clientes, testimonios y contacto
- Formulario de contacto con reCAPTCHA v3 y rate limiting por IP
- Contenido servido desde Turso, con fallback a valores por defecto si la BD no está disponible

**Panel de administración** (`/admin`)

- Acceso exclusivo por URL (sin enlaces en la landing)
- Autenticación mediante código de acceso (bootstrap vía `.env`, persistido en Turso desde Configuración)
- CRUD de servicios, trabajos, clientes, testimonios e información de contacto
- Subida de imágenes del portafolio a Vercel Blob

## Estructura del proyecto

```
app/
  page.tsx                 # Landing (composición de secciones)
  admin/                   # Panel de administración
  api/
    contact/               # Envío del formulario de contacto
    admin/                 # API CRUD + auth + upload
components/                # Secciones de la landing y UI del admin
db/
  schema.ts                # Esquema Drizzle
  seed.ts                  # Datos iniciales
lib/
  content.ts               # Queries de contenido
  admin-auth.ts            # Sesión del panel
drizzle/                   # Migraciones generadas
```

Documentación adicional: [SETUP_EMAIL.md](./SETUP_EMAIL.md) (configuración detallada de Resend y reCAPTCHA).

## Requisitos

- [Bun](https://bun.sh) (recomendado) o Node.js 20+
- Cuenta en [Turso](https://turso.tech)
- Cuenta en [Vercel](https://vercel.com) con Blob Storage (para imágenes del portafolio)
- Cuenta en [Resend](https://resend.com) y [Google reCAPTCHA v3](https://www.google.com/recaptcha/admin) (formulario de contacto)

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
| `RESEND_API_KEY` | Envío de emails del formulario |
| `ADMIN_EMAIL` | Destinatario de mensajes de contacto |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA (cliente) |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA (servidor) |
| `ADMIN_ACCESS_CODE` | Código de acceso bootstrap al panel `/admin` (solo hasta guardar uno nuevo en Configuración) |
| `TURSO_DATABASE_URL` | URL de la base Turso |
| `TURSO_AUTH_TOKEN` | Token de autenticación Turso |
| `BLOB_READ_WRITE_TOKEN` | Token de escritura Vercel Blob |
| `BLOB_STORE_ID` | ID del store de Blob |

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

## Notas

- **Autenticación admin:** `ADMIN_ACCESS_CODE` permite el primer acceso cuando aún no hay código en la base de datos. Tras guardar un código en `/admin/settings`, el login valida exclusivamente contra Turso y la variable de entorno deja de usarse.
- Turbopack está deshabilitado por incompatibilidad con el SDK de Resend; el proyecto usa el compilador estándar de Next.js.
- El contenido editable vive en Turso. Si la BD está vacía o no configurada, la landing muestra los valores por defecto definidos en `lib/content-defaults.ts`.
