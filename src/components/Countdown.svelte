<script lang="ts">
  import { onMount } from 'svelte';

  let { eventDate = null, dateLabel = 'Fecha por confirmar' }: { eventDate?: string | null; dateLabel?: string } = $props();
  let days = $state(0);
  let hours = $state(0);
  let minutes = $state(0);
  let seconds = $state(0);
  let hasDate = $derived(Boolean(eventDate));

  function updateCountdown() {
    if (!eventDate) return;
    const diff = new Date(eventDate).getTime() - Date.now();
    if (diff <= 0) return;
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
  <div class="countdown-ornament" aria-hidden="true">✦</div>
  <div class="section-shell">
    <p class="eyebrow">{hasDate ? 'Cuenta regresiva' : 'El siguiente gran día'}</p>
    <h2 id="countdown-title">{hasDate ? 'Cada vez falta menos' : 'Muy pronto revelaremos la fecha'}</h2>

    {#if hasDate}
      <div class="countdown-grid" aria-live="polite">
        {#each [
          { value: days, label: 'Días' },
          { value: hours, label: 'Horas' },
          { value: minutes, label: 'Minutos' },
          { value: seconds, label: 'Segundos' }
        ] as item}
          <div class="countdown-item">
            <strong>{String(item.value).padStart(2, '0')}</strong>
            <span>{item.label}</span>
          </div>
        {/each}
      </div>
    {:else}
      <div class="countdown-pending" aria-hidden="true"><span>✦</span><i></i><span>✦</span><i></i><span>✦</span></div>
    {/if}

    <p class="countdown-date">{dateLabel}</p>
  </div>
</section>
