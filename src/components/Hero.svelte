<script>
  import { fade, fly } from 'svelte/transition';
</script>

<section 
  class="min-h-screen flex flex-col items-center justify-center px-4 relative"
  style="background-image: url('/inicio-2.jpg'); background-size: cover; background-position: center;"
>
  <!-- Contenido centrado -->
  <div 
    class="text-center"
    in:fade={{ duration: 1000 }}
  >
    <!-- Subtítulo -->
    <p 
      class="text-stone-600 text-lg tracking-[0.4em] uppercase mb-4"
      in:fly={{ y: -20, duration: 800, delay: 300 }}
    >
      ¡Nos casamos!
    </p>
    
    <!-- Nombres -->
    <h1 
      class="text-5xl md:text-7xl font-serif text-stone-800 mb-6"
      in:fly={{ y: 30, duration: 800, delay: 500 }}
    >
      Edgar & Brenda
    </h1>
    
    <!-- Línea decorativa -->
    <div 
      class="w-24 h-[1px] bg-stone-400 mx-auto mb-6"
      in:fade={{ duration: 800, delay: 700 }}
    ></div>
    
    <!-- Fecha -->
    <p 
      class="text-stone-700 text-xl md:text-2xl font-medium mb-2"
      in:fade={{ duration: 800, delay: 900 }}
    >
      23 de Mayo, 2026
    </p>
    
    <!-- Mensaje -->
    <p 
      class="text-stone-600 text-base tracking-wide max-w-md mx-auto"
      in:fade={{ duration: 800, delay: 1100 }}
    >
      Hoy damos un paso importante en nuestra historia…
      y nos haría muy feliz compartirlo contigo.
    </p>
  </div>
</section>