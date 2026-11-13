# CI/CD de CoSpace en la EC2 pública

El workflow `.github/workflows/ci.yml` ejecuta las validaciones en cada push y pull request. Si la validación termina correctamente, puede desplegar automáticamente cuando el cambio llega a `main`. Los pull requests nunca despliegan.

## Requisitos en la EC2

- La aplicación está clonada en `/home/ubuntu/CoSpace` y la rama de producción es `main`.
- El archivo `.env` está configurado en esa carpeta y no está versionado.
- `sudo docker compose ps` funciona para el usuario `ubuntu`.
- La instancia tiene salida a GitHub para ejecutar `git pull` y recibe conexiones SSH desde GitHub Actions por el puerto 22.
- El servicio de aplicación escucha en `127.0.0.1:3000` para que Nginx lo atienda.

El despliegue construye la app, ejecuta `prisma migrate deploy` con el servicio Compose `migrate` y luego inicia la nueva versión. Al final consulta `http://127.0.0.1:3000/es`; si no responde correctamente, el job aparece como fallido.

## Configurar secretos en GitHub

En el repositorio abre **Settings → Secrets and variables → Actions → New repository secret** y crea:

| Secreto | Valor |
| --- | --- |
| `EC2_HOST` | Elastic IP o DNS de la EC2 pública, sin `http://` ni puerto. |
| `EC2_USER` | `ubuntu` para una AMI Ubuntu. |
| `EC2_SSH_PRIVATE_KEY` | Contenido completo de una clave privada autorizada para entrar como `ubuntu`, incluyendo sus líneas `BEGIN` y `END`. |
| `EC2_KNOWN_HOSTS` | Línea(s) de clave pública SSH de la instancia para que el runner verifique el servidor. |

Usa una clave dedicada para GitHub Actions y conserva su clave privada solo en el secreto. En PowerShell de tu PC puedes generarla con:

```powershell
ssh-keygen -t ed25519 -C "github-actions-cospace" -f "$env:USERPROFILE\.ssh\cospace-deploy"
```

Cuando pregunte por una frase de contraseña, déjala vacía para que el runner pueda usar la clave sin intervención. En Termius, añade el contenido de `cospace-deploy.pub` a `/home/ubuntu/.ssh/authorized_keys`. Guarda el contenido de `cospace-deploy` (sin `.pub`) en `EC2_SSH_PRIVATE_KEY`. No pegues ninguna clave en el workflow, README o `.env`.

Antes de guardar `EC2_KNOWN_HOSTS`, compara la huella Ed25519 que devuelve `ssh-keyscan -t ed25519 <ELASTIC_IP> | ssh-keygen -lf -` con la huella del servidor que puedes consultar en Termius ejecutando `sudo ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`. Después guarda la salida de `ssh-keyscan -H <ELASTIC_IP>` como valor del secreto. Sustituye el marcador por la Elastic IP real.

La instancia debe permitir SSH desde los runners alojados de GitHub. Sus rangos IP pueden cambiar; mantener SSH abierto a `0.0.0.0/0` permite la conexión, pero expone el puerto 22 a Internet. Para un entorno permanente, conviene reemplazar este acceso por AWS Systems Manager u otro método con origen controlado.

## Activar los despliegues

Cuando los cuatro secretos estén creados y verificados, abre **Settings → Secrets and variables → Actions → Variables → New repository variable** y define:

| Variable | Valor |
| --- | --- |
| `EC2_DEPLOY_ENABLED` | `true` |

Mientras la variable no sea `true`, el workflow seguirá ejecutando CI y omitirá el job de despliegue. Al activarlo, cada push validado a `main` desplegará; los pull requests solo validan. También puedes iniciar una ejecución manual desde **Actions → CI/CD → Run workflow**, seleccionando `main`.

## Qué hacer si falla el job

- **No conecta por SSH:** revisa `EC2_HOST`, `EC2_USER`, la clave autorizada, `EC2_KNOWN_HOSTS` y la regla de entrada TCP 22.
- **Falla `git pull`:** confirma que el checkout de la EC2 está en `main`, sin cambios locales y con acceso de lectura al repositorio.
- **Falla `migrate`:** revisa `.env`, la URL `DATABASE_URL`, la conectividad privada a PostgreSQL y los logs del job.
- **Falla el health check:** entra por Termius y revisa `sudo docker compose ps`, `sudo docker compose logs --tail=100 app` y `sudo nginx -t`.

No se suben `.env`, credenciales de PostgreSQL ni tokens JWT a GitHub. Esas variables permanecen en la EC2; GitHub Actions solo necesita los secretos SSH indicados arriba.
