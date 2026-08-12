# Respuesta guardada al volver a abrir una invitación

## Comportamiento corregido

Cuando una invitación ya tiene una respuesta guardada en Supabase, una nueva visita al enlace privado muestra directamente el resumen de la confirmación:

- `confirmed`: muestra los adultos y niños confirmados, o la confirmación de asistencia a misa.
- `declined`: muestra que la familia avisó que no podrá asistir.
- `pending`: conserva el formulario para registrar la respuesta por primera vez.

El invitado ya no tiene que seleccionar nuevamente su asistencia cada vez que abre el enlace. Si necesita corregirla, puede usar **Modificar mi respuesta** de forma intencional.

## Instalación

1. Copia el proyecto actualizado sobre la carpeta local del proyecto y conserva `.git` y `.env`.
2. No ejecutes migraciones en Supabase. Las columnas y la función de confirmación existentes ya guardan el estado requerido.
3. Ejecuta:

```powershell
npm install
npm run astro -- check
npm run build
npm run dev
```

## Prueba recomendada

1. Abre el enlace privado de una invitación pendiente.
2. Confirma asistencia o selecciona que no podrán asistir.
3. Cierra la pestaña.
4. Abre nuevamente el mismo enlace privado.
5. Debe aparecer directamente **Confirmación guardada** con la respuesta registrada.
6. Recarga la página y confirma que el resumen permanece.
7. Presiona **Modificar mi respuesta**, guarda un cambio y vuelve a abrir el enlace para comprobar que aparece la información actualizada.

## Publicación

```powershell
git add .
git commit -m "Muestra la respuesta guardada al reabrir la invitacion"
git push
```
