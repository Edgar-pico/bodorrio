<script lang="ts">
  type Memory = {
    jpg: string;
    webp: string;
    alt: string;
    format: 'featured' | 'wide' | 'tall' | 'portrait';
    width: number;
    height: number;
  };

  const memories: Memory[] = [
    {
      jpg: '/recuerdos-capitulo-1/recuerdo-01.jpg',
      webp: '/recuerdos-capitulo-1/recuerdo-01.webp',
      alt: 'Brenda y Edgar compartiendo un momento divertido durante la celebración',
      format: 'featured',
      width: 1536,
      height: 1024
    },
    {
      jpg: '/recuerdos-capitulo-1/recuerdo-02.jpg',
      webp: '/recuerdos-capitulo-1/recuerdo-02.webp',
      alt: 'Brenda y Edgar acompañados por dos invitadas durante su ceremonia civil',
      format: 'tall',
      width: 1086,
      height: 1448
    },
    {
      jpg: '/recuerdos-capitulo-1/recuerdo-03.jpg',
      webp: '/recuerdos-capitulo-1/recuerdo-03.webp',
      alt: 'Brenda y Edgar posando junto a dos personas importantes para ellos',
      format: 'portrait',
      width: 1208,
      height: 1302
    },
    {
      jpg: '/recuerdos-capitulo-1/recuerdo-04.jpg',
      webp: '/recuerdos-capitulo-1/recuerdo-04.webp',
      alt: 'Familiares emocionados acompañando el primer sí de Brenda y Edgar',
      format: 'wide',
      width: 1448,
      height: 1086
    },
    {
      jpg: '/recuerdos-capitulo-1/recuerdo-05.jpg',
      webp: '/recuerdos-capitulo-1/recuerdo-05.webp',
      alt: 'Brenda y Edgar compartiendo un beso frente al pastel',
      format: 'wide',
      width: 1536,
      height: 1024
    },
    {
      jpg: '/recuerdos-capitulo-1/recuerdo-06.jpg',
      webp: '/recuerdos-capitulo-1/recuerdo-06.webp',
      alt: 'Brenda y Edgar acompañados por sus seres queridos bajo el árbol',
      format: 'wide',
      width: 1402,
      height: 1122
    },
    {
      jpg: '/recuerdos-capitulo-1/recuerdo-07.jpg',
      webp: '/recuerdos-capitulo-1/recuerdo-07.webp',
      alt: 'Brenda y Edgar junto a sus familiares después de la ceremonia',
      format: 'wide',
      width: 1402,
      height: 1122
    },
    {
      jpg: '/recuerdos-capitulo-1/recuerdo-08.jpg',
      webp: '/recuerdos-capitulo-1/recuerdo-08.webp',
      alt: 'Brenda y Edgar firmando el acta de su matrimonio civil',
      format: 'tall',
      width: 1086,
      height: 1448
    },
    {
      jpg: '/recuerdos-capitulo-1/recuerdo-09.jpg',
      webp: '/recuerdos-capitulo-1/recuerdo-09.webp',
      alt: 'Brenda y Edgar tomados de las manos durante la ceremonia',
      format: 'tall',
      width: 1024,
      height: 1536
    },
    {
      jpg: '/recuerdos-capitulo-1/recuerdo-10.jpg',
      webp: '/recuerdos-capitulo-1/recuerdo-10.webp',
      alt: 'Brenda y Edgar mostrando felices su acta de matrimonio',
      format: 'tall',
      width: 1087,
      height: 1447
    },
    {
      jpg: '/recuerdos-capitulo-1/recuerdo-11.jpg',
      webp: '/recuerdos-capitulo-1/recuerdo-11.webp',
      alt: 'Brenda y Edgar acompañados por una pareja de invitados',
      format: 'tall',
      width: 1086,
      height: 1448
    },
    {
      jpg: '/recuerdos-capitulo-1/recuerdo-12.jpg',
      webp: '/recuerdos-capitulo-1/recuerdo-12.webp',
      alt: 'Brenda y Edgar con amigos bajo el arco de su ceremonia civil',
      format: 'wide',
      width: 1448,
      height: 1086
    }
  ];

  let selectedIndex = $state<number | null>(null);

  function openMemory(index: number) {
    selectedIndex = index;
  }

  function closeMemory() {
    selectedIndex = null;
  }

  function showPrevious() {
    if (selectedIndex === null) return;
    selectedIndex = (selectedIndex - 1 + memories.length) % memories.length;
  }

  function showNext() {
    if (selectedIndex === null) return;
    selectedIndex = (selectedIndex + 1) % memories.length;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (selectedIndex === null) return;

    if (event.key === 'Escape') closeMemory();
    if (event.key === 'ArrowLeft') showPrevious();
    if (event.key === 'ArrowRight') showNext();
  }

  function closeFromBackdrop(event: MouseEvent) {
    if (event.target === event.currentTarget) closeMemory();
  }

  $effect(() => {
    if (typeof document === 'undefined') return;

    document.body.style.overflow = selectedIndex === null ? '' : 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<section id="recuerdos-civil" class="memories-section reveal-section" aria-labelledby="memories-title">
  <div class="memories-glow memories-glow--one" aria-hidden="true"></div>
  <div class="memories-glow memories-glow--two" aria-hidden="true"></div>

  <header class="memories-header">
    <span class="memories-chapter">Capítulo I · Nuestros recuerdos</span>
    <div class="memories-ornament" aria-hidden="true"><i></i><b>✦</b><i></i></div>
    <h2 id="memories-title">Instantes de nuestro primer <em>sí</em></h2>
    <p>
      Miradas, abrazos y sonrisas que hicieron de aquel día el comienzo de nuestro para siempre.
    </p>
  </header>

  <div class="memories-grid" aria-label="Recuerdos de la ceremonia civil de Brenda y Edgar">
    {#each memories as memory, index}
      <button
        type="button"
        class={`memory-card memory-card--${memory.format}`}
        aria-label={`Ampliar recuerdo ${index + 1} de ${memories.length}: ${memory.alt}`}
        onclick={() => openMemory(index)}
      >
        <picture>
          <source srcset={memory.webp} type="image/webp" />
          <img
            src={memory.jpg}
            alt={memory.alt}
            width={memory.width}
            height={memory.height}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <span class="memory-card__shade" aria-hidden="true"></span>
        <span class="memory-card__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span class="memory-card__action" aria-hidden="true"><i>＋</i> Ver recuerdo</span>
      </button>
    {/each}
  </div>

  <p class="memories-hint"><span aria-hidden="true">Toca una fotografía</span> para verla completa</p>
</section>

{#if selectedIndex !== null}
  <div
    class="memory-lightbox"
    role="dialog"
    aria-modal="true"
    aria-label={`Recuerdo ${selectedIndex + 1} de ${memories.length}`}
    onclick={closeFromBackdrop}
  >
    <button class="lightbox-close" type="button" aria-label="Cerrar galería" onclick={closeMemory}>×</button>
    <button class="lightbox-nav lightbox-nav--previous" type="button" aria-label="Recuerdo anterior" onclick={showPrevious}>‹</button>

    <figure>
      <picture>
        <source srcset={memories[selectedIndex].webp} type="image/webp" />
        <img src={memories[selectedIndex].jpg} alt={memories[selectedIndex].alt} />
      </picture>
      <figcaption>
        <span>Capítulo I</span>
        Recuerdo {String(selectedIndex + 1).padStart(2, '0')} / {String(memories.length).padStart(2, '0')}
      </figcaption>
    </figure>

    <button class="lightbox-nav lightbox-nav--next" type="button" aria-label="Siguiente recuerdo" onclick={showNext}>›</button>
  </div>
{/if}

<style>
  .memories-section {
    position: relative;
    padding: clamp(5rem, 9vw, 8.5rem) clamp(1rem, 3.5vw, 4rem);
    overflow: hidden;
    border-block: 1px solid rgba(183, 155, 100, 0.22);
    background:
      linear-gradient(rgba(249, 245, 236, 0.965), rgba(244, 237, 224, 0.97)),
      url('/ubicacion-1.webp') center / cover no-repeat;
    color: #3b322a;
    content-visibility: auto;
    contain-intrinsic-size: 1700px;
  }

  .memories-section::before,
  .memories-section::after {
    content: '';
    position: absolute;
    width: clamp(130px, 18vw, 310px);
    aspect-ratio: 1;
    border: 1px solid rgba(174, 137, 72, 0.18);
    border-radius: 50%;
    pointer-events: none;
  }

  .memories-section::before {
    top: -9%;
    left: -5%;
  }

  .memories-section::after {
    right: -7%;
    bottom: -8%;
  }

  .memories-glow {
    position: absolute;
    width: 38rem;
    height: 38rem;
    border-radius: 50%;
    background: rgba(188, 151, 87, 0.1);
    filter: blur(90px);
    pointer-events: none;
  }

  .memories-glow--one {
    top: -18rem;
    right: -13rem;
  }

  .memories-glow--two {
    bottom: -22rem;
    left: -15rem;
  }

  .memories-header {
    position: relative;
    z-index: 2;
    width: min(760px, 100%);
    margin-inline: auto;
    text-align: center;
  }

  .memories-chapter {
    color: #9b772f;
    font-size: 0.7rem;
    font-weight: 750;
    letter-spacing: 0.27em;
    text-transform: uppercase;
  }

  .memories-ornament {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.85rem;
    width: min(210px, 54vw);
    margin: 1.2rem auto 1.7rem;
    color: #b58a3d;
  }

  .memories-ornament i {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, currentColor);
  }

  .memories-ornament i:last-child {
    background: linear-gradient(90deg, currentColor, transparent);
  }

  .memories-ornament b {
    font-size: 0.72rem;
    font-weight: 400;
  }

  .memories-header h2 {
    margin: 0;
    font-family: var(--serif);
    font-size: clamp(2.6rem, 5.4vw, 5.2rem);
    font-weight: 400;
    line-height: 1.02;
    letter-spacing: -0.025em;
    text-wrap: balance;
  }

  .memories-header h2 em {
    color: #a57d32;
    font-weight: 400;
  }

  .memories-header p {
    max-width: 620px;
    margin: 1.35rem auto 0;
    color: #756a5e;
    font-family: var(--serif);
    font-size: clamp(1rem, 1.6vw, 1.22rem);
    line-height: 1.75;
    text-wrap: pretty;
  }

  .memories-grid {
    position: relative;
    z-index: 2;
    width: min(1380px, 100%);
    margin: clamp(3rem, 6vw, 5rem) auto 0;
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-auto-flow: dense;
    grid-auto-rows: clamp(64px, 5.5vw, 92px);
    gap: clamp(0.55rem, 1vw, 0.95rem);
  }

  .memory-card {
    position: relative;
    min-width: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 2px;
    background: #29231e;
    box-shadow: 0 18px 45px rgba(70, 52, 31, 0.13);
    cursor: zoom-in;
    isolation: isolate;
    transition: transform 420ms cubic-bezier(0.2, 0.75, 0.25, 1), box-shadow 420ms ease;
  }

  .memory-card--featured {
    grid-column: span 8;
    grid-row: span 5;
  }

  .memory-card--wide {
    grid-column: span 6;
    grid-row: span 4;
  }

  .memory-card--tall {
    grid-column: span 4;
    grid-row: span 6;
  }

  .memory-card--portrait {
    grid-column: span 4;
    grid-row: span 5;
  }

  .memory-card picture,
  .memory-card img {
    display: block;
    width: 100%;
    height: 100%;
  }

  .memory-card img {
    object-fit: cover;
    transition: transform 650ms cubic-bezier(0.2, 0.75, 0.25, 1), filter 420ms ease;
  }

  .memory-card__shade {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(180deg, transparent 58%, rgba(20, 15, 11, 0.62));
    opacity: 0.72;
    transition: opacity 350ms ease;
  }

  .memory-card__number {
    position: absolute;
    right: 0.85rem;
    bottom: 0.75rem;
    z-index: 2;
    color: rgba(255, 248, 229, 0.9);
    font-family: var(--serif);
    font-size: 0.78rem;
    letter-spacing: 0.14em;
  }

  .memory-card__action {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.68rem 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.52);
    border-radius: 999px;
    background: rgba(30, 24, 19, 0.46);
    color: white;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    opacity: 0;
    transform: translate(-50%, -40%);
    backdrop-filter: blur(8px);
    transition: opacity 280ms ease, transform 350ms ease;
    white-space: nowrap;
  }

  .memory-card__action i {
    font-size: 1rem;
    font-style: normal;
    font-weight: 300;
  }

  .memory-card:focus-visible {
    outline: 3px solid #b58a3d;
    outline-offset: 4px;
  }

  .memories-hint {
    position: relative;
    z-index: 2;
    margin: 2rem 0 0;
    color: #837568;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-align: center;
    text-transform: uppercase;
  }

  .memories-hint span {
    color: #9b772f;
    font-weight: 750;
  }

  .memory-lightbox {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    grid-template-columns: minmax(52px, 1fr) minmax(0, 1180px) minmax(52px, 1fr);
    align-items: center;
    padding: clamp(1rem, 3vw, 2.5rem);
    background: rgba(13, 11, 9, 0.94);
    backdrop-filter: blur(14px);
    animation: lightbox-in 220ms ease-out both;
  }

  .memory-lightbox figure {
    grid-column: 2;
    min-width: 0;
    margin: 0;
  }

  .memory-lightbox picture {
    display: grid;
    place-items: center;
  }

  .memory-lightbox img {
    width: auto;
    max-width: 100%;
    max-height: calc(100svh - 8rem);
    object-fit: contain;
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.42);
  }

  .memory-lightbox figcaption {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 0.85rem;
    color: rgba(255, 255, 255, 0.62);
    font-size: 0.66rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .memory-lightbox figcaption span {
    color: #d6bd80;
  }

  .lightbox-close,
  .lightbox-nav {
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    color: white;
    cursor: pointer;
    transition: border-color 200ms ease, background 200ms ease, transform 200ms ease;
  }

  .lightbox-close:hover,
  .lightbox-nav:hover {
    border-color: #d6bd80;
    background: rgba(214, 189, 128, 0.12);
    transform: scale(1.06);
  }

  .lightbox-close:focus-visible,
  .lightbox-nav:focus-visible {
    outline: 2px solid #d6bd80;
    outline-offset: 3px;
  }

  .lightbox-close {
    position: absolute;
    top: clamp(0.85rem, 2vw, 1.5rem);
    right: clamp(0.85rem, 2vw, 1.5rem);
    z-index: 2;
    width: 44px;
    height: 44px;
    font-size: 1.7rem;
    font-weight: 200;
    line-height: 1;
  }

  .lightbox-nav {
    width: clamp(42px, 4.5vw, 58px);
    aspect-ratio: 1;
    font-family: var(--serif);
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 200;
    line-height: 0.8;
  }

  .lightbox-nav--previous {
    grid-column: 1;
    justify-self: start;
  }

  .lightbox-nav--next {
    grid-column: 3;
    justify-self: end;
  }

  @media (hover: hover) and (pointer: fine) {
    .memory-card:hover {
      z-index: 5;
      transform: scale(1.045);
      box-shadow: 0 30px 65px rgba(55, 40, 24, 0.28);
    }

    .memory-card:hover img {
      filter: saturate(1.04) contrast(1.02);
      transform: scale(1.035);
    }

    .memory-card:hover .memory-card__shade {
      opacity: 0.92;
    }

    .memory-card:hover .memory-card__action {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  @media (max-width: 1024px) {
    .memories-grid {
      grid-template-columns: repeat(8, minmax(0, 1fr));
      grid-auto-rows: clamp(62px, 8.4vw, 86px);
    }

    .memory-card--featured {
      grid-column: span 8;
      grid-row: span 5;
    }

    .memory-card--wide {
      grid-column: span 4;
      grid-row: span 4;
    }

    .memory-card--tall,
    .memory-card--portrait {
      grid-column: span 4;
      grid-row: span 6;
    }
  }

  @media (max-width: 680px) {
    .memories-section {
      padding: 4.5rem 0 4rem;
      background:
        linear-gradient(rgba(249, 245, 236, 0.975), rgba(244, 237, 224, 0.98)),
        url('/ubicacion-1.webp') center / cover no-repeat;
    }

    .memories-header {
      padding-inline: 1.2rem;
    }

    .memories-chapter {
      font-size: 0.62rem;
      letter-spacing: 0.21em;
    }

    .memories-header h2 {
      font-size: clamp(2.45rem, 12.5vw, 3.65rem);
    }

    .memories-header p {
      font-size: 1rem;
      line-height: 1.65;
    }

    .memories-grid {
      width: 100%;
      margin-top: 2.8rem;
      padding-inline: 0.7rem;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: auto;
      gap: 0.65rem;
    }

    .memory-card,
    .memory-card--featured,
    .memory-card--wide,
    .memory-card--tall,
    .memory-card--portrait {
      grid-row: auto;
    }

    .memory-card--featured,
    .memory-card--wide {
      grid-column: 1 / -1;
    }

    .memory-card--tall,
    .memory-card--portrait {
      grid-column: span 1;
    }

    .memory-card picture,
    .memory-card img {
      height: auto;
    }

    .memory-card img {
      object-fit: contain;
    }

    .memory-card__shade {
      background: linear-gradient(180deg, transparent 72%, rgba(20, 15, 11, 0.58));
    }

    .memory-card__number {
      right: 0.6rem;
      bottom: 0.5rem;
      font-size: 0.66rem;
    }

    .memories-hint {
      padding-inline: 1rem;
      font-size: 0.61rem;
      line-height: 1.6;
    }

    .memory-lightbox {
      grid-template-columns: 1fr;
      padding: 4.5rem 0.8rem 5rem;
    }

    .memory-lightbox figure {
      grid-column: 1;
      width: 100%;
    }

    .memory-lightbox img {
      max-height: calc(100svh - 10.5rem);
    }

    .memory-lightbox figcaption {
      padding-inline: 0.15rem;
      font-size: 0.58rem;
    }

    .lightbox-nav {
      position: absolute;
      bottom: 0.8rem;
      width: 44px;
    }

    .lightbox-nav--previous {
      left: calc(50% - 53px);
    }

    .lightbox-nav--next {
      right: calc(50% - 53px);
    }
  }

  @media (max-width: 360px) {
    .memories-grid {
      grid-template-columns: 1fr;
    }

    .memory-card--featured,
    .memory-card--wide,
    .memory-card--tall,
    .memory-card--portrait {
      grid-column: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .memory-card,
    .memory-card img,
    .memory-card__action,
    .memory-lightbox {
      animation: none;
      transition: none;
    }
  }

  @keyframes lightbox-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
