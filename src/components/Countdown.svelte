<script lang="ts">
  import { onMount } from 'svelte';

  let {
    eventDate = null,
    dateLabel = 'Fecha por confirmar'
  }: {
    eventDate?: string | null;
    dateLabel?: string;
  } = $props();

  let days = $state(0);
  let hours = $state(0);
  let minutes = $state(0);
  let seconds = $state(0);

  let hasDate = $derived(Boolean(eventDate));
  let eventHasArrived = $state(false);

  function resetCountdown() {
    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
  }

  function updateCountdown() {
    if (!eventDate) {
      resetCountdown();
      return;
    }

    const target = new Date(eventDate).getTime();
    const diff = target - Date.now();

    if (!Number.isFinite(target) || diff <= 0) {
      eventHasArrived = true;
      resetCountdown();
      return;
    }

    eventHasArrived = false;
    days = Math.floor(diff / 86_400_000);
    hours = Math.floor((diff % 86_400_000) / 3_600_000);
    minutes = Math.floor((diff % 3_600_000) / 60_000);
    seconds = Math.floor((diff % 60_000) / 1_000);
  }

  onMount(() => {
    if (!eventDate) return;

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1_000);

    return () => window.clearInterval(interval);
  });
</script>

<section id="countdown" class="countdown-section reveal-section" aria-labelledby="countdown-title">
  <div class="countdown-frame" aria-hidden="true"></div>

  <div class="countdown-shell">
    <header class="countdown-header">
      <div class="countdown-ornament" aria-hidden="true">
        <i></i>
        <span>✦</span>
        <i></i>
      </div>

      <p class="countdown-eyebrow">
        {hasDate ? 'Cuenta regresiva' : 'El siguiente gran día'}
      </p>

      <h2 id="countdown-title">
        {eventHasArrived
          ? 'El gran día ha llegado'
          : hasDate
            ? 'Cada día más cerca'
            : 'Muy pronto revelaremos la fecha'}
      </h2>

      {#if hasDate && !eventHasArrived}
        <p class="countdown-lead">
          Falta cada vez menos para celebrar juntos este momento que hemos preparado con tanto cariño.
        </p>
      {/if}
    </header>

    {#if hasDate}
      <div class="countdown-grid" aria-label="Tiempo restante para la boda">
        {#each [
          { value: days, label: 'Días' },
          { value: hours, label: 'Horas' },
          { value: minutes, label: 'Minutos' },
          { value: seconds, label: 'Segundos' }
        ] as item}
          <div class="countdown-item">
            <span class="countdown-item__ornament" aria-hidden="true">✦</span>
            <strong>{String(item.value).padStart(2, '0')}</strong>
            <span class="countdown-item__label">{item.label}</span>
          </div>
        {/each}
      </div>
    {:else}
      <div class="countdown-pending" aria-hidden="true">
        <span>✦</span><i></i><span>✦</span><i></i><span>✦</span>
      </div>
    {/if}

    <footer class="countdown-footer">
      <div class="countdown-date-line" aria-hidden="true"></div>
      <p class="countdown-date">{dateLabel}</p>
      <div class="countdown-date-line" aria-hidden="true"></div>
    </footer>
  </div>
</section>

<style>
  .countdown-section {
    --countdown-sage: #334036;
    --countdown-sage-soft: #687064;
    --countdown-gold: #b48d4d;
    --countdown-gold-soft: #d4bd8b;
    --countdown-paper: #fbf8f1;
    --countdown-cream: #f2eee4;

    position: relative;
    isolation: isolate;
    overflow: hidden;
    width: 100%;
    padding: clamp(5.5rem, 9vw, 8rem) clamp(1rem, 4vw, 3rem);
    background:
      radial-gradient(circle at 15% 10%, rgba(180, 141, 77, 0.1), transparent 26rem),
      radial-gradient(circle at 88% 88%, rgba(51, 64, 54, 0.08), transparent 28rem),
      linear-gradient(145deg, #faf7ef 0%, var(--countdown-cream) 55%, #ecebe2 100%);
    color: var(--countdown-sage);
  }

  .countdown-section::before,
  .countdown-section::after {
    content: '';
    position: absolute;
    z-index: -1;
    width: clamp(190px, 24vw, 390px);
    aspect-ratio: 1;
    border: 1px solid rgba(180, 141, 77, 0.14);
    border-radius: 50%;
    pointer-events: none;
  }

  .countdown-section::before {
    top: -18%;
    left: -8%;
  }

  .countdown-section::after {
    right: -10%;
    bottom: -28%;
  }

  .countdown-frame {
    position: absolute;
    inset: clamp(0.8rem, 1.6vw, 1.4rem);
    border: 1px solid rgba(180, 141, 77, 0.2);
    pointer-events: none;
  }

  .countdown-frame::before,
  .countdown-frame::after {
    content: '✦';
    position: absolute;
    left: 50%;
    color: var(--countdown-gold);
    background: var(--countdown-cream);
    padding-inline: 0.8rem;
    font-size: 0.65rem;
    transform: translateX(-50%);
  }

  .countdown-frame::before {
    top: -0.45rem;
  }

  .countdown-frame::after {
    bottom: -0.45rem;
  }

  .countdown-shell {
    position: relative;
    z-index: 2;
    width: min(1100px, 100%);
    margin-inline: auto;
    text-align: center;
  }

  .countdown-header {
    width: min(760px, 100%);
    margin-inline: auto;
  }

  .countdown-ornament {
    width: min(210px, 58vw);
    margin: 0 auto 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.85rem;
    color: var(--countdown-gold);
  }

  .countdown-ornament i {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, currentColor);
  }

  .countdown-ornament i:last-child {
    background: linear-gradient(90deg, currentColor, transparent);
  }

  .countdown-ornament span {
    font-size: 0.72rem;
  }

  .countdown-eyebrow {
    margin: 0;
    color: var(--countdown-gold);
    font-size: clamp(0.64rem, 0.8vw, 0.75rem);
    font-weight: 800;
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }

  .countdown-header h2 {
    margin: 1.15rem auto 0;
    color: var(--countdown-sage);
    font-family: var(--serif, Georgia, 'Times New Roman', serif);
    font-size: clamp(3rem, 6.5vw, 6rem);
    font-weight: 400;
    line-height: 0.98;
    letter-spacing: -0.035em;
    text-wrap: balance;
  }

  .countdown-lead {
    max-width: 600px;
    margin: 1.5rem auto 0;
    color: var(--countdown-sage-soft);
    font-family: var(--serif, Georgia, 'Times New Roman', serif);
    font-size: clamp(1rem, 1.55vw, 1.15rem);
    line-height: 1.7;
    text-wrap: pretty;
  }

  .countdown-grid {
    width: min(900px, 100%);
    margin: clamp(3rem, 6vw, 4.5rem) auto 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: clamp(0.75rem, 1.7vw, 1.3rem);
  }

  .countdown-item {
    position: relative;
    min-width: 0;
    min-height: clamp(175px, 17vw, 210px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.6rem 0.7rem 1.45rem;
    border: 1px solid rgba(51, 64, 54, 0.14);
    background: rgba(255, 253, 248, 0.72);
    box-shadow: 0 18px 45px rgba(66, 59, 46, 0.055);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .countdown-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 42%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--countdown-gold), transparent);
    transform: translateX(-50%);
  }

  .countdown-item__ornament {
    margin-bottom: 0.65rem;
    color: var(--countdown-gold-soft);
    font-size: 0.5rem;
  }

  .countdown-item strong {
    display: block;
    color: var(--countdown-sage);
    font-family: var(--serif, Georgia, 'Times New Roman', serif);
    font-size: clamp(3rem, 6vw, 5.2rem);
    font-weight: 400;
    line-height: 0.95;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.04em;
  }

  .countdown-item__label {
    display: block;
    margin-top: 1.05rem;
    color: #846b43;
    font-size: clamp(0.58rem, 0.75vw, 0.68rem);
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .countdown-pending {
    width: min(320px, 80%);
    margin: 3.5rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    color: var(--countdown-gold);
  }

  .countdown-pending i {
    flex: 1;
    height: 1px;
    background: rgba(180, 141, 77, 0.36);
  }

  .countdown-footer {
    width: min(680px, 92%);
    margin: clamp(2.5rem, 5vw, 3.8rem) auto 0;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: clamp(0.8rem, 2vw, 1.5rem);
  }

  .countdown-date-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(180, 141, 77, 0.55));
  }

  .countdown-date-line:last-child {
    background: linear-gradient(90deg, rgba(180, 141, 77, 0.55), transparent);
  }

  .countdown-date {
    margin: 0;
    color: #79674d;
    font-size: clamp(0.62rem, 0.8vw, 0.72rem);
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  @media (max-width: 720px) {
    .countdown-section {
      padding: 5.2rem 1rem;
    }

    .countdown-frame {
      inset: 0.6rem;
    }

    .countdown-header h2 {
      font-size: clamp(2.8rem, 13vw, 4.4rem);
    }

    .countdown-lead {
      max-width: 430px;
      font-size: 1rem;
      line-height: 1.65;
    }

    .countdown-grid {
      width: min(520px, 100%);
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
      margin-top: 2.8rem;
    }

    .countdown-item {
      min-height: 155px;
      padding: 1.35rem 0.45rem 1.25rem;
    }

    .countdown-item strong {
      font-size: clamp(3rem, 16vw, 4.2rem);
    }

    .countdown-footer {
      width: min(500px, 92%);
      margin-top: 2.6rem;
      grid-template-columns: minmax(20px, 1fr) auto minmax(20px, 1fr);
      gap: 0.65rem;
    }

    .countdown-date {
      font-size: 0.58rem;
      letter-spacing: 0.14em;
    }
  }

  @media (max-width: 390px) {
    .countdown-section {
      padding-inline: 0.75rem;
    }

    .countdown-grid {
      gap: 0.55rem;
    }

    .countdown-item {
      min-height: 145px;
    }

    .countdown-date {
      white-space: normal;
      line-height: 1.5;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .countdown-section *,
    .countdown-section *::before,
    .countdown-section *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
</style>
