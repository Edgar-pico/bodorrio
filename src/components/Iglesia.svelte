<script lang="ts">
  import { weddingConfig } from '../lib/wedding-config';
  const details = weddingConfig.religious;
</script>

<section id="iglesia" class="church-section reveal-section">
  <div class="church-background" role="img" aria-label="Nuestro sí ante Dios"></div>
  <div class="church-overlay"></div>
  <div class="church-rays" aria-hidden="true"></div>
  <div class="church-content">
    <span class="open-chapter">Capítulo II · Ahora abierto</span>
    <span class="church-cross" aria-hidden="true">✝</span>
    <h2>Nuestro sí ante Dios</h2>
    <p class="church-intro">Después de tantos caminos, lugares y momentos que nos trajeron hasta aquí… queremos invitarte a ser parte del siguiente capítulo de nuestra historia.</p>

    <div class="ceremony-panel">
      <p class="eyebrow eyebrow--light">Ceremonia religiosa</p>
      <h3>{details.churchName}</h3>
      <div class="ceremony-meta">
        <p><span>Fecha</span><strong>{details.dateLabel}</strong></p>
        <i aria-hidden="true"></i>
        <p><span>Hora</span><strong>{details.timeLabel}</strong></p>
      </div>
      {#if details.churchAddress}<p class="ceremony-address">{details.churchAddress}</p>{/if}
      {#if details.churchMapUrl}
        <a class="story-button story-button--light" href={details.churchMapUrl} target="_blank" rel="noopener noreferrer">Ver ubicación <span aria-hidden="true">↗</span></a>
      {:else}
        <span class="detail-pending">Ubicación detallada próximamente</span>
      {/if}
    </div>
  </div>
</section>
