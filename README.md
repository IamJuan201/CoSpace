# CoSpace

Aplicación de coworking para consultar espacios y reservar escritorios, salas de reuniones y cabinas por horas. Construida con Next.js App Router, TypeScript, Tailwind CSS v4, next-intl y Prisma sobre PostgreSQL.

## Requisitos

- Node.js 22 o superior y npm.
- PostgreSQL local/remoto (por ejemplo, Supabase).
- Docker opcional.

## Configuración local

1. Instala dependencias con `npm ci`.
2. Copia `.env.example` a `.env` y completa las variables.
3. Aplica la migración y crea los datos iniciales:
	- `npx prisma migrate deploy`
	- `npx prisma db seed`
4. Inicia el servidor con `npm run dev` y abre http://localhost:3000.

La aplicación está disponible en español (`/es`) e inglés (`/en`). El usuario de ejemplo creado por el seed es `admin@cospace.com`, con contraseña `Admin123!`; cambia estas credenciales antes de exponer el entorno y no reutilices el seed en producción.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | URL de conexión PostgreSQL usada por Prisma. |
| `JWT_ACCESS_SECRET` | Secreto largo y aleatorio para tokens de acceso. |
| `JWT_REFRESH_SECRET` | Secreto distinto, largo y aleatorio para refresh tokens. |
| `ACCESS_TOKEN_EXPIRES_IN` | Vigencia del token de acceso (por defecto `15m`). |
| `REFRESH_TOKEN_EXPIRES_IN` | Vigencia del refresh token (por defecto `7d`). |
| `BUSINESS_TIMEZONE` | Zona horaria donde aplican los horarios de reserva (por defecto `America/Bogota`). |

## Comandos

- `npm run dev`: servidor local en el puerto 3000.
- `npm run build`: build de producción.
- `npm start`: sirve el build.
- `npm run lint`: ESLint.
- `npm run typecheck`: comprobación TypeScript.
- `npm test`: tests de reglas de negocio.
- `npx prisma db seed`: crea admin y espacios de ejemplo.

## Funcionalidades

- Registro/login con cookies HttpOnly, access/refresh tokens y logout API.
- Catálogo público y detalle de espacios activos.
- Reserva por intervalos horarios; el dashboard permite consultar/cancelar reservas.
- Administración de espacios restringida a usuarios `ADMIN`.
- API JSON en `/api`; ver `src/app/api` para las rutas.
- Traducciones en `messages/es.json` y `messages/en.json`.

## Docker

Configura en `.env` las variables requeridas y ejecuta `docker compose up --build`. El contenedor espera una base PostgreSQL externa; aplica las migraciones a esa base antes de arrancar la app. Para desplegar el contenedor en producción se recomienda ejecutar `npx prisma migrate deploy` como paso de release separado.

## Despliegue en Vercel y Supabase

1. Crea una base PostgreSQL en Supabase y configura `DATABASE_URL` en los ajustes del proyecto Vercel.
2. En **Settings → Environment Variables**, configura `DATABASE_URL`, `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` para Production y Preview. Los dos secretos JWT deben ser aleatorios, distintos y de al menos 32 caracteres. `ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN` y `BUSINESS_TIMEZONE` son opcionales.
3. En Vercel, deja el framework como Next.js, el comando de instalación como `npm install` y el de build como `npm run build`. El script `postinstall` genera el cliente Prisma; no hace falta reemplazar el comando de build.
4. Aplica las migraciones de Prisma a la base de datos de producción antes de enviar tráfico: `npx prisma migrate deploy`. Hazlo desde un entorno seguro que tenga `DATABASE_URL` de producción y acceso al proyecto. El build de Vercel no ejecuta migraciones automáticamente.
5. Despliega desde la integración Git de Vercel y verifica que las variables estén asignadas al entorno correcto. Tras cambiar variables, crea un nuevo despliegue para que surtan efecto.

Si el build termina pero la app falla al consultar datos, comprueba que las migraciones estén aplicadas y que `DATABASE_URL` apunte a la base correcta. Si login o registro falla, revisa que ambos secretos JWT estén configurados tanto en Production como en Preview. No compartas esos valores en capturas ni logs.

URL de producción: pendiente de crear el proyecto y desplegarlo.

## Seguridad y alcance

El seed contiene una contraseña demostrativa; no es una credencial de producción. Configura secretos únicos, revisa las políticas de acceso de PostgreSQL y limita quién puede registrarse como admin. No se incluye `DATABASE_URL` ni una URL de despliegue porque dependen de las cuentas e infraestructura del propietario.
