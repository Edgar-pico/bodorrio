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
  <!-- Imagen de fondo -->
  <div 
    class="absolute inset-0 bg-fixed bg-cover bg-center"
    style="background-image: url('/inicio-4.jpg');"
  ></div>
  
  <!-- Overlay con gradiente -->
  <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
  
  <!-- Contenido -->
  <div class="relative z-10 text-center px-4 max-w-2xl mx-auto py-16">
    {#if visible}
      <!-- Icono decorativo -->
      <div 
        class="mb-6"
        in:fade={{ duration: 800 }}
      >
        <svg class="w-16 h-16 mx-auto text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          <circle cx="12" cy="12" r="10" stroke-width="1"/>
        </svg>
        <!-- Icono de cubiertos más elegante -->
        <div class="flex justify-center gap-2 -mt-12">
          <span class="text-4xl">🍴</span>
        </div>
      </div>
      
      <!-- Título -->
      <h2 
        class="text-stone-200 text-lg tracking-[0.3em] uppercase mb-4 mt-4"
        in:fly={{ y: -20, duration: 800, delay: 200 }}
      >
        Recepción
      </h2>
      
      <!-- Línea decorativa -->
      <div 
        class="flex items-center justify-center gap-4 mb-8"
        in:fade={{ duration: 800, delay: 400 }}
      >
        <div class="w-16 h-[1px] bg-stone-400/60"></div>
        <span class="text-stone-300">✦</span>
        <div class="w-16 h-[1px] bg-stone-400/60"></div>
      </div>
      
      <!-- Mensaje principal -->
      <p 
        class="text-white text-2xl md:text-3xl font-serif mb-6 leading-relaxed"
        in:fly={{ y: 30, duration: 800, delay: 500 }}
      >
        Celebremos juntos
      </p>
      
      <!-- Descripción -->
      <p 
        class="text-white/90 text-base md:text-lg leading-relaxed mb-10 italic max-w-lg mx-auto"
        in:fade={{ duration: 800, delay: 650 }}
      >
        "Al finalizar la celebración, nos gustaría compartir con ustedes una comida en el mismo lugar."
      </p>
      
      <!-- Card de información -->
      <div 
        class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8"
        in:fade={{ duration: 800, delay: 700 }}
      >
        <div class="flex flex-col md:flex-row items-center justify-center gap-8">
          <!-- Hora -->
          <div class="text-center">
            <p class="text-stone-300 text-sm uppercase tracking-wider mb-2">Hora aproximada</p>
            <p class="text-white text-2xl font-serif">7:00 PM</p>
          </div>
          
          <!-- Separador -->
          <div class="hidden md:block w-[1px] h-12 bg-stone-400/40"></div>
          
          <!-- Lugar -->
          <div class="text-center">
            <p class="text-stone-300 text-sm uppercase tracking-wider mb-2">Lugar</p>
            <p class="text-white text-lg">Mismo lugar de la ceremonia</p>
          </div>
        </div>
      </div>
      
      <!-- Nota adicional -->
      <p 
        class="text-stone-300 text-sm tracking-wide"
        in:fade={{ duration: 800, delay: 900 }}
      >
        🥂 ¡Los esperamos para brindar!
      </p>
    {/if}
  </div>
  
  <!-- Decoración de esquinas -->
  <div class="absolute top-8 left-8 w-16 h-16 border-t border-l border-stone-400/30"></div>
  <div class="absolute top-8 right-8 w-16 h-16 border-t border-r border-stone-400/30"></div>
  <div class="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-stone-400/30"></div>
  <div class="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-stone-400/30"></div>
</section>