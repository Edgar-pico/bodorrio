<script lang="ts">
  import { onMount } from 'svelte';

  let clicked = $state(false);
  let showContent = $state(false);
  let audioElement: HTMLAudioElement;

  onMount(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('i')) return;

    // Los enlaces privados conservan el token para precargar el RSVP,
    // pero siempre deben comenzar desde la portada de la invitación.
    if (url.hash) {
      url.hash = '';
      window.history.replaceState({}, '', `${url.pathname}${url.search}`);
    }
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
  });
  
  async function handleClick() {
    if (clicked) return;

    clicked = true;

    // El clic de apertura cuenta como interacción del usuario y permite
    // iniciar el audio en navegadores móviles y de escritorio.
    try {
      audioElement.volume = 0.35;
      await audioElement.play();
    } catch (error) {
      console.warn('No fue posible iniciar la música de la invitación:', error);
    }

    setTimeout(() => {
      showContent = true;
    }, 1200);
  }
</script>

<audio
  bind:this={audioElement}
  src="/audio/cancion-boda.mp3"
  preload="auto"
  loop
></audio>

{#if !showContent}
  <div
    class="splash-screen"
    class:splash-screen--opening={clicked}
    onclick={handleClick}
    role="button"
    tabindex="0"
    aria-label="Abrir la invitación de boda de Edgar y Brenda"
    onkeydown={(event) => (event.key === 'Enter' || event.key === ' ') && handleClick()}
  >
    <!-- Cada puerta recorta la mitad correspondiente de una sola imagen completa. -->
    <div class="splash-door splash-door--left" aria-hidden="true">
      <div class="splash-art splash-art--left"></div>
    </div>

    <div class="splash-door splash-door--right" aria-hidden="true">
      <div class="splash-art splash-art--right"></div>
    </div>

    <div class="splash-shade" aria-hidden="true"></div>

    {#if !clicked}
      <div class="splash-content">

        <h2>Edgar <span>&amp;</span> Brenda</h2>
        <p>Toca para abrir el Capítulo II</p>

        <div class="splash-arrow" aria-hidden="true">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .splash-screen {
    position: fixed;
    inset: 0;
    z-index: 50;
    overflow: hidden;
    cursor: pointer;
    background: #17100a;
    isolation: isolate;
  }

  .splash-screen:focus-visible {
    outline: 3px solid #f5d77a;
    outline-offset: -6px;
  }

  .splash-door {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    overflow: hidden;
    transition: transform 1.05s cubic-bezier(.7, 0, .25, 1);
    will-change: transform;
  }

  .splash-door--left {
    left: 0;
    border-right: 1px solid rgba(250, 222, 154, .2);
  }

  .splash-door--right {
    right: 0;
    border-left: 1px solid rgba(24, 14, 7, .24);
  }

  .splash-screen--opening .splash-door--left {
    transform: translate3d(-100%, 0, 0);
  }

  .splash-screen--opening .splash-door--right {
    transform: translate3d(100%, 0, 0);
  }

  .splash-art {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100vw;
    background-color: #2d1a0c;
    background-image: url('/inicio-1.jpg');
    background-image: image-set(
      url('/inicio-1.webp') type('image/webp'),
      url('/inicio-1.jpg') type('image/jpeg')
    );
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .splash-art--left {
    left: 0;
  }

  .splash-art--right {
    right: 0;
  }

  .splash-shade {
    position: absolute;
    inset: 0;
    z-index: 2;
    background:
      radial-gradient(circle at center, rgba(14, 8, 3, .08) 0 24%, rgba(14, 8, 3, .32) 75%),
      rgba(10, 6, 2, .2);
    transition: opacity .45s ease;
    pointer-events: none;
  }

  .splash-screen--opening .splash-shade {
    opacity: 0;
  }

  .splash-content {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: max(1.25rem, env(safe-area-inset-top)) 1.25rem max(1.25rem, env(safe-area-inset-bottom));
    color: white;
    text-align: center;
    pointer-events: none;
  }

  .splash-rings {
    width: clamp(76px, 9vw, 112px);
    margin-bottom: clamp(.75rem, 2.2vh, 1.4rem);
    filter: drop-shadow(0 3px 12px rgba(0, 0, 0, .45));
    animation: ring-glow 2.4s ease-in-out infinite;
  }

  .splash-rings svg {
    display: block;
    width: 100%;
    height: auto;
  }

  .splash-content h2 {
    margin: 0;
    max-width: 100%;
    color: #fffdf7;
    font-family: var(--serif, Georgia, 'Times New Roman', serif);
    font-size: clamp(2.35rem, 5.4vw, 4.75rem);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: .015em;
    text-wrap: balance;
    text-shadow: 0 3px 18px rgba(0, 0, 0, .9), 0 1px 2px rgba(0, 0, 0, .95);
  }

  .splash-content h2 span {
    color: #f5d77a;
    font-size: .8em;
    font-style: italic;
  }

  .splash-content p {
    margin: clamp(.85rem, 2.5vh, 1.4rem) 0 0;
    max-width: min(92vw, 760px);
    color: rgba(255, 255, 255, .96);
    font-size: clamp(.72rem, 1.45vw, 1.08rem);
    font-weight: 500;
    line-height: 1.6;
    letter-spacing: clamp(.14em, .55vw, .34em);
    text-transform: uppercase;
    text-wrap: balance;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 1), 0 1px 2px rgba(0, 0, 0, 1);
  }

  .splash-arrow {
    width: 26px;
    margin-top: clamp(1.25rem, 4vh, 2.4rem);
    color: rgba(255, 255, 255, .9);
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, .8));
    animation: arrow-bounce 1.6s ease-in-out infinite;
  }

  .splash-arrow svg {
    display: block;
    width: 100%;
  }

  @keyframes ring-glow {
    0%, 100% { opacity: .78; transform: scale(.98); }
    50% { opacity: 1; transform: scale(1.03); }
  }

  @keyframes arrow-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }

  @media (max-width: 640px) {
    .splash-content {
      justify-content: center;
      padding-inline: 1rem;
    }

    .splash-content h2 {
      font-size: clamp(2.1rem, 11vw, 3.2rem);
    }

    .splash-content p {
      max-width: 22rem;
      font-size: clamp(.68rem, 3.1vw, .84rem);
      letter-spacing: .16em;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .splash-door {
      transition-duration: .01ms;
    }

    .splash-rings,
    .splash-arrow {
      animation: none;
    }
  }
</style>
