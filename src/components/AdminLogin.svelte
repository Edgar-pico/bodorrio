<script lang="ts">
  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');

  async function login() {
    if (loading) return;
    loading = true;
    error = '';

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? 'No pudimos iniciar sesión.');
      window.location.assign('/admin');
    } catch (reason) {
      error = reason instanceof Error ? reason.message : 'No pudimos iniciar sesión.';
    } finally {
      loading = false;
    }
  }
</script>

<main class="login-shell">
  <section class="login-card" aria-labelledby="admin-login-title">
    <a class="back-link" href="/">← Volver a la invitación</a>
    <span class="monogram" aria-hidden="true">E <i>&</i> B</span>
    <p class="eyebrow">Administración privada</p>
    <h1 id="admin-login-title">Panel de invitados</h1>
    <p class="intro">Inicia sesión para asignar pases, registrar invitados y consultar confirmaciones.</p>

    <form onsubmit={(event) => { event.preventDefault(); login(); }}>
      <label for="admin-email">Correo electrónico</label>
      <input id="admin-email" type="email" bind:value={email} autocomplete="username" required />

      <label for="admin-password">Contraseña</label>
      <input id="admin-password" type="password" bind:value={password} autocomplete="current-password" minlength="8" required />

      {#if error}<p class="login-error" role="alert">{error}</p>{/if}

      <button type="submit" disabled={loading}>{loading ? 'Ingresando…' : 'Iniciar sesión'}</button>
    </form>
  </section>
</main>

<style>
  .login-shell { min-height: 100vh; display: grid; place-items: center; padding: 1.25rem; }
  .login-card { width: min(460px, 100%); padding: clamp(2rem, 6vw, 3.5rem); border: 1px solid rgba(70,80,68,.18); background: rgba(255,255,255,.84); box-shadow: 0 30px 90px rgba(48,45,41,.13); text-align: center; }
  .back-link { display: block; margin-bottom: 2rem; color: var(--muted); font-size: .76rem; text-align: left; text-decoration: none; }
  .monogram { display: block; margin-bottom: 1.5rem; color: var(--gold); font-family: var(--serif); font-size: 2.2rem; }
  .monogram i { font-size: .72em; font-weight: 400; }
  h1 { margin: .3rem 0 1rem; font-family: var(--serif); font-size: clamp(2rem, 8vw, 3rem); font-weight: 400; }
  .intro { margin: 0 auto 2rem; color: var(--muted); line-height: 1.7; }
  form { text-align: left; }
  label { display: block; margin: 1rem 0 .45rem; color: var(--sage-dark); font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
  input { width: 100%; min-height: 50px; padding: .8rem 1rem; border: 1px solid rgba(70,80,68,.24); background: white; color: var(--ink); font: inherit; outline: none; }
  input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(183,155,100,.14); }
  button { width: 100%; min-height: 50px; margin-top: 1.5rem; border: 1px solid var(--sage-dark); background: var(--sage-dark); color: white; cursor: pointer; font: inherit; font-weight: 700; }
  button:disabled { cursor: wait; opacity: .6; }
  .login-error { margin: 1rem 0 0; padding: .75rem; border: 1px solid rgba(143,75,64,.25); background: rgba(143,75,64,.07); color: #74443c; font-size: .82rem; text-align: center; }
</style>
