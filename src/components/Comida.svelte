<script lang="ts">
  import { weddingConfig } from '../lib/wedding-config';

  const details = weddingConfig.religious;
</script>

<section id="recepcion" class="reception-section reveal-section" aria-labelledby="reception-title">
  <picture class="reception-background" aria-hidden="true">
    <source srcset="/recepcion-boda.webp" type="image/webp" />
    <img
      src="/recepcion-boda.jpg"
      alt=""
      width="1536"
      height="1024"
      loading="lazy"
      decoding="async"
    />
  </picture>

  <div class="reception-overlay" aria-hidden="true"></div>

  <div class="reception-content">
    <div class="reception-copy">
      <p class="eyebrow">Después de la ceremonia</p>
      <h2 id="reception-title">Celebremos juntos</h2>
      <p class="reception-intro">
        La historia continuará con una tarde para brindar, compartir y crear nuevos recuerdos.
      </p>

      <div class="reception-card">
        <span class="reception-star" aria-hidden="true">✦</span>
        <h3>{details.receptionName ?? 'Recepción'}</h3>
        <p class="reception-time">Recepción · {details.receptionTimeLabel ?? 'Horario por confirmar'}</p>

        {#if details.receptionAddress}
          <address>{details.receptionAddress}</address>
        {/if}

        {#if details.receptionMapUrl}
          <a
            class="reception-button"
            href={details.receptionMapUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver ubicación <span aria-hidden="true">↗</span>
          </a>
        {:else}
          <small>Compartiremos los detalles muy pronto.</small>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .reception-section {
    position: relative;
    min-height: clamp(760px, 100svh, 980px);
    display: grid;
    place-items: center;
    overflow: hidden;
    isolation: isolate;
    color: #4c4032;
    background: #f4ecdd;
  }

  .reception-background,
  .reception-overlay {
    position: absolute;
    inset: 0;
  }

  .reception-background {
    z-index: -3;
    pointer-events: none;
    user-select: none;
  }

  .reception-background,
  .reception-background img {
    width: 100%;
    height: 100%;
  }

  .reception-background img {
    object-fit: cover;
    object-position: 50% 50%;
  }

  .reception-overlay {
    z-index: -2;
    background:
      linear-gradient(90deg, rgba(251, 247, 239, 0.2) 0%, rgba(251, 247, 239, 0.06) 55%, rgba(245, 237, 223, 0.02) 100%),
      linear-gradient(180deg, rgba(255,255,255,0.08), rgba(216,193,151,0.08));
    pointer-events: none;
  }

  .reception-content {
    width: min(1500px, calc(100% - 2rem));
    min-height: inherit;
    margin-inline: auto;
    display: grid;
    align-items: center;
    grid-template-columns: minmax(0, 0.95fr) minmax(380px, 0.72fr);
    padding: clamp(9rem, 17vh, 12.5rem) clamp(1rem, 4vw, 4rem) clamp(3rem, 8vh, 6rem);
  }

  .reception-copy {
    grid-column: 1;
    width: min(640px, 100%);
    justify-self: center;
    text-align: center;
  }

  .eyebrow {
    margin: 0 0 0.9rem;
    color: #9a7737;
    font-size: 0.7rem;
    font-weight: 750;
    letter-spacing: 0.26em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    color: #564635;
    font-family: var(--serif);
    font-size: clamp(3rem, 6.2vw, 5.7rem);
    font-weight: 400;
    line-height: 0.98;
    text-wrap: balance;
    text-shadow: 0 1px 0 rgba(255,255,255,0.7);
  }

  .reception-intro {
    max-width: 560px;
    margin: 1.25rem auto 1.8rem;
    color: #766654;
    font-family: var(--serif);
    font-size: clamp(1rem, 1.6vw, 1.18rem);
    line-height: 1.75;
    text-wrap: pretty;
  }

  .reception-card {
    width: min(535px, 100%);
    margin-inline: auto;
    padding: clamp(1.5rem, 3.2vw, 2.35rem);
    border: 1px solid rgba(164, 126, 59, 0.38);
    border-radius: 2px;
    background: rgba(255, 252, 246, 0.72);
    box-shadow: 0 24px 70px rgba(91, 70, 42, 0.13);
    backdrop-filter: blur(11px);
    -webkit-backdrop-filter: blur(11px);
  }

  .reception-star {
    display: block;
    margin-bottom: 0.8rem;
    color: #ae8541;
    font-size: 0.9rem;
  }

  .reception-card h3 {
    margin: 0;
    color: #4d4033;
    font-family: var(--serif);
    font-size: clamp(1.55rem, 3.3vw, 2.2rem);
    font-weight: 400;
    line-height: 1.25;
    text-wrap: balance;
  }

  .reception-time {
    margin: 1rem 0 0;
    color: #987238;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  address {
    max-width: 430px;
    margin: 1rem auto 0;
    color: #756858;
    font-family: var(--serif);
    font-size: 0.98rem;
    font-style: normal;
    line-height: 1.65;
  }

  .reception-button {
    min-height: 48px;
    margin-top: 1.45rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;
    padding: 0.88rem 1.35rem;
    border: 1px solid rgba(128, 96, 48, 0.58);
    border-radius: 999px;
    background: rgba(132, 104, 61, 0.08);
    color: #5f4b32;
    font-size: 0.82rem;
    font-weight: 750;
    letter-spacing: 0.04em;
    text-decoration: none;
    transition: transform 220ms ease, background 220ms ease, box-shadow 220ms ease;
  }

  .reception-button:hover {
    transform: translateY(-2px);
    background: rgba(132, 104, 61, 0.14);
    box-shadow: 0 12px 26px rgba(91, 70, 42, 0.12);
  }

  .reception-card small {
    display: block;
    margin-top: 1.2rem;
    color: #7b6b58;
  }

  /* Tablet y móvil: reservamos una zona superior exclusiva para el título
     "Recepción" que ya viene integrado dentro de la imagen de fondo. */
  @media (max-width: 900px) {
    .reception-section {
      min-height: max(980px, 100svh);
      place-items: start center;
    }

    .reception-background img {
      object-position: 63% 50%;
    }

    .reception-overlay {
      background: linear-gradient(
        180deg,
        rgba(250, 246, 238, 0.08) 0%,
        rgba(250, 246, 238, 0.15) 23%,
        rgba(250, 246, 238, 0.32) 42%,
        rgba(250, 246, 238, 0.52) 100%
      );
    }

    .reception-content {
      width: min(100% - 1.5rem, 680px);
      min-height: 0;
      display: block;
      padding: clamp(17rem, 35vw, 20rem) 0.35rem 4rem;
    }

    .reception-copy {
      width: 100%;
      margin-inline: auto;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.8rem;
      padding: 0.42rem 0.72rem;
      border: 1px solid rgba(164, 126, 59, 0.2);
      border-radius: 999px;
      background: rgba(255, 252, 246, 0.72);
      box-shadow: 0 8px 25px rgba(91, 70, 42, 0.06);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }

    .reception-intro {
      max-width: 580px;
      margin-bottom: 1.6rem;
    }
  }

  @media (max-width: 600px) {
    .reception-section {
      min-height: max(1040px, 100svh);
    }

    .reception-background img {
      object-position: 57% 50%;
    }

    .reception-overlay {
      background: linear-gradient(
        180deg,
        rgba(250, 246, 238, 0.04) 0%,
        rgba(250, 246, 238, 0.1) 22%,
        rgba(250, 246, 238, 0.32) 40%,
        rgba(250, 246, 238, 0.62) 100%
      );
    }

    .reception-content {
      width: min(100% - 1rem, 520px);
      padding: clamp(18.5rem, 79vw, 21rem) 0.15rem 3.5rem;
    }

    h2 {
      font-size: clamp(2.75rem, 13vw, 4rem);
      line-height: 0.98;
    }

    .reception-intro {
      padding-inline: 0.4rem;
      font-size: clamp(1rem, 4.5vw, 1.14rem);
      line-height: 1.65;
    }

    .reception-card {
      padding: 1.7rem 1.15rem 1.9rem;
      background: rgba(255, 252, 246, 0.88);
      box-shadow: 0 20px 55px rgba(91, 70, 42, 0.1);
    }

    .reception-card h3 {
      font-size: clamp(1.7rem, 8vw, 2.15rem);
    }

    address {
      font-size: clamp(0.95rem, 4.2vw, 1.05rem);
    }

    .reception-button {
      width: min(280px, 100%);
    }
  }

  @media (max-width: 390px) {
    .reception-content {
      padding-top: 17.5rem;
    }

    .eyebrow {
      font-size: 0.62rem;
      letter-spacing: 0.2em;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .reception-button {
      transition: none;
    }
  }
</style>
