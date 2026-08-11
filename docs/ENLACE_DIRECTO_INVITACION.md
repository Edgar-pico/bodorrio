# Enlace directo a la invitación familiar

Esta corrección separa claramente los dos recorridos públicos:

1. El enlace privado enviado por WhatsApp abre directamente la tarjeta familiar en `#confirmacion` y carga la invitación mediante su token.
2. Después de guardar la respuesta, el invitado vuelve a `/` sin el token para recorrer la invitación oficial desde el inicio. Al llegar nuevamente a la sección de confirmación, aparece el buscador normal.

No requiere cambios en Supabase ni una migración SQL nueva.

## Archivos modificados

- `src/components/AdminDashboard.svelte`
  - Genera enlaces con el formato `/?i=TOKEN#confirmacion`.
  - Actualiza el mensaje de WhatsApp para indicar que el enlace abre directamente la confirmación.
- `src/components/Rsvp.svelte`
  - Busca automáticamente la invitación cuando existe `?i=TOKEN`.
  - Enfoca y desplaza la vista a la tarjeta familiar.
  - Después de confirmar, redirige a `/` sin conservar el token.
- `src/components/Splash.svelte`
  - Omite la portada de apertura cuando se entra con un token privado; esto también mantiene compatibles los enlaces anteriores que todavía no incluyen `#confirmacion`.
- `src/pages/index.astro`
  - Carga el componente RSVP desde el inicio para procesar el enlace privado sin esperar a que el usuario se desplace manualmente.
- `docs/RSVP_SETUP.md`
  - Documenta el nuevo recorrido.

## Paso a paso para actualizar el proyecto local

1. Descomprime el proyecto actualizado.
2. Copia su contenido sobre la carpeta local `bodorrio`.
3. Conserva tu carpeta `.git` y tu archivo `.env` actuales.
4. No ejecutes ninguna migración SQL; la base de datos no cambió.
5. Desde PowerShell, dentro de la carpeta del proyecto, ejecuta:

```powershell
npm install
npm run astro -- check
npm run build
npm run dev
```

## Prueba local

1. Abre `http://localhost:4321/admin` e inicia sesión.
2. En una invitación existente, presiona **Copiar enlace**.
3. Confirma que el enlace termine en:

```text
/?i=TOKEN#confirmacion
```

4. Abre ese enlace en una ventana de incógnito.
5. Debe aparecer directamente la tarjeta familiar con sus pases; no debe aparecer primero la portada ni el buscador.
6. Guarda una confirmación de prueba.
7. Después del resumen de tres segundos, la dirección debe quedar en `/`, sin `?i=TOKEN` ni `#confirmacion`.
8. La página debe comenzar como la invitación oficial normal. Al llegar a **Confirmación de asistencia**, debe aparecer el buscador común.

## Publicar en la URL Preview de Vercel

Cuando la prueba local sea correcta:

```powershell
git add .
git commit -m "Corrige enlace directo y regreso a la invitacion oficial"
git push
```

Vercel construirá la nueva versión. Abre `/admin` desde la URL Preview que vas a usar para enviar pruebas: el sistema forma cada enlace con el mismo dominio desde el que abriste el panel.

Antes de enviar invitaciones reales, vuelve a generar o copiar sus enlaces desde el dominio oficial para que apunten a `bodorrio-edgarbrenda.com` y no a una URL temporal de Preview.
