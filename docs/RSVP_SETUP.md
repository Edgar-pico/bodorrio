# RSVP y panel administrador — Edgar & Brenda

La solución usa:

- **Vercel** para la invitación y los endpoints privados de Astro.
- **Supabase Database** para invitados, pases, confirmaciones y cupo.
- **Supabase Auth** para el inicio de sesión del administrador.
- **WhatsApp `wa.me`** para abrir mensajes preparados sin API de pago.

La clave `SUPABASE_SECRET_KEY` y los teléfonos completos nunca se incluyen en el JavaScript público. El panel se sirve únicamente después de validar una sesión y una fila activa en `wedding_admins`.

## 1. Actualizar la base existente

Tu base ya tiene la primera migración. Ahora entra en **Supabase → SQL Editor → New query**, copia completo y ejecuta:

```text
supabase/migrations/202608100002_admin_and_ceremony.sql
```

Debe terminar con:

```text
Success. No rows returned
```

No borra invitados ni confirmaciones. Agrega:

- `wedding_settings`: cupo total del salón.
- `wedding_admins`: administradores autorizados.
- `wedding_guests.invitation_type`: `reception` o `ceremony_only`.
- funciones transaccionales para guardar invitados, controlar cupo y liberar pases.

En una instalación nueva se ejecutan, en orden:

1. `202608100001_wedding_invitations.sql`
2. `202608100002_admin_and_ceremony.sql`

## 2. Crear tu usuario administrador

En Supabase entra en **Authentication → Users → Add user → Create new user**.

Captura:

- tu correo real;
- una contraseña de al menos 12 caracteres;
- activa **Auto Confirm User**.

Después abre **SQL Editor** y ejecuta lo siguiente sustituyendo el correo:

```sql
insert into public.wedding_admins (user_id, email, display_name)
select id, email, 'Edgar'
from auth.users
where lower(email) = lower('TU_CORREO_AQUI')
on conflict (user_id) do update
set email = excluded.email,
    display_name = excluded.display_name,
    is_active = true,
    updated_at = now()
returning user_id, email, display_name, is_active;
```

Debe devolver una fila. Si devuelve cero filas, el correo no coincide con el creado en **Authentication → Users**.

No insertes contraseñas en SQL. Supabase Auth las administra de forma separada.

## 3. Copiar la Publishable key

Además de las variables que ya configuraste, el login necesita la clave pública de Supabase.

En **Supabase → Project Settings → API Keys** copia **Publishable key**, que comienza con:

```text
sb_publishable_
```

No uses aquí la Secret key.

## 4. Variables locales

En el archivo `.env` que está junto a `package.json` deja:

```env
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SECRET_KEY=sb_secret_TU_CLAVE_PRIVADA
SUPABASE_PUBLISHABLE_KEY=sb_publishable_TU_CLAVE_PUBLICA
```

Después detén `npm run dev` con `Ctrl + C` y vuelve a iniciarlo. Astro lee el `.env` únicamente al arrancar.

## 5. Variables de Vercel

En **Vercel → Project → Settings → Environment Variables** agrega:

| Variable | Valor |
| --- | --- |
| `SUPABASE_URL` | Project URL de Supabase |
| `SUPABASE_SECRET_KEY` | `sb_secret_...` |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` |

Selecciona **Production**, **Preview** y **Development**. Después realiza un **Redeploy**.

La Publishable key puede usarse públicamente, pero en este proyecto se mantiene en el servidor. La Secret key nunca debe llevar el prefijo `PUBLIC_`, aparecer en Svelte, capturas o GitHub.

## 6. Configurar el cupo real del salón

La migración inicia el cupo con la cantidad que ya estaba asignada, para impedir que se agreguen pases por accidente antes de configurar el total.

1. Abre `http://localhost:4321/admin/login`.
2. Inicia sesión con el usuario de Supabase Auth.
3. En **Cupo total del salón**, escribe la capacidad real contratada.
4. Presiona **Guardar cupo**.

Ejemplo: si el salón tiene 250 lugares, registra `250`. El sistema nunca permitirá que la suma de pases activos supere ese número.

## 7. Agregar invitados

Desde `/admin` captura:

- nombre completo o nombre de la familia;
- teléfono a 10 dígitos;
- tipo de invitación;
- pases del salón, únicamente para `Misa y recepción`.

Tipos disponibles:

### Misa y recepción

- Consume pases del cupo del salón.
- El invitado elige cuántos usará, sin superar su límite.
- Aparece en las estadísticas de pases asignados y confirmados.

### Solo acompañar a misa

- No consume pases del salón.
- No muestra selector de pases.
- El invitado confirma si asistirá a la ceremonia religiosa.
- Aparece por separado en `Confirmados solo misa`.

## 8. Liberar y reasignar pases

Ejemplo: una familia tiene 5 pases y confirma 3.

1. El panel muestra `2 pases liberables`.
2. En la tarjeta de esa familia presiona **Liberar 2**.
3. Confirma la acción.
4. El máximo de esa familia baja de 5 a 3.
5. Los 2 pases vuelven a **Disponibles**.
6. Puedes asignarlos a una invitación nueva o aumentar otra existente.

Los pases de invitaciones pendientes no se liberan, porque la familia todavía podría confirmar. Si alguien rechazó la invitación, todos sus pases pueden liberarse.

Una vez liberados, el invitado no podrá aumentar su confirmación por encima del nuevo máximo. Para devolverle lugares tendrás que editar su invitación desde el panel, siempre que exista cupo.

## 9. Enviar por WhatsApp

Cada tarjeta tiene **WhatsApp**. El botón abre un mensaje dirigido al teléfono registrado e incluye:

- nombre del invitado;
- número de pases, cuando corresponde;
- enlace privado `?i=TOKEN#confirmacion`.

El administrador revisa el texto y pulsa **Enviar**. Esto usa `wa.me` y no requiere pagar una API.

## 10. Pruebas recomendadas

Ejecuta:

```bash
npm install
npm run astro -- check
npm run build
npm run dev
```

Prueba:

1. login correcto e incorrecto;
2. acceso directo a `/admin` sin sesión;
3. alta de una invitación de recepción;
4. intento de superar el cupo total;
5. alta de una invitación de solo misa;
6. confirmación de ambos tipos desde la página pública;
7. familia con menos asistentes que pases;
8. liberación y reasignación de pases;
9. enlace de WhatsApp;
10. cierre de sesión.

## 11. Seguridad aplicada

- cookies de sesión `HttpOnly`, `SameSite=Strict` y `Secure` en producción;
- validación del usuario con Supabase Auth en el servidor;
- autorización adicional mediante `wedding_admins`;
- comprobación de origen en acciones administrativas;
- RLS activo y permisos revocados para `anon` y `authenticated`;
- operaciones administrativas ejecutadas únicamente con `service_role` en Vercel;
- bloqueo transaccional para evitar sobreasignar cupo en solicitudes simultáneas;
- endpoints sin caché y rutas administrativas con `noindex`.
