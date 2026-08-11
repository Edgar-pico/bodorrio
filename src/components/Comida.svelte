<script lang="ts">
  import { weddingConfig } from '../lib/wedding-config';
  const details = weddingConfig.religious;
</script>

<section id="recepcion" class="reception-section reveal-section">
  <div class="reception-background" role="img" aria-label="Recepción de nuestra boda"></div>
  <div class="reception-overlay"></div>
  <div class="reception-content">
    <p class="eyebrow eyebrow--light">Después de la ceremonia</p>
    <h2>Celebremos juntos</h2>
    <p>La historia continuará con una noche para brindar, compartir y crear nuevos recuerdos.</p>
    <div class="reception-card">
      <span aria-hidden="true">✦</span>
      <h3>{details.receptionName ?? 'Recepción'}</h3>
      <p class="reception-time">Recepción · {details.receptionTimeLabel ?? 'Horario por confirmar'}</p>
      {#if details.receptionAddress}<address>{details.receptionAddress}</address>{/if}
      {#if details.receptionMapUrl}
        <a class="story-button story-button--light" href={details.receptionMapUrl} target="_blank" rel="noopener noreferrer">Ver ubicación <span aria-hidden="true">↗</span></a>
      {:else}
        <small>Compartiremos los detalles muy pronto.</small>
      {/if}
    </div>
  </div>
</section>
