<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  let visible = $state(false);
  let sectionRef;
  
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible = true;
          }
        });
      },
      { threshold: 0.3 }
    );
    
    if (sectionRef) {
      observer.observe(sectionRef);
    }
    
    return () => observer.disconnect();
  });
</script>

<section 
  bind:this={sectionRef}
  class="relative min-h-screen flex items-center justify-center overflow-hidden"
>
  <!-- Imagen de fondo en blanco y negro -->
  <div 
    class="absolute inset-0 bg-fixed bg-cover bg-center grayscale"
    style="background-image: url('/inicio-6.jpg');"
  ></div>
  
  <!-- Overlay oscuro para efecto "bloqueado" -->
  <div class="absolute inset-0 bg-black/60"></div>
  
  <!-- Patrón de líneas (efecto bloqueado) -->
  <div class="absolute inset-0 opacity-10" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px);"></div>
  
  <!-- Contenido -->
  <div class="relative z-10 text-center px-4 max-w-2xl mx-auto py-16">
    {#if visible}
      <!-- Icono de candado -->
      <div 
        class="mb-6"
        in:fade={{ duration: 800 }}
      >
        <div class="w-20 h-20 mx-auto rounded-full border-2 border-white/30 flex items-center justify-center">
          <svg class="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
      </div>
      
      <!-- Etiqueta -->
      <p 
        class="text-white/50 text-sm tracking-[0.3em] uppercase mb-6"
        in:fly={{ y: -20, duration: 800, delay: 200 }}
      >
        Próximamente
      </p>
      
      <!-- Cruz decorativa -->
      <div 
        class="text-4xl mb-8"
        in:fade={{ duration: 800, delay: 300 }}
      >
        ✝️
      </div>
      
      <!-- Mensaje principal -->
      <div 
        class="space-y-6"
        in:fly={{ y: 30, duration: 800, delay: 400 }}
      >
        <p class="text-white text-2xl md:text-3xl font-serif leading-relaxed">
          Este es solo el comienzo de nuestra historia…
        </p>
        
        <p class="text-white/80 text-base md:text-lg leading-relaxed max-w-lg mx-auto">
          Agradecidos con Dios por cada momento que nos llevó a encontrarnos y por permitirnos llegar hasta aquí juntos.
        </p>
      </div>
      
      <!-- Línea decorativa -->
      <div 
        class="flex items-center justify-center gap-4 my-10"
        in:fade={{ duration: 800, delay: 600 }}
      >
        <div class="w-16 h-[1px] bg-white/30"></div>
        <span class="text-white/40">✦</span>
        <div class="w-16 h-[1px] bg-white/30"></div>
      </div>
      
      <!-- Mensaje final -->
      <div 
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        in:fade={{ duration: 800, delay: 700 }}
      >
        <p class="text-white/90 text-lg md:text-xl font-serif italic leading-relaxed">
          "Lo más importante aún está por venir,<br>
          cuando celebremos nuestra unión ante Él."
        </p>
      </div>
      
      <!-- Indicador de "bloqueado" -->
      <p 
        class="text-white/40 text-sm mt-10 tracking-wider"
        in:fade={{ duration: 800, delay: 900 }}
      >
        🔒 Detalles disponibles próximamente
      </p>
    {/if}
  </div>
  
  <!-- Decoración de esquinas -->
  <div class="absolute top-8 left-8 w-16 h-16 border-t border-l border-white/10"></div>
  <div class="absolute top-8 right-8 w-16 h-16 border-t border-r border-white/10"></div>
  <div class="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-white/10"></div>
  <div class="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-white/10"></div>
</section>