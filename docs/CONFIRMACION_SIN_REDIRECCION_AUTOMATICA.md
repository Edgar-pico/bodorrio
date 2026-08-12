# Confirmación sin redirección automática

## Comportamiento corregido

Después de guardar una confirmación, la pantalla de resultado permanece abierta hasta que el invitado elija qué hacer.

- **Avisarnos por WhatsApp** abre el mensaje preparado en WhatsApp sin cambiar automáticamente la página de la invitación.
- **Ver invitación completa** elimina el enlace privado al navegar al inicio `/` y muestra la página oficial completa.
- **Consultar otra invitación** limpia la invitación actual y vuelve a mostrar el buscador.

Ya no existe un temporizador de tres segundos ni una redirección automática.

## Archivo modificado

```text
src/components/Rsvp.svelte
```

## Cómo aplicar la versión completa

1. Descomprime el paquete actualizado.
2. Copia el contenido sobre tu proyecto local.
3. Conserva tus archivos `.git` y `.env` actuales.
4. No ejecutes ninguna migración de Supabase.

## Validación local

Desde la raíz del proyecto ejecuta:

```powershell
npm install
npm run astro -- check
npm run build
npm run dev
```

## Prueba del flujo

1. Abre un enlace privado de invitación.
2. Confirma la asistencia.
3. Espera más de tres segundos y comprueba que la pantalla no cambie.
4. Presiona **Avisarnos por WhatsApp** y verifica el mensaje preparado.
5. Regresa al navegador: la confirmación debe continuar visible.
6. Presiona **Ver invitación completa** únicamente cuando quieras entrar al inicio de la página oficial.

## Publicación en Vercel

```powershell
git add .
git commit -m "Mantiene visible la confirmacion antes de abrir la invitacion"
git push
```

Vercel generará un nuevo deployment con la corrección.
