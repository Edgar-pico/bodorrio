<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  const eventDate = new Date('2026-05-23T17:00:00');  
  let days = $state(0);
  let hours = $state(0);
  let minutes = $state(0);
  let seconds = $state(0);
  let interval;
  
  function updateCountdown() {
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    
    if (diff > 0) {
      days = Math.floor(diff / (1000 * 60 * 60 * 24));
      hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((diff % (1000 * 60)) / 1000);
    }
  }
  
  onMount(() => {
    updateCountdown();
    interval = setInterval(updateCountdown, 1000);
  });
  
  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<section id="countdown" class="relative py-24 overflow-hidden" style="background: linear-gradient(135deg, #e8ebe4 0%, #d4d9cf 50%, #c9d1c1 100%);">
  
  <!-- Patrón decorativo de fondo -->
  <div class="absolute inset-0 opacity-10">
    <div class="absolute top-10 left-10 text-6xl">🌿</div>
    <div class="absolute top-20 right-20 text-4xl">🍃</div>
    <div class="absolute bottom-10 left-1/4 text-5xl">🌿</div>
    <div class="absolute bottom-20 right-10 text-6xl">🍃</div>
  </div>
  
  <div class="container mx-auto px-4 text-center relative z-10">
    
    <!-- Decoración superior -->
    <div class="flex items-center justify-center gap-4 mb-6">
      <div class="w-20 h-[1px] bg-stone-500/40"></div>
      <span class="text-2xl">🌿</span>
      <div class="w-20 h-[1px] bg-stone-500/40"></div>
    </div>
    
    <!-- Subtítulo -->
    <p class="text-stone-600 text-sm tracking-[0.3em] uppercase mb-2">
      Cuenta regresiva
    </p>
    
    <h2 class="text-3xl md:text-4xl font-serif text-stone-700 mb-12">
      Faltan
    </h2>
    
    <!-- Cards del countdown -->
    <div class="flex justify-center gap-3 md:gap-6 flex-wrap">
      {#each [
        { value: days, label: 'Días' },
        { value: hours, label: 'Horas' },
        { value: minutes, label: 'Minutos' },
        { value: seconds, label: 'Segundos' }
      ] as item, i}
        <div 
          class="group relative"
          in:fly={{ y: 30, duration: 600, delay: i * 100 }}
        >
          <!-- Card con efecto glassmorphism -->
          <div class="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-5 md:p-7 min-w-[80px] md:min-w-[110px] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <span class="block text-4xl md:text-5xl font-light text-stone-700">
              {String(item.value).padStart(2, '0')}
            </span>
            <p class="text-xs md:text-sm text-stone-500 mt-2 uppercase tracking-wider font-medium">
              {item.label}
            </p>
          </div>
          
          <!-- Separador entre cards -->
          {#if i < 3}
            <span class="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 text-stone-400 text-2xl hidden md:block">
              :
            </span>
          {/if}
        </div>
      {/each}
    </div>
    
    <!-- Mensaje -->
    <p class="mt-12 text-stone-600 font-light tracking-wide text-lg italic">
      "Para el día más especial de nuestras vidas"
    </p>
    
    <!-- Fecha -->
    <p class="mt-4 text-stone-500 text-sm tracking-widest uppercase">
      23 de Mayo, 2026
    </p>
    
    <!-- Decoración inferior -->
    <div class="flex items-center justify-center gap-4 mt-10">
      <div class="w-12 h-[1px] bg-stone-500/40"></div>
      <span class="text-xl">💒</span>
      <div class="w-12 h-[1px] bg-stone-500/40"></div>
    </div>
    
  </div>
</section>