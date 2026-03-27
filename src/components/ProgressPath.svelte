<script>
  import { onMount } from 'svelte';
  
  let scrollProgress = $state(0);
  let activeIndex = $state(0);
  let visible = $state(false);
  
  const sacramentos = [
    { nombre: 'Bautismo', icono: '💧', seccion: 'hero' },
    { nombre: 'Primera Comunión', icono: 'caliz', seccion: 'ceremonia' },
    { nombre: 'Confirmación', icono: '🕊️', seccion: 'comida' },
    { nombre: 'Matrimonio', icono: '💒', seccion: 'iglesia', bloqueado: true }
  ];
  
  onMount(() => {
    setTimeout(() => {
      visible = true;
    }, 2000);
    
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      scrollProgress = Math.min(progress, 75);
      
      if (progress < 25) activeIndex = 0;
      else if (progress < 50) activeIndex = 1;
      else if (progress < 75) activeIndex = 2;
      else activeIndex = 3;
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

{#if visible}
  <!-- Contenedor fijo en el lado izquierdo -->
  <div class="fixed left-6 md:left-10 top-1/2 -translate-y-1/2 z-40 hidden md:block">
    <div class="relative">
      <!-- Línea de fondo -->
      <div class="absolute left-3 top-0 w-[2px] h-full bg-white/20 rounded-full"></div>
      
      <!-- Línea de progreso -->
      <div 
        class="absolute left-3 top-0 w-[2px] bg-gradient-to-b from-stone-400 to-stone-500 rounded-full transition-all duration-300 ease-out"
        style="height: {scrollProgress * 1.33}%;"
      ></div>
      
      <!-- Puntos de sacramentos -->
      <div class="flex flex-col gap-8">
        {#each sacramentos as sacramento, i}
          <div class="relative flex items-center gap-3 group">
            <!-- Punto -->
            <div 
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-500 z-10
                {i <= activeIndex && !sacramento.bloqueado 
                  ? 'bg-stone-500 text-white shadow-lg scale-110' 
                  : sacramento.bloqueado 
                    ? 'bg-stone-700 text-white/50 border border-white/20' 
                    : 'bg-white/10 text-white/50 border border-white/20'}"
            >
              {#if sacramento.bloqueado}
                🔒
              {:else if i <= activeIndex}
                ✓
              {:else}
                {i + 1}
              {/if}
            </div>
            
            <!-- Tooltip con nombre -->
            <div 
              class="absolute left-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50"
            >
              <div class="bg-white/95 backdrop-blur-sm text-stone-700 text-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 min-w-max">
                {#if sacramento.icono === 'caliz'}
                  <img src="/caliz.svg" alt="Cáliz" class="w-5 h-5 flex-shrink-0" />
                {:else}
                  <span class="flex-shrink-0">{sacramento.icono}</span>
                {/if}
                <span class="font-medium whitespace-nowrap">{sacramento.nombre}</span>
                {#if sacramento.bloqueado}
                  <span class="text-xs text-stone-400 whitespace-nowrap">(Próximamente)</span>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <!-- Versión móvil: barra superior -->
  <div class="fixed top-0 left-0 right-0 z-40 md:hidden">
    <div class="h-1 bg-white/10">
      <div 
        class="h-full bg-gradient-to-r from-stone-400 to-stone-500 transition-all duration-300"
        style="width: {scrollProgress * 1.33}%;"
      ></div>
    </div>
    
    <!-- Iconos de sacramentos en móvil -->
    <div class="flex justify-around py-2 bg-black/30 backdrop-blur-sm">
      {#each sacramentos as sacramento, i}
        <div 
          class="transition-all duration-300 {i <= activeIndex && !sacramento.bloqueado ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}"
        >
          {#if sacramento.bloqueado}
            🔒
          {:else if sacramento.icono === 'caliz'}
            <img src="/caliz.svg" alt="Cáliz" class="w-5 h-5" />
          {:else}
            <span class="text-lg">{sacramento.icono}</span>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}