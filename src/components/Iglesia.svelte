<script lang="ts">
  import { weddingConfig } from '../lib/wedding-config';

  const details = weddingConfig.religious;

  const parents = [
    {
      label: 'Papás de Brenda',
      names: ['Gloria González Corrales', 'Antonio Pérez Ramírez']
    },
    {
      label: 'Papás de Edgar',
      names: ['Micaela Martínez Ortega', 'José Manuel Piña Maya']
    }
  ];

  const godparents = ['Sulema Jiménez González', 'Fernando Alberto Estrada Cruz'];
</script>

<section id="iglesia" class="church-chapter reveal-section">
  <div
    class="church-background"
    role="img"
    aria-label="Una iglesia entre montañas dentro de un marco floral"
  ></div>
  <div class="church-veil" aria-hidden="true"></div>
  <div class="church-border" aria-hidden="true"></div>

  <div class="church-layout">
    <div class="church-copy">
      <span class="open-chapter">Capítulo II · Ahora abierto</span>
      <span class="church-cross" aria-hidden="true">✝</span>

      <h2>Nuestro sí ante Dios</h2>

      <p class="church-intro">
        Después de tantos caminos, lugares y momentos que nos trajeron hasta aquí,
        queremos invitarte a ser parte del siguiente capítulo de nuestra historia.
      </p>

      <div class="blessing" aria-label="Familia y padrinos que nos acompañan">
        <div class="blessing-heading">
          <span>Con la bendición de Dios</span>
          <strong>y el amor de nuestros padres</strong>
        </div>

        <div class="parents-grid">
          {#each parents as family}
            <div class="family-group">
              <p>{family.label}</p>
              {#each family.names as name}
                <span>{name}</span>
              {/each}
            </div>
          {/each}
        </div>

        <div class="blessing-divider" aria-hidden="true">
          <i></i><span>✦</span><i></i>
        </div>

        <div class="godparents">
          <p>Acompañados en este camino por</p>
          <strong>nuestros padrinos de velación</strong>
          {#each godparents as name}
            <span>{name}</span>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="ceremony-location" aria-labelledby="ceremony-location-title">
  <div class="location-card">
    <span class="location-cross" aria-hidden="true">✦</span>
    <p class="location-eyebrow">Ceremonia religiosa</p>
    <h3 id="ceremony-location-title">{details.churchName}</h3>

    <div class="ceremony-meta">
      <p>
        <span>Fecha</span>
        <strong>{details.dateLabel}</strong>
      </p>
      <i aria-hidden="true"></i>
      <p>
        <span>Hora</span>
        <strong>{details.timeLabel}</strong>
      </p>
    </div>

    {#if details.churchAddress}
      <p class="ceremony-address">{details.churchAddress}</p>
    {/if}

    {#if details.churchMapUrl}
      <a
        class="location-button"
        href={details.churchMapUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Ver ubicación <span aria-hidden="true">↗</span>
      </a>
    {:else}
      <span class="detail-pending">Ubicación detallada próximamente</span>
    {/if}
  </div>
</section>

<style>
  .church-chapter {
    position: relative;
    isolation: isolate;
    min-height: max(100svh, 880px);
    overflow: hidden;
    color: #fffdf8;
  }

  .church-background,
  .church-veil,
  .church-border {
    position: absolute;
    inset: 0;
  }

  .church-background {
    z-index: -3;
    background: url('/inicio-6.webp') 50% 50% / cover no-repeat;
    transform: scale(1.006);
  }

  .church-veil {
    z-index: -2;
    background:
      linear-gradient(90deg, rgba(29, 28, 23, 0.04) 0%, rgba(29, 28, 23, 0.1) 34%, rgba(25, 27, 23, 0.48) 59%, rgba(20, 24, 21, 0.78) 100%),
      linear-gradient(180deg, rgba(18, 20, 17, 0.14), rgba(18, 20, 17, 0.28));
  }

  .church-border {
    z-index: -1;
    pointer-events: none;
    box-shadow: inset 0 0 0 1px rgba(223, 196, 126, 0.28);
  }

  .church-layout {
    width: min(1500px, calc(100% - 3rem));
    min-height: max(100svh, 880px);
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(38%, 1fr) minmax(520px, 0.92fr);
    align-items: center;
    padding: clamp(4.5rem, 7vw, 7.5rem) 0;
  }

  .church-copy {
    grid-column: 2;
    width: 100%;
    max-width: 720px;
    justify-self: end;
    text-align: center;
    text-shadow: 0 2px 22px rgba(10, 13, 11, 0.45);
  }

  .open-chapter {
    display: inline-flex;
    padding: 0.55rem 0.9rem;
    border: 1px solid rgba(233, 210, 151, 0.64);
    border-radius: 999px;
    color: #f1dca3;
    background: rgba(31, 34, 28, 0.16);
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    backdrop-filter: blur(5px);
  }

  .church-cross {
    display: block;
    margin: 1.25rem 0 0.55rem;
    color: #ead18d;
    font-family: var(--serif);
    font-size: 1.65rem;
    text-shadow: 0 0 24px rgba(255, 226, 148, 0.68);
  }

  h2 {
    margin: 0;
    font-family: var(--serif);
    font-size: clamp(3.2rem, 5.4vw, 5.75rem);
    font-weight: 400;
    line-height: 0.98;
    letter-spacing: -0.035em;
    text-wrap: balance;
  }

  .church-intro {
    max-width: 630px;
    margin: 1.25rem auto 1.7rem;
    color: rgba(255, 253, 248, 0.9);
    font-family: var(--serif);
    font-size: clamp(1rem, 1.4vw, 1.18rem);
    line-height: 1.65;
    text-wrap: balance;
  }

  .blessing {
    position: relative;
    margin-top: 1.2rem;
    padding: clamp(1.4rem, 2.5vw, 2rem) clamp(1.25rem, 3.2vw, 2.5rem);
    border-top: 1px solid rgba(237, 214, 157, 0.52);
    border-bottom: 1px solid rgba(237, 214, 157, 0.34);
    background: linear-gradient(90deg, rgba(26, 30, 25, 0.1), rgba(26, 30, 25, 0.27), rgba(26, 30, 25, 0.1));
    backdrop-filter: blur(3px);
  }

  .blessing-heading span,
  .blessing-heading strong,
  .godparents p,
  .godparents strong {
    display: block;
    text-transform: uppercase;
  }

  .blessing-heading span,
  .godparents p {
    color: #efdca8;
    font-size: clamp(0.66rem, 0.8vw, 0.76rem);
    font-weight: 700;
    letter-spacing: 0.22em;
  }

  .blessing-heading strong,
  .godparents strong {
    margin-top: 0.35rem;
    color: #fffdf8;
    font-family: var(--serif);
    font-size: clamp(1rem, 1.45vw, 1.24rem);
    font-weight: 400;
    letter-spacing: 0.08em;
  }

  .parents-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.2rem 2.4rem;
    margin-top: 1.35rem;
  }

  .family-group {
    min-width: 0;
  }

  .family-group + .family-group {
    border-left: 1px solid rgba(235, 215, 166, 0.3);
  }

  .family-group p {
    margin: 0 0 0.52rem;
    color: #ead9ad;
    font-size: 0.69rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .family-group span,
  .godparents > span {
    display: block;
    color: rgba(255, 253, 248, 0.94);
    font-family: var(--serif);
    font-size: clamp(0.98rem, 1.4vw, 1.13rem);
    line-height: 1.5;
  }

  .blessing-divider {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0.8rem;
    width: min(260px, 70%);
    margin: 1.2rem auto;
    color: #efd38e;
  }

  .blessing-divider i {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(235, 209, 146, 0.65));
  }

  .blessing-divider i:last-child {
    background: linear-gradient(90deg, rgba(235, 209, 146, 0.65), transparent);
  }

  .blessing-divider span {
    font-size: 0.72rem;
  }

  .godparents p {
    margin: 0;
  }

  .godparents strong {
    margin-bottom: 0.55rem;
  }

  .ceremony-location {
    position: relative;
    isolation: isolate;
    min-height: clamp(720px, 88svh, 940px);
    overflow: hidden;
    display: grid;
    place-items: center;
    padding: clamp(4.5rem, 8vw, 7rem) 1.5rem;
    color: #463d2f;
    text-align: center;
    background: #f4ead8 url('/ubicacion-1.png') center / cover no-repeat;
  }

  .ceremony-location::before {
    content: '';
    position: absolute;
    z-index: 0;
    inset: 0;
    background:
      radial-gradient(circle at 50% 48%, rgba(255, 252, 245, 0.18) 0%, rgba(255, 252, 245, 0.06) 48%, transparent 76%),
      linear-gradient(180deg, rgba(255, 252, 245, 0.08), rgba(235, 220, 194, 0.14));
  }

  .location-card {
    position: relative;
    z-index: 1;
    width: min(920px, 100%);
    margin: 0 auto;
    padding: clamp(2.2rem, 5vw, 4rem);
    border: 1px solid rgba(157, 122, 57, 0.34);
    background: rgba(255, 252, 245, 0.82);
    box-shadow:
      0 28px 80px rgba(99, 75, 35, 0.14),
      inset 0 0 0 1px rgba(255, 255, 255, 0.42);
    backdrop-filter: blur(7px) saturate(0.88);
  }

  .location-card::before,
  .location-card::after {
    content: '';
    position: absolute;
    left: 50%;
    width: min(240px, 38%);
    height: 1px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, transparent, rgba(171, 132, 58, 0.5), transparent);
  }

  .location-card::before {
    top: 1.2rem;
  }

  .location-card::after {
    bottom: 1.2rem;
  }

  .location-cross {
    display: block;
    margin-bottom: 0.65rem;
    color: #b68b35;
  }

  .location-eyebrow {
    margin: 0;
    color: #9b7938;
    font-size: 0.69rem;
    font-weight: 800;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }

  .location-card h3 {
    margin: 0.65rem auto 2.1rem;
    color: #453a2b;
    font-family: var(--serif);
    font-size: clamp(2.05rem, 5vw, 4rem);
    font-weight: 400;
    line-height: 1.08;
    text-wrap: balance;
  }

  .ceremony-meta {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: clamp(1.25rem, 5vw, 4rem);
  }

  .ceremony-meta p {
    flex: 1;
    max-width: 330px;
    margin: 0;
  }

  .ceremony-meta span {
    display: block;
    margin-bottom: 0.55rem;
    color: #9a7b44;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .ceremony-meta strong {
    color: #4b4031;
    font-family: var(--serif);
    font-size: clamp(1.05rem, 2vw, 1.35rem);
    font-weight: 600;
  }

  .ceremony-meta i {
    width: 1px;
    background: rgba(157, 122, 57, 0.28);
  }

  .ceremony-address {
    max-width: 720px;
    margin: 1.65rem auto 1.5rem;
    color: #70634f;
    font-size: 0.96rem;
    line-height: 1.65;
  }

  .location-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    min-height: 48px;
    padding: 0.75rem 1.35rem;
    border: 1px solid #9f7a34;
    border-radius: 999px;
    color: #665027;
    background: rgba(255, 252, 245, 0.68);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-decoration: none;
    transition: color 180ms ease, background 180ms ease, transform 180ms ease, box-shadow 180ms ease;
  }

  .location-button:hover,
  .location-button:focus-visible {
    color: #fffdf8;
    background: #8c6b2f;
    box-shadow: 0 12px 28px rgba(109, 79, 28, 0.2);
    transform: translateY(-2px);
  }

  .location-button:focus-visible {
    outline: 2px solid #4b4031;
    outline-offset: 4px;
  }

  .detail-pending {
    display: inline-block;
    color: #7b6b51;
    font-size: 0.85rem;
  }

  @media (max-width: 980px) {
    .church-chapter {
      min-height: auto;
    }

    .church-layout {
      width: min(720px, calc(100% - 2rem));
      min-height: auto;
      grid-template-columns: 1fr;
      align-items: end;
      padding: min(46svh, 28rem) 0 3.5rem;
    }

    .church-copy {
      grid-column: 1;
      justify-self: center;
    }

    .church-background {
      background-position: 28% top;
    }

    .church-veil {
      background:
        linear-gradient(180deg, rgba(20, 22, 18, 0.06) 0%, rgba(20, 22, 18, 0.08) 24%, rgba(20, 23, 19, 0.84) 47%, rgba(20, 23, 19, 0.94) 100%),
        linear-gradient(90deg, rgba(24, 24, 20, 0.08), rgba(24, 24, 20, 0.28));
    }

    h2 {
      font-size: clamp(3rem, 10vw, 5rem);
    }
  }

  @media (max-width: 620px) {
    .church-layout {
      width: min(100% - 1.25rem, 540px);
      padding-top: min(43svh, 23rem);
      padding-bottom: 1.25rem;
    }

    .church-copy {
      padding: 1.35rem 0.6rem 0.5rem;
    }

    .open-chapter {
      font-size: 0.58rem;
      letter-spacing: 0.14em;
    }

    .church-cross {
      margin-top: 1rem;
    }

    h2 {
      font-size: clamp(2.75rem, 13vw, 4rem);
    }

    .church-intro {
      margin-bottom: 1.3rem;
      font-size: 1rem;
      line-height: 1.55;
    }

    .blessing {
      padding: 1.35rem 0.85rem;
    }

    .parents-grid {
      grid-template-columns: 1fr;
      gap: 1.1rem;
    }

    .family-group + .family-group {
      padding-top: 1.1rem;
      border-top: 1px solid rgba(235, 215, 166, 0.26);
      border-left: 0;
    }

    .blessing-heading strong,
    .godparents strong {
      font-size: 0.98rem;
      letter-spacing: 0.05em;
    }

    .family-group span,
    .godparents > span {
      font-size: 1.02rem;
    }

    .ceremony-location {
      min-height: auto;
      padding: 3.5rem 0.85rem;
      background-position: 54% center;
    }

    .location-card {
      padding: 2rem 1rem;
      background: rgba(255, 252, 245, 0.88);
    }

    .ceremony-meta {
      flex-direction: column;
      gap: 1rem;
    }

    .ceremony-meta p {
      max-width: none;
    }

    .ceremony-meta i {
      width: min(190px, 60%);
      height: 1px;
      margin: 0 auto;
    }

    .ceremony-address {
      margin-top: 1.35rem;
      font-size: 0.9rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .location-button {
      transition: none;
    }
  }
</style>
