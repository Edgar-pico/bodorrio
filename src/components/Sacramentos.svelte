<script>
  import { onMount } from 'svelte';
  
  let progress = $state(0);
  let sectionRef;
  
  const sacramentos = [
    { nombre: 'Bautismo', icono: '💧', completado: true },
    { nombre: 'Primera Comunión', icono: '🍞', completado: true },
    { nombre: 'Confirmación', icono: '🕊️', completado: true },
    { nombre: 'Matrimonio', icono: '💒', completado: false }
  ];
  
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animar el progreso gradualmente
            const targetProgress = 75; // 3 de 4 sacramentos = 75%
            let current = 0;
            const interval = setInterval(() => {
              if (current >= targetProgress) {
                clearInterval(interval);
              } else {
                current += 2;
                progress = Math.min(current, targetProgress);
              }
            }, 30);
          }
        });
      },
      { threshold: 0.3 }
    );
    
    if (sectionRef) observer.observe(sectionRef);
    return () => observer.disconnect();
  });
</script>

<section 
  bind:this={sectionRef}
  class="py-20 bg-gradient-to-b from-stone-100 to-stone-50"
>
  <div class="container mx-auto px-4 max-w-4xl">
    <!-- Título -->
    <div class="text-center mb-16">
      <p class="text-stone-500 text-sm tracking-[0.3em] uppercase mb-4">Nuestro camino de fe</p>
      <h2 class="text-3xl md:text-4xl font-serif text-stone-700">Los Sacramentos</h2>
    </div>
    
    <!-- Línea de progreso -->
    <div class="relative">
      <!-- Línea de fondo -->
      <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-stone-200 rounded-full"></div>
      
      <!-- Línea de progreso activa -->
      <div 
        class="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-stone-500 to-stone-400 rounded-full transition-all duration-1000 ease-out"
        style="height: {progress}%;"
      ></div>
      
      <!-- Sacramentos -->
      <div class="relative space-y-12">
        {#each sacramentos as sacramento, i}
          <div class="flex items-center {i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}">
            <!-- Contenido -->
            <div class="w-5/12 {i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}">
              <div 
                class="inline-block p-4 rounded-2xl transition-all duration-500 {sacramento.completado ? 'bg-white shadow-md' : 'bg-stone-200/50 opacity-60'}"
              >
                <p class="text-2xl mb-2">{sacramento.icono}</p>
                <h3 class="font-serif text-lg {sacramento.completado ? 'text-stone-700' : 'text-stone-400'}">
                  {sacramento.nombre}
                </h3>
                {#if sacramento.completado}
                  <span class="text-xs text-green-600 flex items-center justify-center gap-1 mt-2">
                    ✓ Completado
                  </span>
                {:else}
                  <span class="text-xs text-stone-400 flex items-center justify-center gap-1 mt-2">
                    🔒 Próximamente
                  </span>
                {/if}
              </div>
            </div>
            
            <!-- Punto central -->
            <div class="w-2/12 flex justify-center">
              <div 
                class="w-6 h-6 rounded-full border-4 transition-all duration-500 z-10 {sacramento.completado ? 'bg-stone-500 border-white shadow-lg' : 'bg-stone-300 border-stone-200'}"
              ></div>
            </div>
            
            <!-- Espacio vacío -->
            <div class="w-5/12"></div>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Mensaje final -->
    <p class="text-center text-stone-500 mt-16 italic">
      "Caminando juntos en la fe, paso a paso"
    </p>
  </div>
</section>