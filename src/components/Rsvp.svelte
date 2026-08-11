<script lang="ts">
  import { onMount } from 'svelte';

  type Invitation = {
    token: string;
    fullName: string;
    maskedPhone: string;
    allowedPasses: number;
    confirmedPasses: number;
    status: 'pending' | 'confirmed' | 'declined';
    invitationType: 'reception' | 'ceremony_only';
  };

  let { confirmationWhatsApp }: { confirmationWhatsApp: string } = $props();

  let search = $state('');
  let website = $state('');
  let invitation = $state<Invitation | null>(null);
  let selectedPasses = $state(1);
  let attending = $state(true);
  let note = $state('');
  let isSearching = $state(false);
  let isConfirming = $state(false);
  let searchError = $state('');
  let confirmationError = $state('');
  let confirmationComplete = $state(false);

  async function readJson(response: Response) {
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) throw new Error('Respuesta inesperada del servidor.');
    return response.json();
  }

  async function findInvitation(token?: string) {
    if ((!token && search.trim().length < 5) || isSearching) return;
    isSearching = true;
    searchError = '';
    confirmationComplete = false;

    try {
      const response = await fetch('/api/invitations/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: search.trim(), token, website })
      });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload.message ?? 'No pudimos encontrar tu invitación.');

      invitation = payload.invitation;
      selectedPasses = invitation?.invitationType === 'ceremony_only' ? 0 : Math.max(1, invitation?.confirmedPasses || 1);
      attending = invitation?.status !== 'declined';
    } catch (error) {
      invitation = null;
      searchError = error instanceof Error ? error.message : 'No pudimos encontrar tu invitación.';
    } finally {
      isSearching = false;
    }
  }

  async function confirmAttendance() {
    if (!invitation || isConfirming) return;
    isConfirming = true;
    confirmationError = '';

    try {
      const response = await fetch('/api/invitations/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: invitation.token,
          attending,
          passes: invitation.invitationType === 'ceremony_only' ? 0 : attending ? selectedPasses : 0,
          note: note.trim()
        })
      });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload.message ?? 'No pudimos guardar tu confirmación.');

      invitation = payload.invitation;
      confirmationComplete = true;
    } catch (error) {
      confirmationError = error instanceof Error ? error.message : 'No pudimos guardar tu confirmación.';
    } finally {
      isConfirming = false;
    }
  }

  function startAgain() {
    search = '';
    invitation = null;
    note = '';
    searchError = '';
    confirmationError = '';
    confirmationComplete = false;
    const url = new URL(window.location.href);
    url.searchParams.delete('i');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }

  onMount(() => {
    const token = new URL(window.location.href).searchParams.get('i');
    if (token) findInvitation(token);
  });

  let whatsappUrl = $derived.by(() => {
    if (!invitation) return '#';
    const message = attending
      ? invitation.invitationType === 'ceremony_only'
        ? `Hola Edgar y Brenda, soy ${invitation.fullName}. Confirmo que los acompañaré en su misa de boda.`
        : `Hola Edgar y Brenda, soy ${invitation.fullName}. Confirmo mi asistencia a su boda con ${invitation.confirmedPasses} ${invitation.confirmedPasses === 1 ? 'pase' : 'pases'}.`
      : `Hola Edgar y Brenda, soy ${invitation.fullName}. Gracias por invitarme. En esta ocasión no podré acompañarlos.`;
    return `https://wa.me/${confirmationWhatsApp}?text=${encodeURIComponent(message)}`;
  });
</script>

