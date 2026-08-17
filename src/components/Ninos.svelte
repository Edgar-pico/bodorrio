<section id="ninos" class="children-section reveal-section" aria-labelledby="children-title">
  <!--
    La imagen NO contiene texto.
    El copy se renderiza siempre en HTML:
    - Desktop / tablet: sobre el espacio limpio del lado izquierdo.
    - Mobile: debajo de la ilustración para mantenerlo legible.
  -->
  <div class="children-visual" aria-hidden="true">
    <picture>
      <source srcset="/ninos-boda.webp" type="image/webp" />
      <img
        src="/ninos-boda.jpg"
        alt=""
        width="1448"
        height="1086"
        loading="lazy"
        decoding="async"
      />
    </picture>
  </div>

  <div class="children-copy">
    <span class="children-star" aria-hidden="true">✦</span>

    <p class="children-eyebrow">Los más pequeños</p>

    <div class="children-ornament" aria-hidden="true">
      <i></i>
      <span>♡</span>
      <i></i>
    </div>

    <h2 id="children-title">También son parte de nuestra historia</h2>

    <p>
      Nos encantará compartir este momento también con los más pequeños.
    </p>

    <p>
      Agradecemos su apoyo para que en todo momento se encuentren bajo su
      cuidado y supervisión.
    </p>
  </div>
</section>

<style>
  .children-section {
    position: relative;
    width: 100%;
    min-height: clamp(680px, 55vw, 960px);
    overflow: hidden;
    isolation: isolate;
    background: #f7f1e4;
    color: #6e715e;
  }

  .children-visual {
    position: absolute;
    inset: 0;
    z-index: 1;
    overflow: hidden;
    background: #f7f1e4;
  }

  .children-visual,
  .children-visual picture,
  .children-visual img {
    display: block;
    width: 100%;
    height: 100%;
  }

  .children-visual img {
    object-fit: cover;
    object-position: center;
    user-select: none;
    -webkit-user-drag: none;
  }

  /*
    DESKTOP
    El texto vive en el área vacía de la izquierda.
    Así no dependemos de que la imagen tenga letras integradas.
  */
  .children-copy {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: clamp(3rem, 7vw, 8rem);
    width: min(39vw, 620px);
    transform: translateY(-50%);
    text-align: center;
  }

  .children-star {
    display: block;
    margin-bottom: 0.9rem;
    color: #b88e42;
    font-size: clamp(0.9rem, 1vw, 1.1rem);
  }

  .children-eyebrow {
    margin: 0;
    color: #777763;
    font-size: clamp(0.68rem, 0.72vw, 0.82rem);
    font-weight: 750;
    letter-spacing: 0.28em;
    text-transform: uppercase;
  }

  .children-ornament {
    width: min(190px, 55%);
    margin: 1rem auto 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;
    color: #c29b55;
  }

  .children-ornament i {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, currentColor);
  }

  .children-ornament i:last-child {
    background: linear-gradient(90deg, currentColor, transparent);
  }

  .children-ornament span {
    font-size: 0.82rem;
  }

  .children-copy h2 {
    max-width: 600px;
    margin: 0 auto;
    color: #6e715e;
    font-family: var(--serif);
    font-size: clamp(2.8rem, 4vw, 5.1rem);
    font-weight: 400;
    line-height: 1.02;
    letter-spacing: -0.025em;
    text-wrap: balance;
  }

  .children-copy p:not(.children-eyebrow) {
    max-width: 510px;
    margin: 1.35rem auto 0;
    color: #756b5c;
    font-family: var(--serif);
    font-size: clamp(1rem, 1.18vw, 1.3rem);
    line-height: 1.65;
    text-wrap: pretty;
  }

  .children-copy p:not(.children-eyebrow) + p {
    margin-top: 1rem;
  }

  /*
    LAPTOP / TABLET HORIZONTAL
    Conservamos el texto visible y reducimos tamaños para que no invada a los niños.
  */
  @media (max-width: 1100px) and (min-width: 721px) {
    .children-section {
      min-height: clamp(620px, 67vw, 760px);
    }

    .children-visual img {
      object-position: 55% center;
    }

    .children-copy {
      left: clamp(2rem, 4.5vw, 4rem);
      width: 43%;
    }

    .children-copy h2 {
      font-size: clamp(2.15rem, 4.5vw, 3.6rem);
    }

    .children-copy p:not(.children-eyebrow) {
      font-size: clamp(0.92rem, 1.65vw, 1.08rem);
      line-height: 1.55;
    }
  }

  /*
    MOBILE
    La imagen queda arriba y el texto debajo.
    Así nunca tapamos a los niños y la lectura se mantiene limpia.
  */
  @media (max-width: 720px) {
    .children-section {
      min-height: 0;
      overflow: hidden;
      background:
        radial-gradient(
          circle at 50% 0%,
          rgba(205, 180, 126, 0.12),
          transparent 20rem
        ),
        #f8f2e6;
    }

    .children-visual {
      position: relative;
      inset: auto;
      width: 100%;
      height: clamp(360px, 105vw, 520px);
      border-bottom: 1px solid rgba(183, 155, 100, 0.22);
    }

    .children-visual::after {
      content: "";
      position: absolute;
      inset: auto 0 0;
      height: 28%;
      pointer-events: none;
      background: linear-gradient(
        180deg,
        transparent,
        rgba(248, 242, 230, 0.9)
      );
    }

    .children-visual img {
      object-fit: cover;
      object-position: 77% center;
    }

    .children-copy {
      position: relative;
      z-index: 2;
      top: auto;
      left: auto;
      width: min(100% - 2rem, 560px);
      transform: none;
      margin: clamp(-2.1rem, -5vw, -1.2rem) auto 0;
      padding:
        clamp(2.2rem, 8vw, 3.25rem)
        clamp(1.25rem, 6vw, 2rem)
        3.5rem;
      border: 1px solid rgba(183, 155, 100, 0.24);
      background: rgba(250, 246, 237, 0.96);
      box-shadow: 0 24px 60px rgba(91, 70, 42, 0.08);
      text-align: center;
    }

    .children-star {
      margin-bottom: 0.8rem;
      font-size: 1rem;
    }

    .children-eyebrow {
      font-size: 0.68rem;
    }

    .children-ornament {
      width: min(180px, 60%);
      margin: 1rem auto 1.35rem;
      gap: 0.65rem;
    }

    .children-ornament span {
      font-size: 0.8rem;
    }

    .children-copy h2 {
      max-width: 420px;
      font-size: clamp(2.35rem, 11vw, 3.55rem);
    }

    .children-copy p:not(.children-eyebrow) {
      max-width: 430px;
      margin-top: 1.3rem;
      font-size: clamp(1rem, 4.3vw, 1.15rem);
      line-height: 1.65;
    }
  }

  @media (max-width: 430px) {
    .children-visual {
      height: clamp(350px, 112vw, 470px);
    }

    .children-visual img {
      object-position: 79% center;
    }

    .children-copy {
      width: calc(100% - 1.2rem);
      padding-inline: 1.15rem;
      padding-bottom: 3rem;
    }

    .children-copy h2 {
      font-size: clamp(2.15rem, 11.5vw, 3rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .children-section * {
      scroll-behavior: auto !important;
      transition: none !important;
      animation: none !important;
    }
  }
</style>
