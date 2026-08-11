<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  type Invitation = {
    token: string;
    invitationCode: string;
    fullName: string;
    maskedPhone: string;
    recipientNames: string[];
    allowedPasses: number;
    confirmedPasses: number;
    allowedAdults: number;
    allowedChildren: number;
    confirmedAdults: number;
    confirmedChildren: number;
    status: 'pending' | 'confirmed' | 'declined';
    invitationType: 'reception' | 'ceremony_only';
  };

  let { confirmationWhatsApp }: { confirmationWhatsApp: string } = $props();

  let search = $state('');
  let website = $state('');
  let invitation = $state<Invitation | null>(null);
  let selectedAdults = $state(1);
  let selectedChildren = $state(0);
  let attending = $state(true);
  let note = $state('');
  let isSearching = $state(false);
  let isConfirming = $state(false);
  let searchError = $state('');
  let confirmationError = $state('');
  let confirmationComplete = $state(false);
  let redirectTimer: ReturnType<typeof setTimeout> | null = null;

  async function readJson(response: Response) {
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) throw new Error('Respuesta inesperada del servidor.');
    return response.json();
  }

  function populateSelection(current: Invitation) {
    selectedAdults = current.status === 'confirmed' ? current.confirmedAdults : current.allowedAdults;
    selectedChildren = current.status === 'confirmed' ? current.confirmedChildren : current.allowedChildren;
    attending = current.status !== 'declined';
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
      if (invitation) populateSelection(invitation);
    } catch (error) {
      invitation = null;
      searchError = error instanceof Error ? error.message : 'No pudimos encontrar tu invitación.';
    } finally {
      isSearching = false;
    }
  }

  function goToOfficialInvitation() {
    if (!invitation) return;
    window.location.assign(`/?i=${encodeURIComponent(invitation.token)}&confirmado=1`);
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
          adults: invitation.invitationType === 'ceremony_only' || !attending ? 0 : Number(selectedAdults),
          children: invitation.invitationType === 'ceremony_only' || !attending ? 0 : Number(selectedChildren),
          note: note.trim()
        })
      });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload.message ?? 'No pudimos guardar tu confirmación.');

      invitation = payload.invitation;
      confirmationComplete = true;
      redirectTimer = setTimeout(goToOfficialInvitation, 3000);
    } catch (error) {
      confirmationError = error instanceof Error ? error.message : 'No pudimos guardar tu confirmación.';
    } finally {
      isConfirming = false;
    }
  }

  function startAgain() {
    if (redirectTimer) clearTimeout(redirectTimer);
    search = '';
    invitation = null;
    note = '';
    searchError = '';
    confirmationError = '';
    confirmationComplete = false;
    const url = new URL(window.location.href);
    url.searchParams.delete('i');
    url.searchParams.delete('confirmado');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }

  onMount(() => {
    const token = new URL(window.location.href).searchParams.get('i');
    if (token) findInvitation(token);
  });

  onDestroy(() => {
    if (redirectTimer) clearTimeout(redirectTimer);
  });

  let whatsappUrl = $derived.by(() => {
    if (!invitation) return '#';
    const message = attending
      ? invitation.invitationType === 'ceremony_only'
        ? `Hola Edgar y Brenda, somos ${invitation.fullName}. Confirmamos que los acompañaremos en su misa de boda. Invitación ${invitation.invitationCode}.`
        : `Hola Edgar y Brenda, somos ${invitation.fullName}. Confirmamos ${invitation.confirmedAdults} ${invitation.confirmedAdults === 1 ? 'adulto' : 'adultos'} y ${invitation.confirmedChildren} ${invitation.confirmedChildren === 1 ? 'niño' : 'niños'}. Invitación ${invitation.invitationCode}.`
      : `Hola Edgar y Brenda, somos ${invitation.fullName}. Gracias por invitarnos. En esta ocasión no podremos acompañarlos. Invitación ${invitation.invitationCode}.`;
    return `https://wa.me/${confirmationWhatsApp}?text=${encodeURIComponent(message)}`;
  });
</script>

