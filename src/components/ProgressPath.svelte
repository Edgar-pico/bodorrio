<script lang="ts">
  import { onMount } from 'svelte';
  let scrollProgress = $state(0);
  const stops = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Capítulo I', href: '#civil' },
    { label: 'Capítulo II', href: '#iglesia' },
    { label: 'Regalos', href: '#regalos' },
    { label: 'Confirmación', href: '#confirmacion' }
  ];

  onMount(() => {
    let ticking = false;
    const update = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      scrollProgress = height > 0 ? Math.min(100, (scrollY / height) * 100) : 0;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  });
</script>

<nav class="story-progress" aria-label="Navegación de la historia">
  <div class="progress-track"><span style:width={`${scrollProgress}%`}></span></div>
  <div class="progress-links">
    {#each stops as stop, index}
      <a href={stop.href} aria-label={stop.label}><span>{index + 1}</span><small>{stop.label}</small></a>
    {/each}
  </div>
</nav>
