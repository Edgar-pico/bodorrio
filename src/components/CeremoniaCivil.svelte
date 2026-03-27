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
  <!-- Imagen de fondo con efecto parallax -->
  <div 
    class="absolute inset-0 bg-fixed bg-cover bg-center"
    style="background-image: url('/inicio-3.jpg');"
  ></div>
  
  <!-- Overlay oscuro para legibilidad -->
  <div class="absolute inset-0 bg-black/50"></div>
  
  <!-- Contenido -->
  <div class="relative z-10 text-center px-4 max-w-2xl mx-auto py-16">
    {#if visible}
      <!-- Icono decorativo -->
      <div 
        class="mb-6"
        in:fade={{ duration: 800 }}
      >
        <svg class="w-16 h-16 mx-auto text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      
      <!-- Título -->
      <h2 
        class="text-stone-300 text-lg tracking-[0.3em] uppercase mb-4"
        in:fly={{ y: -20, duration: 800, delay: 200 }}
      >
        Ceremonia Civil
      </h2>
      
      <!-- Línea decorativa -->
      <div 
        class="w-24 h-[1px] bg-stone-400/60 mx-auto mb-8"
        in:fade={{ duration: 800, delay: 400 }}
      ></div>
      
      <!-- Fecha y hora -->
      <p 
        class="text-white text-3xl md:text-4xl font-serif mb-4"
        in:fly={{ y: 30, duration: 800, delay: 500 }}
      >
        23 de Mayo, 2026
      </p>
      
      <p 
        class="text-stone-300 text-xl mb-6"
        in:fly={{ y: 30, duration: 800, delay: 600 }}
      >
        5:30 PM
      </p>
      
      <!-- Mensaje especial -->
      <p 
        class="text-white/90 text-base md:text-lg leading-relaxed mb-8 italic"
        in:fade={{ duration: 800, delay: 650 }}
      >
        "Nos honraría contar con su presencia como testigos de este momento tan significativo.<br>
        La ceremonia dará inicio a las 5:30 p.m., por lo que les pedimos amablemente su puntualidad."
      </p>
      
      <!-- Ubicación -->
      <div 
        class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8"
        in:fade={{ duration: 800, delay: 700 }}
      >
        <p class="text-white font-medium text-lg mb-2">
          📍 Lugar de celebración
        </p>
        <p class="text-white/80 text-sm">
          Gral. Manuel Palafox 103, Bosques de la Alameda<br>
          38070 Celaya, Guanajuato
        </p>
      </div>
      
      <!-- Botón de ubicación -->
      <a 
        href="https://maps.app.goo.gl/CC2Hp4CzRqshZyxP6" 
        target="_blank"
        class="inline-flex items-center gap-2 px-6 py-3 bg-stone-600 text-white rounded-full hover:bg-stone-700 transition-all duration-300"
        in:fade={{ duration: 800, delay: 900 }}
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        Ver en Google Maps
      </a>
    {/if}
  </div>
  
  <!-- Decoración de esquinas -->
  <div class="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-stone-400/40"></div>
  <div class="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-stone-400/40"></div>
  <div class="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-stone-400/40"></div>
  <div class="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-stone-400/40"></div>
</section>