<section id="confirmacion" class="story-section rsvp reveal-section" aria-labelledby="rsvp-title">
  <div class="section-shell section-shell--narrow">
    <p class="eyebrow">Confirmación de asistencia</p>
    <h2 id="rsvp-title">Tu lugar en nuestra historia</h2>
    <p class="lead">Escribe el nombre completo o el teléfono con el que recibiste tu invitación.</p>

    {#if !invitation}
      <form class="invitation-search" onsubmit={(event) => { event.preventDefault(); findInvitation(); }}>
        <label for="guest-search">Nombre completo o teléfono</label>
        <div class="invitation-search__row">
          <input
            id="guest-search"
            bind:value={search}
            autocomplete="name"
            minlength="5"
            placeholder="Ej. María López o 4611234567"
            required
          />
          <button class="story-button" type="submit" disabled={isSearching || search.trim().length < 5}>
            {isSearching ? 'Buscando…' : 'Buscar invitación'}
          </button>
        </div>
        <div class="form-honeypot" aria-hidden="true">
          <label for="website">Sitio web</label>
          <input id="website" bind:value={website} tabindex="-1" autocomplete="off" />
        </div>
        {#if searchError}<p class="form-message form-message--error" role="alert">{searchError}</p>{/if}
        <small>Usa los datos exactamente como fueron registrados. Tu información no se muestra públicamente.</small>
      </form>
    {:else if confirmationComplete}
      <div class="invitation-card invitation-card--success" aria-live="polite">
        <span class="invitation-card__ornament" aria-hidden="true">✦</span>
        <p class="eyebrow">Confirmación guardada</p>
        <h3>Gracias, {invitation.fullName}</h3>
        <p>
          {#if invitation.status === 'confirmed'}
            {#if invitation.invitationType === 'ceremony_only'}
              Nos dará mucho gusto que nos acompañes en nuestra misa.
            {:else}
              Te esperamos con {invitation.confirmedPasses} {invitation.confirmedPasses === 1 ? 'lugar confirmado' : 'lugares confirmados'}.
            {/if}
          {:else}
            Gracias por avisarnos. Te llevaremos con cariño en este capítulo.
          {/if}
        </p>
        <div class="confirmation-actions">
          <a class="story-button whatsapp-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Avisarnos por WhatsApp <span aria-hidden="true">↗</span></a>
          <button class="text-button" type="button" onclick={startAgain}>Consultar otra invitación</button>
        </div>
      </div>
    {:else}
      <div class="invitation-card">
        <span class="invitation-card__ornament" aria-hidden="true">✦</span>
        <p class="eyebrow">Invitación encontrada</p>
        <h3>{invitation.fullName}</h3>
        <p class="invitation-phone">Teléfono registrado: {invitation.maskedPhone}</p>
        {#if invitation.invitationType === 'ceremony_only'}
          <div class="pass-summary pass-summary--ceremony">
            <strong aria-hidden="true">✦</strong>
            <span>Invitación para acompañarnos en la misa</span>
          </div>
        {:else}
          <div class="pass-summary">
            <strong>{invitation.allowedPasses}</strong>
            <span>{invitation.allowedPasses === 1 ? 'pase asignado' : 'pases asignados'}</span>
          </div>
        {/if}

        <fieldset class="attendance-options">
          <legend>{invitation.invitationType === 'ceremony_only' ? '¿Podrás acompañarnos en la misa?' : '¿Podrás acompañarnos?'}</legend>
          <label class:active={attending}>
            <input type="radio" bind:group={attending} value={true} />
            {invitation.invitationType === 'ceremony_only' ? 'Sí, asistiré a misa' : 'Sí, con gusto'}
          </label>
          <label class:active={!attending}>
            <input type="radio" bind:group={attending} value={false} />
            No podré asistir
          </label>
        </fieldset>

        {#if attending && invitation.invitationType === 'reception'}
          <label class="pass-selector" for="confirmed-passes">
            Personas que asistirán
            <select id="confirmed-passes" bind:value={selectedPasses}>
              {#each Array.from({ length: invitation.allowedPasses }, (_, index) => index + 1) as amount}
                <option value={amount}>{amount}</option>
              {/each}
            </select>
          </label>
        {/if}

        <label class="note-field" for="guest-note">
          Mensaje para los novios <span>(opcional)</span>
          <textarea id="guest-note" bind:value={note} maxlength="280" rows="3" placeholder="Escribe aquí algún detalle que debamos saber"></textarea>
        </label>

        {#if confirmationError}<p class="form-message form-message--error" role="alert">{confirmationError}</p>{/if}

        <div class="confirmation-actions">
          <button class="story-button" type="button" onclick={confirmAttendance} disabled={isConfirming}>
            {isConfirming ? 'Guardando…' : 'Guardar confirmación'}
          </button>
          <button class="text-button" type="button" onclick={startAgain}>No soy yo</button>
        </div>
      </div>
    {/if}
  </div>
</section>
