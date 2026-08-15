<section id="civil" class="chapter-one reveal-section" aria-labelledby="chapter-one-title">
  <picture class="chapter-one__art">
    <source srcset="/inicio-3.webp" type="image/webp" />
    <img
      src="/inicio-3.jpg"
      alt="Brenda y Edgar durante su ceremonia civil, acompañados por su familia"
      width="1920"
      height="1080"
      loading="lazy"
      decoding="async"
    />
  </picture>

  <div class="chapter-one__copy">
    <h2 id="chapter-one-title" class="chapter-one__accessible-title">Nuestro primer sí</h2>
    <p>El 23 de mayo comenzó oficialmente una nueva etapa de nuestra historia.</p>
    <p>
      Un día íntimo, sencillo y lleno de emoción, en el que dimos el primer paso hacia todo lo que soñamos construir juntos.
    </p>
    <span class="chapter-one__seal">El comienzo de nuestro para siempre <i aria-hidden="true">♡</i></span>
  </div>
</section>

<style>
  .chapter-one {
    position: relative;
    width: 100%;
    min-height: 0;
    overflow: hidden;
    background: #17130f;
    color: white;
    content-visibility: auto;
    contain-intrinsic-size: 1080px;
  }

  .chapter-one__art,
  .chapter-one__art img {
    display: block;
    width: 100%;
  }

  .chapter-one__art {
    max-width: 1920px;
    margin-inline: auto;
  }

  .chapter-one__art img {
    height: auto;
    object-fit: contain;
    object-position: center;
  }

  .chapter-one__copy {
    position: absolute;
    left: max(4.8vw, calc((100vw - 1920px) / 2 + 92px));
    bottom: clamp(1.2rem, 2vw, 2.5rem);
    z-index: 2;
    width: min(31vw, 560px);
    text-align: left;
  }

  .chapter-one__copy p {
    margin: 0 0 clamp(0.65rem, 1.15vw, 1.15rem);
    color: rgba(255, 250, 240, 0.9);
    font-family: var(--serif);
    font-size: clamp(0.9rem, 1.12vw, 1.32rem);
    line-height: 1.55;
    text-wrap: pretty;
    text-shadow: 0 2px 16px rgba(0, 0, 0, 0.62);
  }

  .chapter-one__seal {
    min-height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    margin-top: clamp(0.15rem, 0.65vw, 0.65rem);
    padding: 0.72rem 1.15rem;
    border: 1px solid rgba(234, 207, 145, 0.82);
    border-radius: 999px;
    background: rgba(150, 77, 65, 0.82);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.14),
      0 8px 24px rgba(0, 0, 0, 0.2);
    color: #fff5e4;
    font-family: var(--serif);
    font-size: clamp(0.64rem, 0.8vw, 0.88rem);
    letter-spacing: 0.035em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .chapter-one__seal i {
    color: #efdcae;
    font-style: normal;
  }

  .chapter-one__accessible-title {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (max-width: 1100px) {
    .chapter-one__copy {
      position: relative;
      inset: auto;
      width: min(100% - 3rem, 620px);
      margin-inline: auto;
      padding: 2.6rem 0 4rem;
    }

    .chapter-one__copy::before {
      content: '✦';
      display: block;
      margin-bottom: 1.15rem;
      color: #d6bd80;
      font-size: 0.72rem;
    }

    .chapter-one__copy p {
      margin-bottom: 1rem;
      font-size: 1rem;
      line-height: 1.65;
    }

    .chapter-one__seal {
      min-height: 42px;
      margin-top: 0.5rem;
      padding: 0.7rem 0.9rem;
      font-size: 0.62rem;
      line-height: 1.4;
    }
  }

  @media (max-width: 760px) {
    .chapter-one {
      border-bottom: 1px solid rgba(214, 197, 152, 0.18);
    }

    .chapter-one__art img {
      min-height: 0;
      max-height: none;
    }

    .chapter-one__copy {
      width: min(100% - 2.4rem, 560px);
      padding: 2.25rem 0 3.5rem;
    }
  }

  @media (max-width: 380px) {
    .chapter-one__copy {
      width: min(100% - 1.5rem, 520px);
      padding-bottom: 3rem;
    }

    .chapter-one__copy p {
      font-size: 0.96rem;
    }
  }
</style>
