# Bodorrio — Edgar & Brenda

Invitación web para nuestra historia por capítulos:

- Capítulo I — Nuestro primer sí (boda civil)
- Capítulo II — Nuestro sí ante Dios (boda religiosa)

Sitio: <https://bodorrio-edgarbrenda.com/>

## Stack

- Astro 7
- Svelte 5 para la entrada, navegación, contador y RSVP interactivo
- Tailwind CSS 4
- Vercel para el sitio y los endpoints privados
- Supabase Database para invitados, pases, confirmaciones, mesas y asientos
- Supabase Auth para el panel privado del administrador

## Comandos

```bash
npm install
npm run dev
npm run astro -- check
npm run build
```

## Configuración

Los datos públicos de la boda se encuentran en `src/lib/wedding-config.ts`.

El RSVP requiere estas variables privadas:

```text
SUPABASE_URL=
SUPABASE_SECRET_KEY=
SUPABASE_PUBLISHABLE_KEY=
```

Consulta el paso a paso completo en [`docs/RSVP_SETUP.md`](docs/RSVP_SETUP.md).

## Seguridad

- Nunca subas `.env` al repositorio.
- Nunca agregues `PUBLIC_` a la clave secreta de Supabase.
- Los teléfonos de invitados se guardan solo en la base de datos.
- `/admin` requiere una sesión válida de Supabase Auth y autorización en `wedding_admins`.
- La vista pública nunca recibe la clave privada ni el directorio completo de invitados.
