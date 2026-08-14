<section id="civil" class="memory-section chapter-one reveal-section">
  <div
    class="memory-background chapter-one__background"
    role="img"
    aria-label="Ceremonia civil de Brenda y Edgar acompañados por sus familias"
  ></div>
  <div class="memory-overlay chapter-one__overlay" aria-hidden="true"></div>

  <div class="chapter-one__layout">
    <div class="memory-content chapter-one__content">
      <p class="eyebrow eyebrow--light chapter-one__eyebrow">Capítulo I</p>
      <div class="chapter-one__ornament" aria-hidden="true"><span></span><i>❧</i><span></span></div>

      <h2 aria-label="Nuestro primer sí">
        <span class="chapter-one__title-line" aria-hidden="true">Nuestro primer</span>
      </h2>

      <picture class="chapter-one__signature" aria-hidden="true">
        <source srcset="/si-corazon.webp" type="image/webp" />
        <img src="/si-corazon.png" alt="" width="1200" height="412" loading="eager" decoding="async" />
      </picture>

      <p class="memory-date">23 · 05 · 2026</p>

      <div class="memory-divider" aria-hidden="true">
        <span></span><i>✦</i><span></span>
      </div>

      <p>El 23 de mayo comenzó oficialmente una nueva etapa de nuestra historia.</p>
      <p>Un día íntimo, sencillo y lleno de emoción, en el que dimos el primer paso hacia todo lo que soñamos construir juntos.</p>

      <span class="memory-seal">El comienzo de nuestro para siempre <i aria-hidden="true">♡</i></span>
    </div>
  </div>
</section>

<style>
  .chapter-one {
    min-height: max(92svh, 760px);
    display: block;
    text-align: left;
  }

  .chapter-one__background {
    background-color: #1c1916;
    background-image: url('/inicio-3.jpg');
    background-image: image-set(
      url('/inicio-3.webp') type('image/webp'),
      url('/inicio-3.jpg') type('image/jpeg')
    );
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    transform: scale(1.005);
  }

  .chapter-one__overlay {
    background:
      linear-gradient(
        90deg,
        rgba(12, 11, 10, 0.34) 0%,
        rgba(15, 13, 11, 0.26) 31%,
        rgba(20, 16, 13, 0.1) 50%,
        rgba(18, 14, 11, 0.03) 72%,
        rgba(15, 12, 10, 0.1) 100%
      ),
      linear-gradient(180deg, rgba(13, 11, 9, 0.08), rgba(13, 11, 9, 0.34));
  }

  .chapter-one__layout {
    width: min(1500px, calc(100% - clamp(2rem, 7vw, 8rem)));
    min-height: inherit;
    margin-inline: auto;
    display: grid;
    grid-template-columns: minmax(360px, 600px) minmax(0, 1fr);
    align-items: center;
    position: relative;
    z-index: 2;
  }

  .chapter-one__content {
    width: 100%;
    padding: clamp(5.5rem, 9vw, 8rem) 0;
    text-align: left;
  }

  .chapter-one__content .eyebrow {
    margin-bottom: 0.8rem;
    color: rgba(239, 226, 191, 0.82);
  }

  .chapter-one__eyebrow {
    font-size: 0.78rem;
    letter-spacing: 0.32em;
  }

  .chapter-one__ornament {
    width: min(290px, 72%);
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: clamp(2rem, 4vw, 3.4rem);
    color: #d5b96f;
  }

  .chapter-one__ornament span {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(224, 202, 139, 0.85));
  }

  .chapter-one__ornament span:last-child {
    background: linear-gradient(90deg, rgba(224, 202, 139, 0.85), transparent);
  }

  .chapter-one__ornament i {
    font-family: var(--serif);
    font-size: 1.25rem;
    font-style: normal;
  }

  .chapter-one__content h2 {
    max-width: 600px;
    margin: 0;
    font-size: clamp(3.7rem, 5.2vw, 5.8rem);
    line-height: 1;
    letter-spacing: -0.035em;
    text-wrap: balance;
    text-shadow: 0 4px 28px rgba(0, 0, 0, 0.42);
  }

  .chapter-one__title-line {
    display: block;
    color: #fff;
    white-space: nowrap;
  }

  .chapter-one__signature {
    display: block;
    width: min(420px, 82%);
    margin: 0.15rem 0 0.45rem -0.65rem;
  }

  .chapter-one__signature img {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 3px 13px rgba(0, 0, 0, 0.32));
  }

  .chapter-one__content .memory-date {
    margin-top: 1.6rem !important;
    color: #e0ca8b;
  }

  .chapter-one__content .memory-divider {
    justify-content: flex-start;
    margin-block: 1.5rem 1.7rem;
  }

  .chapter-one__content > p:not(.eyebrow):not(.memory-date) {
    max-width: 500px;
    margin: 0 0 1rem;
    color: rgba(255, 255, 255, 0.84);
    font-size: clamp(1.02rem, 1.55vw, 1.22rem);
    line-height: 1.7;
    text-wrap: pretty;
    text-shadow: 0 2px 18px rgba(0, 0, 0, 0.55);
  }

  .chapter-one__content .memory-seal {
    max-width: 100%;
    margin-top: 1.4rem;
    border-color: rgba(227, 212, 171, 0.42);
    background: rgba(24, 20, 17, 0.22);
    color: rgba(255, 255, 255, 0.76);
    backdrop-filter: blur(6px);
  }

  .chapter-one__content .memory-seal i {
    margin-left: 0.25rem;
    color: #e0ca8b;
    font-style: normal;
  }

  @media (max-width: 900px) {
    .chapter-one {
      min-height: max(88svh, 680px);
    }

    .chapter-one__background {
      background-position: 62% center;
    }

    .chapter-one__overlay {
      background:
        linear-gradient(90deg, rgba(13, 11, 10, 0.42), rgba(19, 15, 12, 0.08) 76%),
        linear-gradient(180deg, rgba(13, 11, 9, 0.12), rgba(13, 11, 9, 0.44));
    }

    .chapter-one__layout {
      width: min(100% - 2.5rem, 720px);
      grid-template-columns: minmax(0, 560px) minmax(0, 1fr);
    }

    .chapter-one__content h2 {
      font-size: clamp(3.45rem, 9vw, 5rem);
    }
  }

  @media (max-width: 620px) {
    .chapter-one {
      min-height: 100svh;
    }

    .chapter-one__background {
      background-position: 68% center;
      transform: none;
    }

    .chapter-one__overlay {
      background:
        linear-gradient(90deg, rgba(12, 11, 10, 0.48), rgba(18, 15, 12, 0.2)),
        linear-gradient(180deg, rgba(12, 11, 10, 0.2), rgba(12, 11, 10, 0.7));
    }

    .chapter-one__layout {
      width: min(100% - 2rem, 520px);
      grid-template-columns: 1fr;
      align-items: end;
    }

    .chapter-one__content {
      padding: 6rem 0 3.5rem;
    }

    .chapter-one__content h2 {
      max-width: 8ch;
      font-size: clamp(2.85rem, 13.5vw, 4.25rem);
      line-height: 0.9;
    }

    .chapter-one__title-line {
      white-space: normal;
    }

    .chapter-one__signature {
      width: min(390px, 92%);
      margin-top: 0.35rem;
      margin-left: -0.4rem;
    }

    .chapter-one__content > p:not(.eyebrow):not(.memory-date) {
      max-width: 34rem;
      font-size: 1rem;
      line-height: 1.58;
    }

    .chapter-one__content .memory-seal {
      padding: 0.65rem 0.9rem;
      font-size: 0.6rem;
      line-height: 1.45;
    }
  }
</style>
