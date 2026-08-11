<script lang="ts">
  type InvitationType = 'reception' | 'ceremony_only';
  type Status = 'pending' | 'confirmed' | 'declined';
  type Guest = {
    id: string;
    token: string;
    fullName: string;
    phone: string;
    invitationType: InvitationType;
    allowedPasses: number;
    confirmedPasses: number;
    status: Status;
    note: string | null;
    isActive: boolean;
    confirmedAt: string | null;
    createdAt: string;
  };
  type Stats = {
    capacity: number;
    assigned: number;
    confirmed: number;
    available: number;
    releasable: number;
    pendingInvitations: number;
    ceremonyConfirmed: number;
  };

  let { displayName }: { displayName: string } = $props();
  let guests = $state<Guest[]>([]);
  let stats = $state<Stats>({ capacity: 0, assigned: 0, confirmed: 0, available: 0, releasable: 0, pendingInvitations: 0, ceremonyConfirmed: 0 });
  let loading = $state(true);
  let saving = $state(false);
  let error = $state('');
  let success = $state('');
  let query = $state('');
  let capacityDraft = $state(0);
  let editingId = $state<string | null>(null);
  let fullName = $state('');
  let phone = $state('');
  let invitationType = $state<InvitationType>('reception');
  let allowedPasses = $state(1);
  let isActive = $state(true);

  const filteredGuests = $derived(guests.filter((guest) => {
    const needle = query.trim().toLocaleLowerCase('es-MX');
    return !needle || guest.fullName.toLocaleLowerCase('es-MX').includes(needle) || guest.phone.includes(needle);
  }));

  async function api(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    const payload = await response.json().catch(() => ({}));
    if (response.status === 401) {
      window.location.assign('/admin/login');
      throw new Error('La sesión venció.');
    }
    if (!response.ok) throw new Error(payload.message ?? 'Ocurrió un error inesperado.');
    return payload;
  }

  async function loadDashboard() {
    loading = true;
    error = '';
    try {
      const payload = await api('/api/admin/guests');
      guests = payload.guests;
      stats = payload.stats;
      capacityDraft = stats.capacity;
    } catch (reason) {
      error = reason instanceof Error ? reason.message : 'No pudimos cargar el panel.';
    } finally {
      loading = false;
    }
  }

  function resetForm() {
    editingId = null;
    fullName = '';
    phone = '';
    invitationType = 'reception';
    allowedPasses = 1;
    isActive = true;
  }

  function editGuest(guest: Guest) {
    editingId = guest.id;
    fullName = guest.fullName;
    phone = guest.phone.replace(/^\+52/, '');
    invitationType = guest.invitationType;
    allowedPasses = guest.invitationType === 'reception' ? guest.allowedPasses : 0;
    isActive = guest.isActive;
    success = '';
    error = '';
    document.querySelector('#guest-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function saveGuest() {
    if (saving) return;
    saving = true;
    error = '';
    success = '';
    try {
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        invitationType,
        allowedPasses: invitationType === 'reception' ? Number(allowedPasses) : 0,
        isActive
      };
      await api(editingId ? `/api/admin/guests/${editingId}` : '/api/admin/guests', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      success = editingId ? 'Invitación actualizada.' : 'Invitado agregado. Ya puedes enviarle su enlace por WhatsApp.';
      resetForm();
      await loadDashboard();
    } catch (reason) {
      error = reason instanceof Error ? reason.message : 'No pudimos guardar la invitación.';
    } finally {
      saving = false;
    }
  }

  async function releasePasses(guest: Guest) {
    const amount = guest.allowedPasses - guest.confirmedPasses;
    if (amount <= 0 || !window.confirm(`¿Liberar ${amount} ${amount === 1 ? 'pase' : 'pases'} de ${guest.fullName}? Después su máximo quedará en ${guest.confirmedPasses}.`)) return;
    error = '';
    success = '';
    try {
      await api(`/api/admin/guests/${guest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'release' })
      });
      success = `${amount} ${amount === 1 ? 'pase liberado' : 'pases liberados'} y disponible para otra invitación.`;
      await loadDashboard();
    } catch (reason) {
      error = reason instanceof Error ? reason.message : 'No pudimos liberar los pases.';
    }
  }

  async function saveCapacity() {
    error = '';
    success = '';
    try {
      await api('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacity: Number(capacityDraft) })
      });
      success = 'Cupo total del salón actualizado.';
      await loadDashboard();
    } catch (reason) {
      error = reason instanceof Error ? reason.message : 'No pudimos actualizar el cupo.';
    }
  }

  function invitationUrl(guest: Guest) {
    return `${window.location.origin}/?i=${guest.token}#confirmacion`;
  }

  function whatsappUrl(guest: Guest) {
    const link = invitationUrl(guest);
    const message = guest.invitationType === 'ceremony_only'
      ? `Hola ${guest.fullName}, Edgar y Brenda queremos invitarte a acompañarnos en nuestra misa de boda. Puedes consultar y confirmar tu invitación aquí: ${link}`
      : `Hola ${guest.fullName}, Edgar y Brenda queremos compartir contigo nuestra invitación de boda. Tienes ${guest.allowedPasses} ${guest.allowedPasses === 1 ? 'pase' : 'pases'}. Puedes verla y confirmar aquí: ${link}`;
    return `https://wa.me/${guest.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  }

  async function copyInvitation(guest: Guest) {
    await navigator.clipboard.writeText(invitationUrl(guest));
    success = `Enlace de ${guest.fullName} copiado.`;
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.assign('/admin/login');
  }

  $effect(() => { loadDashboard(); });
</script>

<header class="admin-header">
  <a class="brand" href="/">E <i>&</i> B</a>
  <div><span>Hola, {displayName}</span><button type="button" onclick={logout}>Cerrar sesión</button></div>
</header>

<main class="dashboard-shell">
  <section class="dashboard-intro">
    <div><p class="eyebrow">Boda Edgar & Brenda</p><h1>Invitados y pases</h1><p>Administra el cupo del salón y las confirmaciones de misa desde un solo lugar.</p></div>
    <form class="capacity-form" onsubmit={(event) => { event.preventDefault(); saveCapacity(); }}>
      <label for="capacity">Cupo total del salón</label>
      <div><input id="capacity" type="number" min="0" max="2000" bind:value={capacityDraft} /><button type="submit">Guardar cupo</button></div>
      <small>Primero coloca aquí la capacidad real contratada para la recepción.</small>
    </form>
  </section>

  {#if error}<p class="notice notice--error" role="alert">{error}</p>{/if}
  {#if success}<p class="notice notice--success" role="status">{success}</p>{/if}

  <section class="stats-grid" aria-label="Resumen de invitados">
    <article><span>Cupo salón</span><strong>{stats.capacity}</strong></article>
    <article><span>Pases asignados</span><strong>{stats.assigned}</strong></article>
    <article class="stat-highlight"><span>Disponibles</span><strong>{stats.available}</strong></article>
    <article><span>Confirmados salón</span><strong>{stats.confirmed}</strong></article>
    <article class:hasAlert={stats.releasable > 0}><span>Pases liberables</span><strong>{stats.releasable}</strong></article>
    <article><span>Confirmados solo misa</span><strong>{stats.ceremonyConfirmed}</strong></article>
  </section>

  <section class="workspace-grid">
    <article id="guest-form" class="panel form-panel">
      <p class="eyebrow">{editingId ? 'Editar invitación' : 'Nueva invitación'}</p>
      <h2>{editingId ? 'Actualizar invitado' : 'Agregar invitado'}</h2>
      <form onsubmit={(event) => { event.preventDefault(); saveGuest(); }}>
        <label for="full-name">Nombre completo o familia</label>
        <input id="full-name" bind:value={fullName} minlength="5" maxlength="120" required placeholder="Ej. Familia Pérez González" />

        <label for="phone">Teléfono a 10 dígitos</label>
        <input id="phone" bind:value={phone} inputmode="tel" required placeholder="4611234567" />

        <fieldset>
          <legend>Tipo de invitación</legend>
          <label class:active={invitationType === 'reception'}><input type="radio" bind:group={invitationType} value="reception" /> Misa y recepción</label>
          <label class:active={invitationType === 'ceremony_only'}><input type="radio" bind:group={invitationType} value="ceremony_only" /> Solo acompañar a misa</label>
        </fieldset>

        {#if invitationType === 'reception'}
          <label for="passes">Pases para el salón</label>
          <input id="passes" type="number" min="1" max="20" bind:value={allowedPasses} required />
          <small class="field-help">Hay {stats.available} pases disponibles. Al editar, ya están considerados los pases actuales de esa invitación.</small>
        {:else}
          <p class="mass-note">Esta invitación no consume pases del salón. La persona únicamente confirmará asistencia a la misa.</p>
        {/if}

        {#if editingId}
          <label class="active-check"><input type="checkbox" bind:checked={isActive} /> Invitación activa</label>
        {/if}

        <div class="form-actions"><button class="primary-button" type="submit" disabled={saving}>{saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Agregar invitado'}</button>{#if editingId}<button class="secondary-button" type="button" onclick={resetForm}>Cancelar</button>{/if}</div>
      </form>
    </article>

    <article class="panel guest-panel">
      <div class="panel-heading"><div><p class="eyebrow">Directorio</p><h2>{guests.length} invitaciones</h2></div><input class="search" bind:value={query} placeholder="Buscar nombre o teléfono" aria-label="Buscar invitados" /></div>

      {#if loading}
        <p class="empty-state">Cargando invitados…</p>
      {:else if filteredGuests.length === 0}
        <p class="empty-state">No encontramos invitados con esa búsqueda.</p>
      {:else}
        <div class="guest-list">
          {#each filteredGuests as guest (guest.id)}
            <article class:inactive={!guest.isActive} class="guest-card">
              <div class="guest-main">
                <div><h3>{guest.fullName}</h3><p>{guest.phone} · {guest.invitationType === 'reception' ? 'Misa y recepción' : 'Solo misa'}</p></div>
                <span class:confirmed={guest.status === 'confirmed'} class:declined={guest.status === 'declined'} class="status">{guest.status === 'confirmed' ? 'Confirmado' : guest.status === 'declined' ? 'No asistirá' : 'Pendiente'}</span>
              </div>
              {#if guest.invitationType === 'reception'}
                <div class="pass-row"><span>Asignados <strong>{guest.allowedPasses}</strong></span><span>Confirmados <strong>{guest.confirmedPasses}</strong></span><span>Sin usar <strong>{Math.max(0, guest.allowedPasses - guest.confirmedPasses)}</strong></span></div>
              {:else}
                <p class="ceremony-label">Acompañará únicamente en la ceremonia religiosa.</p>
              {/if}
              {#if guest.note}<p class="guest-note">“{guest.note}”</p>{/if}
              <div class="guest-actions">
                <a href={whatsappUrl(guest)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <button type="button" onclick={() => copyInvitation(guest)}>Copiar enlace</button>
                <button type="button" onclick={() => editGuest(guest)}>Editar</button>
                {#if guest.isActive && guest.invitationType === 'reception' && guest.status !== 'pending' && guest.allowedPasses > guest.confirmedPasses}
                  <button class="release-button" type="button" onclick={() => releasePasses(guest)}>Liberar {guest.allowedPasses - guest.confirmedPasses}</button>
                {/if}
              </div>
            </article>
          {/each}
        </div>
      {/if}
    </article>
  </section>
</main>

<style>
  .admin-header { min-height: 68px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0 max(1rem, calc((100vw - 1240px) / 2)); border-bottom: 1px solid rgba(70,80,68,.14); background: rgba(255,255,255,.76); backdrop-filter: blur(12px); }
  .brand { color: var(--gold); font-family: var(--serif); font-size: 1.55rem; text-decoration: none; }
  .brand i { font-size: .75em; }
  .admin-header div { display: flex; align-items: center; gap: 1rem; color: var(--muted); font-size: .8rem; }
  .admin-header button { padding: .55rem .8rem; border: 1px solid rgba(70,80,68,.22); background: transparent; color: var(--sage-dark); cursor: pointer; }
  .dashboard-shell { width: min(1240px, calc(100% - 2rem)); margin: 0 auto; padding: clamp(2rem, 5vw, 4rem) 0 5rem; }
  .dashboard-intro { display: grid; grid-template-columns: 1fr minmax(280px, 380px); gap: 2rem; align-items: end; }
  h1, h2, h3 { font-family: var(--serif); font-weight: 400; }
  h1 { margin: 0; font-size: clamp(2.5rem, 6vw, 4.8rem); }
  h2 { margin: .2rem 0 1.3rem; font-size: 2rem; }
  .dashboard-intro > div > p:last-child { max-width: 650px; color: var(--muted); line-height: 1.7; }
  .capacity-form { padding: 1.2rem; border: 1px solid rgba(70,80,68,.16); background: rgba(255,255,255,.72); }
  .capacity-form label, .form-panel > form > label, fieldset legend { display: block; margin-bottom: .5rem; color: var(--sage-dark); font-size: .68rem; font-weight: 750; letter-spacing: .1em; text-transform: uppercase; }
  .capacity-form div { display: grid; grid-template-columns: 1fr auto; }
  .capacity-form input, .capacity-form button { min-height: 44px; }
  .capacity-form button, .primary-button { border: 1px solid var(--sage-dark); background: var(--sage-dark); color: white; cursor: pointer; font-weight: 700; }
  .capacity-form small { display: block; margin-top: .6rem; color: var(--muted); line-height: 1.5; }
  input { padding: .75rem .85rem; border: 1px solid rgba(70,80,68,.22); background: white; color: var(--ink); font: inherit; outline: none; }
  input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(183,155,100,.13); }
  .notice { margin: 1.5rem 0 0; padding: .9rem 1rem; border: 1px solid; font-size: .86rem; }
  .notice--error { border-color: rgba(143,75,64,.25); background: #f8eeeb; color: #74443c; }
  .notice--success { border-color: rgba(65,109,78,.25); background: #edf5ee; color: #315f48; }
  .stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: .7rem; margin: 2rem 0; }
  .stats-grid article { min-height: 118px; display: flex; flex-direction: column; justify-content: space-between; padding: 1.1rem; border: 1px solid rgba(70,80,68,.15); background: rgba(255,255,255,.72); }
  .stats-grid span { color: var(--muted); font-size: .67rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  .stats-grid strong { color: var(--sage-dark); font-family: var(--serif); font-size: 2.3rem; font-weight: 400; }
  .stats-grid .stat-highlight { background: var(--sage-dark); }
  .stats-grid .stat-highlight span, .stats-grid .stat-highlight strong { color: white; }
  .stats-grid .hasAlert { border-color: rgba(183,155,100,.8); background: #fff9eb; }
  .workspace-grid { display: grid; grid-template-columns: minmax(300px, 380px) minmax(0, 1fr); gap: 1rem; align-items: start; }
  .panel { padding: clamp(1.2rem, 3vw, 2rem); border: 1px solid rgba(70,80,68,.16); background: rgba(255,255,255,.78); box-shadow: 0 18px 45px rgba(48,45,41,.06); }
  .form-panel { position: sticky; top: 1rem; scroll-margin-top: 1rem; }
  .form-panel form > label { margin-top: 1rem; }
  .form-panel input:not([type='radio']):not([type='checkbox']) { width: 100%; min-height: 46px; }
  fieldset { display: grid; grid-template-columns: 1fr; gap: .5rem; margin: 1.2rem 0 0; padding: 0; border: 0; }
  fieldset label { display: flex; gap: .55rem; align-items: center; min-height: 44px; padding: .7rem; border: 1px solid rgba(70,80,68,.16); color: var(--muted); cursor: pointer; font-size: .8rem; }
  fieldset label.active { border-color: var(--gold); background: rgba(183,155,100,.08); color: var(--sage-dark); }
  fieldset input { accent-color: var(--sage-dark); }
  .field-help { display: block; margin-top: .5rem; color: var(--muted); line-height: 1.45; }
  .mass-note { padding: .85rem; background: #f0f4ed; color: var(--sage-dark); font-size: .8rem; line-height: 1.55; }
  .active-check { display: flex !important; align-items: center; gap: .5rem; text-transform: none !important; letter-spacing: 0 !important; }
  .form-actions { display: flex; gap: .55rem; margin-top: 1.3rem; }
  .form-actions button { min-height: 45px; padding: .7rem 1rem; }
  .secondary-button { border: 1px solid rgba(70,80,68,.24); background: transparent; color: var(--sage-dark); cursor: pointer; }
  .panel-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
  .panel-heading h2 { margin-bottom: 0; }
  .search { width: min(280px, 100%); min-height: 44px; }
  .guest-list { display: grid; gap: .7rem; max-height: 920px; overflow: auto; padding-right: .25rem; }
  .guest-card { padding: 1rem; border: 1px solid rgba(70,80,68,.14); background: white; }
  .guest-card.inactive { opacity: .55; }
  .guest-main { display: flex; align-items: start; justify-content: space-between; gap: 1rem; }
  .guest-main h3 { margin: 0 0 .25rem; font-size: 1.2rem; }
  .guest-main p { margin: 0; color: var(--muted); font-size: .75rem; }
  .status { flex: 0 0 auto; padding: .34rem .52rem; border-radius: 99px; background: #eeeae0; color: var(--muted); font-size: .62rem; font-weight: 750; text-transform: uppercase; }
  .status.confirmed { background: #e4f0e5; color: #315f48; }
  .status.declined { background: #f3e7e4; color: #74443c; }
  .pass-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: .5rem; margin-top: .85rem; padding: .7rem 0; border-block: 1px solid rgba(70,80,68,.1); }
  .pass-row span { color: var(--muted); font-size: .68rem; text-align: center; }
  .pass-row strong { display: block; margin-top: .2rem; color: var(--ink); font-family: var(--serif); font-size: 1.25rem; }
  .ceremony-label, .guest-note { margin: .8rem 0 0; color: var(--muted); font-size: .78rem; line-height: 1.5; }
  .ceremony-label { padding: .65rem; background: #f0f4ed; }
  .guest-note { font-family: var(--serif); font-style: italic; }
  .guest-actions { display: flex; flex-wrap: wrap; gap: .45rem; margin-top: .85rem; }
  .guest-actions a, .guest-actions button { min-height: 34px; padding: .45rem .65rem; border: 1px solid rgba(70,80,68,.2); background: transparent; color: var(--sage-dark); cursor: pointer; font: inherit; font-size: .68rem; text-decoration: none; }
  .guest-actions a { border-color: #315f48; background: #315f48; color: white; }
  .guest-actions .release-button { border-color: var(--gold); color: #7a612e; }
  .empty-state { padding: 4rem 1rem; color: var(--muted); text-align: center; }
  @media (max-width: 980px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } .workspace-grid { grid-template-columns: 1fr; } .form-panel { position: static; } }
  @media (max-width: 680px) { .admin-header span { display: none; } .dashboard-intro { grid-template-columns: 1fr; } .stats-grid { grid-template-columns: repeat(2, 1fr); } .panel-heading { align-items: stretch; flex-direction: column; } .search { width: 100%; } .guest-main { flex-direction: column; } }
</style>
