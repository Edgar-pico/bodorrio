<section id="ninos" class="children-section reveal-section" aria-labelledby="children-title">
  <!--
    Desktop / tablet:
    La ilustración completa ya contiene el diseño y el texto.
    Se muestra sin overlays para respetar la composición original.

    Mobile:
    Se enfoca la ilustración en los niños y el texto se renderiza debajo
    en HTML para mantenerlo legible sin cubrir la imagen.
  -->
  <div class="children-visual" aria-hidden="true">
    <picture>
      <source srcset="/ninos-boda.webp" type="image/webp" />
      <img
        src="/ninos-boda.jpg"
        alt=""
        width="1536"
        height="1024"
        loading="lazy"
        decoding="async"
      />
    </picture>
  </div>

  <div class="children-desktop-accessible sr-only">
    <p>Los más pequeños</p>
    <h2 id="children-title">También son parte de nuestra historia</h2>
    <p>Nos encantará compartir este momento también con los más pequeños.</p>
    <p>
      Agradecemos su apoyo para que en todo momento se encuentren bajo su cuidado y supervisión.
    </p>
  </div>

  <div class="children-mobile-copy" aria-hidden="true">
    <span class="children-star" aria-hidden="true">✦</span>
    <p class="children-eyebrow">Los más pequeños</p>
    <div class="children-ornament" aria-hidden="true">
      <i></i><span>♡</span><i></i>
    </div>

    <h2>También son parte de nuestra historia</h2>

    <p>
      Nos encantará compartir este momento también con los más pequeños.
    </p>

    <p>
      Agradecemos su apoyo para que en todo momento se encuentren bajo su cuidado y supervisión.
    </p>
  </div>
</section>

<style>
  .children-section {
    position: relative;
    width: 100%;
    min-height: 0;
    aspect-ratio: 3 / 2;
    display: block;
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

  .children-mobile-copy {
    display: none;
  }

  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  /*
    En pantallas intermedias mantenemos la composición completa.
    El aspect-ratio evita que reglas globales de .children-section
    fuercen una altura que deforme o recorte la imagen.
  */
  @media (max-width: 900px) and (min-width: 721px) {
    .children-section {
      aspect-ratio: 3 / 2;
      min-height: 0;
    }

    .children-visual img {
      object-fit: contain;
      object-position: center;
    }
  }

  /*
    Mobile:
    Nunca ponemos texto encima del dibujo.
    La parte visual ocupa su propio bloque y el contenido queda debajo.
  */
  @media (max-width: 720px) {
    .children-section {
      min-height: 0;
      aspect-ratio: auto;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 0%, rgba(205, 180, 126, 0.12), transparent 20rem),
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
      content: '';
      position: absolute;
      inset: auto 0 0;
      height: 28%;
      pointer-events: none;
      background: linear-gradient(180deg, transparent, rgba(248, 242, 230, 0.9));
    }

    .children-visual img {
      object-fit: cover;
      /*
        El diseño original es horizontal.
        En móvil priorizamos a los niños, que están a la derecha,
        y evitamos que el texto impreso de la izquierda quede
        debajo del texto HTML.
      */
      object-position: 77% center;
    }

    .children-mobile-copy {
      position: relative;
      z-index: 2;
      display: block;
      width: min(100% - 2rem, 560px);
      margin: clamp(-2.1rem, -5vw, -1.2rem) auto 0;
      padding: clamp(2.2rem, 8vw, 3.25rem) clamp(1.25rem, 6vw, 2rem) 3.5rem;
      border: 1px solid rgba(183, 155, 100, 0.24);
      background: rgba(250, 246, 237, 0.96);
      box-shadow: 0 24px 60px rgba(91, 70, 42, 0.08);
      text-align: center;
    }

    .children-star {
      display: block;
      margin-bottom: 0.8rem;
      color: #b88e42;
      font-size: 1rem;
    }

    .children-eyebrow {
      margin: 0;
      color: #777763;
      font-size: 0.68rem;
      font-weight: 750;
      letter-spacing: 0.28em;
      text-transform: uppercase;
    }

    .children-ornament {
      width: min(180px, 60%);
      margin: 1rem auto 1.35rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.65rem;
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
      font-size: 0.8rem;
    }

    .children-mobile-copy h2 {
      max-width: 420px;
      margin: 0 auto;
      color: #6e715e;
      font-family: var(--serif);
      font-size: clamp(2.35rem, 11vw, 3.55rem);
      font-weight: 400;
      line-height: 1.02;
      letter-spacing: -0.025em;
      text-wrap: balance;
    }

    .children-mobile-copy p:not(.children-eyebrow) {
      max-width: 430px;
      margin: 1.3rem auto 0;
      color: #756b5c;
      font-family: var(--serif);
      font-size: clamp(1rem, 4.3vw, 1.15rem);
      line-height: 1.65;
      text-wrap: pretty;
    }

    .children-mobile-copy p:not(.children-eyebrow) + p {
      margin-top: 1rem;
    }
  }

  @media (max-width: 430px) {
    .children-visual {
      height: clamp(350px, 112vw, 470px);
    }

    .children-visual img {
      object-position: 79% center;
    }

    .children-mobile-copy {
      width: calc(100% - 1.2rem);
      padding-inline: 1.15rem;
      padding-bottom: 3rem;
    }

    .children-mobile-copy h2 {
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
