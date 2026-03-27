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
    style="background-image: url('/inicio-5.jpg');"
  ></div>
  
  <!-- Overlay suave -->
  <div class="absolute inset-0 bg-black/40"></div>
  
  <!-- Contenido -->
  <div class="relative z-10 text-center px-4 max-w-2xl mx-auto py-16">
    {#if visible}
      <!-- Icono decorativo -->
      <div 
        class="mb-6 text-5xl"
        in:fade={{ duration: 800 }}
      >
        👶
      </div>
      
      <!-- Título -->
      <h2 
        class="text-white text-lg tracking-[0.3em] uppercase mb-4"
        in:fly={{ y: -20, duration: 800, delay: 200 }}
      >
        Los más pequeños
      </h2>
      
      <!-- Línea decorativa -->
      <div 
        class="flex items-center justify-center gap-4 mb-8"
        in:fade={{ duration: 800, delay: 400 }}
      >
        <div class="w-12 h-[1px] bg-white/40"></div>
        <span class="text-white/60">♡</span>
        <div class="w-12 h-[1px] bg-white/40"></div>
      </div>
      
      <!-- Mensaje principal -->
      <div 
        class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8"
        in:fly={{ y: 30, duration: 800, delay: 500 }}
      >
        <p class="text-white text-xl md:text-2xl font-serif mb-6 leading-relaxed">
          Nos encantará compartir este momento también con los más pequeños.
        </p>
        
        <p class="text-white/90 text-base md:text-lg leading-relaxed">
          Agradecemos su apoyo para que en todo momento se encuentren bajo su cuidado y supervisión.
        </p>
      </div>
      
      <!-- Iconos decorativos -->
      <div 
        class="flex justify-center gap-6 text-3xl"
        in:fade={{ duration: 800, delay: 700 }}
      >
        <span class="animate-bounce" style="animation-delay: 0s;">🎈</span>
        <span class="animate-bounce" style="animation-delay: 0.2s;">⭐</span>
        <span class="animate-bounce" style="animation-delay: 0.4s;">🎈</span>
      </div>
      
      <!-- Nota -->
      <p 
        class="text-white/70 text-sm mt-8 tracking-wide"
        in:fade={{ duration: 800, delay: 900 }}
      >
        ¡Gracias por su comprensión!
      </p>
    {/if}
  </div>
  
  <!-- Decoración de esquinas -->
  <div class="absolute top-8 left-8 w-16 h-16 border-t border-l border-white/20"></div>
  <div class="absolute top-8 right-8 w-16 h-16 border-t border-r border-white/20"></div>
  <div class="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-white/20"></div>
  <div class="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-white/20"></div>
</section>