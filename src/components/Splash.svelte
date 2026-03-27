<script>
  import { fade } from 'svelte/transition';
  
  let clicked = $state(false);
  let showContent = $state(false);
  
  function handleClick() {
    clicked = true;
    setTimeout(() => {
      showContent = true;
    }, 1200);
  }
</script>

{#if !showContent}
  <div 
    class="fixed inset-0 z-50 cursor-pointer overflow-hidden"
    onclick={handleClick}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === 'Enter' && handleClick()}
  >
    <!-- Mitad izquierda -->
    <div 
      class="absolute top-0 left-0 w-1/2 h-full transition-transform duration-1000 ease-in-out"
      class:translate-x-[-100%]={clicked}
      style="background-image: url('/inicio-1.jpg'); background-size: cover; background-position: left center;"
    ></div>
    
    <!-- Mitad derecha -->
    <div 
      class="absolute top-0 right-0 w-1/2 h-full transition-transform duration-1000 ease-in-out"
      class:translate-x-[100%]={clicked}
      style="background-image: url('/inicio-1.jpg'); background-size: cover; background-position: right center;"
    ></div>
    
    <!-- Overlay oscuro -->
    <div 
      class="absolute inset-0 bg-black/40 transition-opacity duration-500"
      class:opacity-0={clicked}
    ></div>
    
    <!-- Contenido central -->
    {#if !clicked}
      <div 
        class="absolute inset-0 flex flex-col items-center justify-center z-10"
        in:fade={{ duration: 800 }}
      >
        <!-- Anillos SVG elegantes -->
        <div class="mb-8 animate-pulse">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Anillo izquierdo -->
            <circle cx="40" cy="40" r="25" stroke="url(#gold1)" stroke-width="6" fill="none"/>
            <!-- Anillo derecho (entrelazado) -->
            <circle cx="80" cy="40" r="25" stroke="url(#gold2)" stroke-width="6" fill="none"/>
            <!-- Gradientes dorados -->
            <defs>
              <linearGradient id="gold1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F5D77A"/>
                <stop offset="50%" stop-color="#D4A84B"/>
                <stop offset="100%" stop-color="#B8860B"/>
              </linearGradient>
              <linearGradient id="gold2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#B8860B"/>
                <stop offset="50%" stop-color="#D4A84B"/>
                <stop offset="100%" stop-color="#F5D77A"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <!-- Texto elegante -->
        <h2 class="text-white text-3xl md:text-5xl font-serif tracking-wide mb-4 text-center px-4 drop-shadow-lg">
          Edgar & Brenda
        </h2>
        <p class="text-white/90 text-lg md:text-xl font-light tracking-[0.3em] uppercase drop-shadow-md">
          Toca para abrir
        </p>
        
        <!-- Indicador de toque -->
        <div class="mt-8 animate-bounce">
          <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </div>
    {/if}
  </div>
{/if}