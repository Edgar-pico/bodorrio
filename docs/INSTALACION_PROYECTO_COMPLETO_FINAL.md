# BODORRIOPRO — instalación del proyecto completo

Esta entrega incluye el proyecto completo con invitaciones individuales y conjuntas/familiares.

## 1. Respaldar la configuración local

Antes de reemplazar archivos, conserva estos elementos de tu proyecto actual:

- `.git`
- `.env`

No compartas ni subas el archivo `.env` al repositorio.

## 2. Actualizar Supabase

En **Supabase → SQL Editor → New query**, ejecuta únicamente:

```text
supabase/migrations/202608110004_individual_and_group_invitations.sql
```

Las migraciones `001`, `002` y `003` ya deben estar aplicadas. No las vuelvas a ejecutar.

La migración `004` no elimina invitados, pases ni confirmaciones. Agrega la modalidad explícita:

- `individual`
- `group`

## 3. Reemplazar el código

Descomprime el ZIP y copia el contenido de la carpeta `bodorrio` sobre:

```text
C:\Users\edgar\Documents\BODORRIO\bodorrio
```

Reemplaza los archivos cuando Windows lo solicite, pero conserva tu `.git` y `.env` actuales.

## 4. Instalar y validar

Desde PowerShell, dentro del proyecto, ejecuta:

```powershell
npm install
npm run astro -- check
npm run build
npm run dev
```

## 5. Comprobar el flujo

En `/admin` prueba lo siguiente:

1. Crea una invitación individual y confirma que aparece un botón directo al WhatsApp de la persona.
2. Crea una invitación conjunta con dos contactos y confirma que aparece un solo botón `WhatsApp · Todos`.
3. Comprueba que el mensaje inicial no revela la cantidad de pases.
4. Abre el enlace privado y guarda una respuesta.
5. Vuelve a abrir el mismo enlace y comprueba que muestra la respuesta guardada.
6. Verifica que el mensaje final diga `soy/confirmo` para individuales y `somos/confirmamos` para conjuntas.

## 6. Publicar el Preview

```powershell
git add .
git commit -m "Agrega invitaciones individuales y conjuntas"
git push
```

Mientras el dominio oficial permanezca desconectado, usa el deployment Preview de Vercel para las pruebas.
