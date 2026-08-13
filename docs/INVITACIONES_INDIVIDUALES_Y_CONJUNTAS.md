# Invitaciones individuales y conjuntas

## Orden de actualización

1. En Supabase, abre **SQL Editor > New query**.
2. Ejecuta completo `202608110004_individual_and_group_invitations.sql`.
3. Copia los archivos actualizados del proyecto.
4. Ejecuta:

```powershell
npm run astro -- check
npm run build
```

5. Sube los cambios a la rama usada por Vercel.

No vuelvas a ejecutar las migraciones `001`, `002` ni `003`.

## Comportamiento

### Individual

- Un contacto.
- Pases de adultos y niños configurables.
- Un botón abre directamente el chat registrado.
- La respuesta usa singular: `soy Emmanuel`, `confirmo` y `no podré asistir`.

### Conjunta o familiar

- De uno a cinco contactos.
- Todos comparten el mismo ID, enlace, pases y confirmación.
- El panel muestra un solo botón `WhatsApp · Todos`.
- El botón prepara una sola copia del mensaje y WhatsApp permite elegir a quién compartirla.
- La respuesta usa plural: `somos Bárbara y Pablo`, `confirmamos` y `no podremos asistir`.

## Registros existentes

La migración marca automáticamente como individual las invitaciones que actualmente tienen un contacto y como conjuntas las que tienen dos o más. Si una pareja o familia comparte un solo teléfono, entra en **Editar** y selecciona **Conjunta o familiar**.

## Límite de WhatsApp

Un enlace web no puede enviar mensajes automáticamente ni preseleccionar varios chats. WhatsApp siempre conserva la confirmación final del usuario. El botón conjunto evita tener varios botones en el panel y abre el flujo para seleccionar los destinatarios con un solo mensaje preparado.
