<script lang="ts">
  type InvitationType = 'reception' | 'ceremony_only';
  type Status = 'pending' | 'confirmed' | 'declined';
  type Contact = { id?: string; contactName: string; phone: string; isPrimary?: boolean };
  type Guest = {
    id: string;
    token: string;
    invitationCode: string;
    fullName: string;
    contacts: Contact[];
    invitationType: InvitationType;
    allowedPasses: number;
    confirmedPasses: number;
    allowedAdults: number;
    allowedChildren: number;
    confirmedAdults: number;
    confirmedChildren: number;
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
    assignedAdults: number;
    assignedChildren: number;
    confirmedAdults: number;
    confirmedChildren: number;
    available: number;
    releasable: number;
    pendingInvitations: number;
    ceremonyConfirmed: number;
  };

  let { displayName }: { displayName: string } = $props();
  let guests = $state<Guest[]>([]);
  let stats = $state<Stats>({ capacity: 0, assigned: 0, confirmed: 0, assignedAdults: 0, assignedChildren: 0, confirmedAdults: 0, confirmedChildren: 0, available: 0, releasable: 0, pendingInvitations: 0, ceremonyConfirmed: 0 });
  let loading = $state(true);
  let saving = $state(false);
  let error = $state('');
  let success = $state('');
  let query = $state('');
  let capacityDraft = $state(0);
  let editingId = $state<string | null>(null);
  let fullName = $state('');
  let contacts = $state<Contact[]>([{ contactName: '', phone: '' }]);
  let invitationType = $state<InvitationType>('reception');
  let allowedAdults = $state(1);
  let allowedChildren = $state(0);
  let isActive = $state(true);

  const filteredGuests = $derived(guests.filter((guest) => {
    const needle = query.trim().toLocaleLowerCase('es-MX');
    return !needle
      || guest.fullName.toLocaleLowerCase('es-MX').includes(needle)
      || guest.invitationCode.toLocaleLowerCase('es-MX').includes(needle)
      || guest.contacts.some((contact) => contact.contactName.toLocaleLowerCase('es-MX').includes(needle) || contact.phone.includes(needle));
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
    contacts = [{ contactName: '', phone: '' }];
    invitationType = 'reception';
    allowedAdults = 1;
    allowedChildren = 0;
    isActive = true;
  }

  function addContact() {
    if (contacts.length < 5) contacts.push({ contactName: '', phone: '' });
  }

  function removeContact(index: number) {
    if (contacts.length > 1) contacts.splice(index, 1);
  }

  function editGuest(guest: Guest) {
    editingId = guest.id;
    fullName = guest.fullName;
    contacts = guest.contacts.map((contact) => ({ contactName: contact.contactName, phone: contact.phone.replace(/^\+52/, '') }));
    invitationType = guest.invitationType;
    allowedAdults = guest.invitationType === 'reception' ? guest.allowedAdults : 0;
    allowedChildren = guest.invitationType === 'reception' ? guest.allowedChildren : 0;
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
        contacts: contacts.map((contact) => ({ contactName: contact.contactName.trim(), phone: contact.phone.trim() })),
        invitationType,
        allowedAdults: invitationType === 'reception' ? Number(allowedAdults) : 0,
        allowedChildren: invitationType === 'reception' ? Number(allowedChildren) : 0,
        isActive
      };
      await api(editingId ? `/api/admin/guests/${editingId}` : '/api/admin/guests', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      success = editingId ? 'Invitación actualizada.' : 'Invitación creada. Ya puedes enviar el enlace a cada destinatario.';
      resetForm();
      await loadDashboard();
    } catch (reason) {
      error = reason instanceof Error ? reason.message : 'No pudimos guardar la invitación.';
    } finally {
      saving = false;
    }
  }

  async function releasePasses(guest: Guest) {
    const adults = guest.allowedAdults - guest.confirmedAdults;
    const children = guest.allowedChildren - guest.confirmedChildren;
    const amount = adults + children;
    if (amount <= 0 || !window.confirm(`¿Liberar ${amount} pases de ${guest.fullName}? Se liberarán ${adults} de adulto y ${children} de niño.`)) return;
    error = '';
    success = '';
    try {
      await api(`/api/admin/guests/${guest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'release' })
      });
      success = `${amount} ${amount === 1 ? 'pase liberado' : 'pases liberados'} y disponibles para otra invitación.`;
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
    return `${window.location.origin}/?i=${guest.token}`;
  }

  function whatsappUrl(guest: Guest, contact: Contact) {
    const link = invitationUrl(guest);
    const passes = guest.invitationType === 'ceremony_only'
      ? 'Esta invitación es para acompañarnos en la misa.'
      : `Su invitación incluye ${guest.allowedAdults} ${guest.allowedAdults === 1 ? 'adulto' : 'adultos'} y ${guest.allowedChildren} ${guest.allowedChildren === 1 ? 'niño' : 'niños'}.`;
    const message = `Hola ${contact.contactName}, Edgar y Brenda queremos compartir contigo nuestra invitación de boda para ${guest.fullName}.\n\n${passes}\nID de invitación: ${guest.invitationCode}\n\nAquí pueden ver la invitación completa y confirmar su asistencia: ${link}`;
    return `https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
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
    <div><p class="eyebrow">Boda Edgar & Brenda</p><h1>Invitados y pases</h1><p>Administra invitaciones familiares, destinatarios y pases de adultos y niños.</p></div>
    <form class="capacity-form" onsubmit={(event) => { event.preventDefault(); saveCapacity(); }}>
      <label for="capacity">Cupo total del salón</label>
      <div><input id="capacity" type="number" min="0" max="2000" bind:value={capacityDraft} /><button type="submit">Guardar cupo</button></div>
      <small>El cupo considera adultos y niños. Las invitaciones de solo misa no lo consumen.</small>
    </form>
  </section>

  {#if error}<p class="notice notice--error" role="alert">{error}</p>{/if}
  {#if success}<p class="notice notice--success" role="status">{success}</p>{/if}

  <section class="stats-grid" aria-label="Resumen de invitados">
    <article><span>Cupo salón</span><strong>{stats.capacity}</strong></article>
    <article><span>Pases asignados</span><strong>{stats.assigned}</strong><small>{stats.assignedAdults} adultos · {stats.assignedChildren} niños</small></article>
    <article class="stat-highlight"><span>Disponibles</span><strong>{stats.available}</strong></article>
    <article><span>Confirmados salón</span><strong>{stats.confirmed}</strong><small>{stats.confirmedAdults} adultos · {stats.confirmedChildren} niños</small></article>
    <article class:hasAlert={stats.releasable > 0}><span>Pases liberables</span><strong>{stats.releasable}</strong></article>
    <article><span>Confirmados solo misa</span><strong>{stats.ceremonyConfirmed}</strong></article>
  </section>

  <section class="workspace-grid">
    <article id="guest-form" class="panel form-panel">
      <p class="eyebrow">{editingId ? 'Editar invitación' : 'Nueva invitación'}</p>
      <h2>{editingId ? 'Actualizar invitación' : 'Agregar invitación'}</h2>
      <form onsubmit={(event) => { event.preventDefault(); saveGuest(); }}>
        <label for="full-name">Nombre mostrado en la invitación</label>
        <input id="full-name" bind:value={fullName} minlength="5" maxlength="120" required placeholder="Ej. Bárbara y Pablo" />

        <div class="contacts-heading"><div><span>Destinatarios</span><small>Cada uno recibirá el mismo enlace familiar.</small></div>{#if contacts.length < 5}<button type="button" onclick={addContact}>+ Agregar teléfono</button>{/if}</div>
        <div class="contact-list">
          {#each contacts as contact, index}
            <div class="contact-row">
              <label>Nombre<input bind:value={contact.contactName} minlength="2" maxlength="80" required placeholder={index === 0 ? 'Bárbara' : 'Pablo'} /></label>
              <label>Teléfono<input bind:value={contact.phone} inputmode="tel" required placeholder="4611234567" /></label>
              {#if contacts.length > 1}<button class="remove-contact" type="button" aria-label={`Quitar a ${contact.contactName || 'destinatario'}`} onclick={() => removeContact(index)}>×</button>{/if}
            </div>
          {/each}
        </div>

        <fieldset>
          <legend>Tipo de invitación</legend>
          <label class:active={invitationType === 'reception'}><input type="radio" bind:group={invitationType} value="reception" /> Misa y recepción</label>
          <label class:active={invitationType === 'ceremony_only'}><input type="radio" bind:group={invitationType} value="ceremony_only" /> Solo acompañar a misa</label>
        </fieldset>

        {#if invitationType === 'reception'}
          <div class="pass-inputs">
            <label for="adult-passes">Pases de adultos<input id="adult-passes" type="number" min="0" max="20" bind:value={allowedAdults} required /></label>
            <label for="child-passes">Pases de niños<input id="child-passes" type="number" min="0" max="20" bind:value={allowedChildren} required /></label>
          </div>
          <small class="field-help">Total de esta invitación: {Number(allowedAdults) + Number(allowedChildren)}. Hay {stats.available} pases disponibles.</small>
        {:else}
          <p class="mass-note">Esta invitación no consume lugares del salón. Los destinatarios solo confirmarán asistencia a misa.</p>
        {/if}

        {#if editingId}<label class="active-check"><input type="checkbox" bind:checked={isActive} /> Invitación activa</label>{/if}

        <div class="form-actions"><button class="primary-button" type="submit" disabled={saving}>{saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear invitación'}</button>{#if editingId}<button class="secondary-button" type="button" onclick={resetForm}>Cancelar</button>{/if}</div>
      </form>
    </article>

    <article class="panel guest-panel">
      <div class="panel-heading"><div><p class="eyebrow">Directorio</p><h2>{guests.length} invitaciones</h2></div><input class="search" bind:value={query} placeholder="Buscar nombre, teléfono o ID" aria-label="Buscar invitaciones" /></div>

      {#if loading}
        <p class="empty-state">Cargando invitaciones…</p>
      {:else if filteredGuests.length === 0}
        <p class="empty-state">No encontramos invitaciones con esa búsqueda.</p>
      {:else}
        <div class="guest-list">
          {#each filteredGuests as guest (guest.id)}
            <article class:inactive={!guest.isActive} class="guest-card">
              <div class="guest-main">
                <div><span class="invitation-id">{guest.invitationCode}</span><h3>{guest.fullName}</h3><p>{guest.invitationType === 'reception' ? 'Misa y recepción' : 'Solo misa'} · {guest.contacts.length} {guest.contacts.length === 1 ? 'destinatario' : 'destinatarios'}</p></div>
                <span class:confirmed={guest.status === 'confirmed'} class:declined={guest.status === 'declined'} class="status">{guest.status === 'confirmed' ? 'Confirmado' : guest.status === 'declined' ? 'No asistirá' : 'Pendiente'}</span>
              </div>
              <div class="contact-summary">{#each guest.contacts as contact}<span>{contact.contactName} · {contact.phone}</span>{/each}</div>
              {#if guest.invitationType === 'reception'}
                <div class="pass-row"><span>Asignados <strong>{guest.allowedPasses}</strong><small>{guest.allowedAdults} A · {guest.allowedChildren} N</small></span><span>Confirmados <strong>{guest.confirmedPasses}</strong><small>{guest.confirmedAdults} A · {guest.confirmedChildren} N</small></span><span>Sin usar <strong>{Math.max(0, guest.allowedPasses - guest.confirmedPasses)}</strong></span></div>
              {:else}
                <p class="ceremony-label">Acompañarán únicamente en la ceremonia religiosa.</p>
              {/if}
              {#if guest.note}<p class="guest-note">“{guest.note}”</p>{/if}
              <div class="guest-actions">
                {#each guest.contacts as contact}<a href={whatsappUrl(guest, contact)} target="_blank" rel="noopener noreferrer">WhatsApp · {contact.contactName}</a>{/each}
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
  .capacity-form label, .form-panel > form > label, fieldset legend, .contacts-heading span, .pass-inputs label, .contact-row label { display: block; margin-bottom: .5rem; color: var(--sage-dark); font-size: .68rem; font-weight: 750; letter-spacing: .1em; text-transform: uppercase; }
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
  .stats-grid article { min-height: 124px; display: flex; flex-direction: column; justify-content: space-between; padding: 1.1rem; border: 1px solid rgba(70,80,68,.15); background: rgba(255,255,255,.72); }
  .stats-grid span { color: var(--muted); font-size: .67rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  .stats-grid strong { color: var(--sage-dark); font-family: var(--serif); font-size: 2.3rem; font-weight: 400; }
  .stats-grid small { color: var(--muted); font-size: .62rem; }
  .stats-grid .stat-highlight { background: var(--sage-dark); }
  .stats-grid .stat-highlight span, .stats-grid .stat-highlight strong { color: white; }
  .stats-grid .hasAlert { border-color: rgba(183,155,100,.8); background: #fff9eb; }
  .workspace-grid { display: grid; grid-template-columns: minmax(330px, 420px) minmax(0, 1fr); gap: 1rem; align-items: start; }
  .panel { padding: clamp(1.2rem, 3vw, 2rem); border: 1px solid rgba(70,80,68,.16); background: rgba(255,255,255,.78); box-shadow: 0 18px 45px rgba(48,45,41,.06); }
  .form-panel { position: sticky; top: 1rem; scroll-margin-top: 1rem; }
  .form-panel form > label { margin-top: 1rem; }
  .form-panel input:not([type='radio']):not([type='checkbox']) { width: 100%; min-height: 46px; }
  .contacts-heading { display: flex; align-items: end; justify-content: space-between; gap: .5rem; margin-top: 1.2rem; }
  .contacts-heading span { margin: 0; }
  .contacts-heading small { display: block; margin-top: .2rem; color: var(--muted); font-size: .68rem; }
  .contacts-heading button { border: 0; background: none; color: var(--sage-dark); cursor: pointer; font-size: .72rem; font-weight: 700; }
  .contact-list { display: grid; gap: .55rem; margin-top: .7rem; }
  .contact-row { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; padding: .75rem; border: 1px solid rgba(70,80,68,.14); background: rgba(242,244,238,.55); }
  .contact-row label { margin: 0; }
  .contact-row input { margin-top: .35rem; letter-spacing: normal; text-transform: none; }
  .remove-contact { position: absolute; top: -.55rem; right: -.45rem; width: 24px; height: 24px; border: 1px solid rgba(120,70,60,.25); border-radius: 50%; background: white; color: #74443c; cursor: pointer; }
  fieldset { display: grid; grid-template-columns: 1fr; gap: .5rem; margin: 1.2rem 0 0; padding: 0; border: 0; }
  fieldset label { display: flex; gap: .55rem; align-items: center; min-height: 44px; padding: .7rem; border: 1px solid rgba(70,80,68,.16); color: var(--muted); cursor: pointer; font-size: .8rem; }
  fieldset label.active { border-color: var(--gold); background: rgba(183,155,100,.08); color: var(--sage-dark); }
  fieldset input { accent-color: var(--sage-dark); }
  .pass-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: .65rem; margin-top: 1rem; }
  .pass-inputs label { margin: 0; }
  .pass-inputs input { margin-top: .4rem; letter-spacing: normal; }
  .field-help { display: block; margin-top: .5rem; color: var(--muted); line-height: 1.45; }
  .mass-note { padding: .85rem; background: #f0f4ed; color: var(--sage-dark); font-size: .8rem; line-height: 1.55; }
  .active-check { display: flex !important; align-items: center; gap: .5rem; text-transform: none !important; letter-spacing: 0 !important; }
  .form-actions { display: flex; gap: .55rem; margin-top: 1.3rem; }
  .form-actions button { min-height: 45px; padding: .7rem 1rem; }
  .secondary-button { border: 1px solid rgba(70,80,68,.24); background: transparent; color: var(--sage-dark); cursor: pointer; }
  .panel-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
  .panel-heading h2 { margin-bottom: 0; }
  .search { width: min(280px, 100%); min-height: 44px; }
  .guest-list { display: grid; gap: .7rem; max-height: 980px; overflow: auto; padding-right: .25rem; }
  .guest-card { padding: 1rem; border: 1px solid rgba(70,80,68,.14); background: white; }
  .guest-card.inactive { opacity: .55; }
  .guest-main { display: flex; align-items: start; justify-content: space-between; gap: 1rem; }
  .invitation-id { display: inline-block; margin-bottom: .35rem; padding: .18rem .4rem; background: #f1eee6; color: #725e37; font-size: .62rem; font-weight: 800; letter-spacing: .08em; }
  .guest-main h3 { margin: 0 0 .25rem; font-size: 1.2rem; }
  .guest-main p { margin: 0; color: var(--muted); font-size: .75rem; }
  .status { flex: 0 0 auto; padding: .34rem .52rem; border-radius: 99px; background: #eeeae0; color: var(--muted); font-size: .62rem; font-weight: 750; text-transform: uppercase; }
  .status.confirmed { background: #e4f0e5; color: #315f48; }
  .status.declined { background: #f3e7e4; color: #74443c; }
  .contact-summary { display: flex; flex-wrap: wrap; gap: .35rem; margin-top: .7rem; }
  .contact-summary span { padding: .25rem .42rem; background: #f5f5f1; color: var(--muted); font-size: .66rem; }
  .pass-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: .5rem; margin-top: .85rem; padding: .7rem 0; border-block: 1px solid rgba(70,80,68,.1); }
  .pass-row span { color: var(--muted); font-size: .68rem; text-align: center; }
  .pass-row strong { display: block; margin-top: .2rem; color: var(--ink); font-family: var(--serif); font-size: 1.25rem; }
  .pass-row small { display: block; margin-top: .1rem; font-size: .6rem; }
  .ceremony-label, .guest-note { margin: .8rem 0 0; color: var(--muted); font-size: .78rem; line-height: 1.5; }
  .ceremony-label { padding: .65rem; background: #f0f4ed; }
  .guest-note { font-family: var(--serif); font-style: italic; }
  .guest-actions { display: flex; flex-wrap: wrap; gap: .45rem; margin-top: .85rem; }
  .guest-actions a, .guest-actions button { min-height: 34px; padding: .45rem .65rem; border: 1px solid rgba(70,80,68,.2); background: transparent; color: var(--sage-dark); cursor: pointer; font: inherit; font-size: .68rem; text-decoration: none; }
  .guest-actions a { border-color: #315f48; background: #315f48; color: white; }
  .guest-actions .release-button { border-color: var(--gold); color: #7a612e; }
  .empty-state { padding: 4rem 1rem; color: var(--muted); text-align: center; }
  @media (max-width: 980px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } .workspace-grid { grid-template-columns: 1fr; } .form-panel { position: static; } }
  @media (max-width: 680px) { .admin-header span { display: none; } .dashboard-intro { grid-template-columns: 1fr; } .stats-grid { grid-template-columns: repeat(2, 1fr); } .panel-heading { align-items: stretch; flex-direction: column; } .search { width: 100%; } .guest-main { flex-direction: column; } .contact-row, .pass-inputs { grid-template-columns: 1fr; } }
</style>