<section id="confirmacion" class="story-section rsvp reveal-section" aria-labelledby="rsvp-title">
  <div class="section-shell section-shell--narrow">
    <p class="eyebrow">Confirmación de asistencia</p>
    <h2 id="rsvp-title">Tu lugar en nuestra historia</h2>
    <p class="lead">Busca la invitación con el nombre, cualquiera de los teléfonos registrados o su ID.</p>

    {#if !invitation}
      <form class="invitation-search" onsubmit={(event) => { event.preventDefault(); findInvitation(); }}>
        <label for="guest-search">Nombre, teléfono o ID de invitación</label>
        <div class="invitation-search__row">
          <input id="guest-search" bind:value={search} autocomplete="name" minlength="5" placeholder="Ej. Bárbara y Pablo, 4611234567 o EB-000001" required />
          <button class="story-button" type="submit" disabled={isSearching || search.trim().length < 5}>{isSearching ? 'Buscando…' : 'Buscar invitación'}</button>
        </div>
        <div class="form-honeypot" aria-hidden="true">
          <label for="website">Sitio web</label>
          <input id="website" bind:value={website} tabindex="-1" autocomplete="off" />
        </div>
        {#if searchError}<p class="form-message form-message--error" role="alert">{searchError}</p>{/if}
        <small>El ID aparece en el mensaje que recibiste. Tu información no se muestra públicamente.</small>
      </form>
    {:else if confirmationComplete}
      <div class="invitation-card invitation-card--success" aria-live="polite">
        <span class="invitation-card__ornament" aria-hidden="true">✦</span>
        <p class="eyebrow">Confirmación guardada · {invitation.invitationCode}</p>
        <h3>Gracias, {invitation.fullName}</h3>
        <p>
          {#if invitation.status === 'confirmed'}
            {#if invitation.invitationType === 'ceremony_only'}
              Nos dará mucho gusto que nos acompañen en nuestra misa.
            {:else}
              Confirmamos {invitation.confirmedAdults} {invitation.confirmedAdults === 1 ? 'adulto' : 'adultos'} y {invitation.confirmedChildren} {invitation.confirmedChildren === 1 ? 'niño' : 'niños'}.
            {/if}
          {:else}
            Gracias por avisarnos. Los llevaremos con cariño en este capítulo.
          {/if}
        </p>
        <p class="redirect-note">En unos segundos volverán al inicio para seguir viendo la invitación oficial.</p>
        <div class="confirmation-actions">
          <button class="story-button" type="button" onclick={goToOfficialInvitation}>Ver invitación completa</button>
          <a class="story-button whatsapp-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Avisarnos por WhatsApp <span aria-hidden="true">↗</span></a>
          <button class="text-button" type="button" onclick={startAgain}>Consultar otra invitación</button>
        </div>
      </div>
    {:else}
      <div class="invitation-card">
        <span class="invitation-card__ornament" aria-hidden="true">✦</span>
        <p class="eyebrow">Invitación encontrada · {invitation.invitationCode}</p>
        <h3>{invitation.fullName}</h3>
        <p class="invitation-phone">Teléfono verificado: {invitation.maskedPhone}</p>
        {#if invitation.invitationType === 'ceremony_only'}
          <div class="pass-summary pass-summary--ceremony"><strong aria-hidden="true">✦</strong><span>Invitación para acompañarnos en la misa</span></div>
        {:else}
          <div class="pass-summary pass-summary--split">
            <span><strong>{invitation.allowedAdults}</strong>{invitation.allowedAdults === 1 ? 'adulto' : 'adultos'}</span>
            <span><strong>{invitation.allowedChildren}</strong>{invitation.allowedChildren === 1 ? 'niño' : 'niños'}</span>
          </div>
        {/if}

        <fieldset class="attendance-options">
          <legend>{invitation.invitationType === 'ceremony_only' ? '¿Podrán acompañarnos en la misa?' : '¿Podrán acompañarnos?'}</legend>
          <label class:active={attending}><input type="radio" bind:group={attending} value={true} />{invitation.invitationType === 'ceremony_only' ? 'Sí, asistiremos a misa' : 'Sí, con gusto'}</label>
          <label class:active={!attending}><input type="radio" bind:group={attending} value={false} />No podremos asistir</label>
        </fieldset>

        {#if attending && invitation.invitationType === 'reception'}
          <div class="guest-count-selectors">
            <label for="confirmed-adults">Adultos que asistirán<select id="confirmed-adults" bind:value={selectedAdults}>{#each Array.from({ length: invitation.allowedAdults + 1 }, (_, index) => index) as amount}<option value={amount}>{amount}</option>{/each}</select></label>
            <label for="confirmed-children">Niños que asistirán<select id="confirmed-children" bind:value={selectedChildren}>{#each Array.from({ length: invitation.allowedChildren + 1 }, (_, index) => index) as amount}<option value={amount}>{amount}</option>{/each}</select></label>
          </div>
          {#if Number(selectedAdults) + Number(selectedChildren) < 1}<p class="form-message form-message--error">Selecciona al menos una persona para confirmar.</p>{/if}
        {/if}

        <label class="note-field" for="guest-note">Mensaje para los novios <span>(opcional)</span><textarea id="guest-note" bind:value={note} maxlength="280" rows="3" placeholder="Escribe aquí algún detalle que debamos saber"></textarea></label>

        {#if confirmationError}<p class="form-message form-message--error" role="alert">{confirmationError}</p>{/if}

        <div class="confirmation-actions">
          <button class="story-button" type="button" onclick={confirmAttendance} disabled={isConfirming || (attending && invitation.invitationType === 'reception' && Number(selectedAdults) + Number(selectedChildren) < 1)}>{isConfirming ? 'Guardando…' : 'Guardar confirmación'}</button>
          <button class="text-button" type="button" onclick={startAgain}>No es nuestra invitación</button>
        </div>
      </div>
    {/if}
  </div>
</section>
