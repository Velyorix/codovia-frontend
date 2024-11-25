<template>
  <section class="relative flex flex-col md:flex-row items-center justify-between min-h-screen bg-gradient-to-br from-[#0d0f18] via-[#131520] to-[#0a0b10] px-6 md:px-16 lg:px-24 overflow-hidden">
    <!-- Text Content -->
    <div class="z-10 max-w-xl md:max-w-2xl lg:max-w-3xl space-y-6" data-aos="fade-up">
      <h1 class="text-5xl md:text-7xl font-extrabold leading-tight">
        <span class="text-transparent bg-clip-text animate-smoothColor bg-gradient-to-r from-[#c084fc] via-[#818cf8] to-[#38bdf8] drop-shadow-lg">
          Explorez Codovia
        </span>
        <br />
        <span class="text-gray-200 drop-shadow-sm">
          votre source ultime pour les
        </span>
        <br />
        <span class="text-transparent bg-clip-text animate-smoothColor bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#f472b6] drop-shadow-lg">
          Technologies Web.
        </span>
      </h1>
      <p class="text-lg md:text-xl text-gray-300 tracking-wide">
        Plongez dans des articles captivants, découvrez les dernières tendances, outils, et pratiques en programmation web.
      </p>
      <div class="flex space-x-4">
        <button class="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-transform">
          Commencer
        </button>
        <button class="px-6 py-3 border border-purple-500 text-purple-400 font-bold rounded-lg hover:bg-purple-500 hover:text-white transition">
          En savoir plus
        </button>
      </div>
    </div>

    <!-- Visual/Illustration -->
    <div class="hidden md:block relative z-0" data-aos="fade-left">
      <div class="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-xl animate-pulseSlow relative">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-transparent rounded-full blur-2xl opacity-40"></div>
        <div class="absolute inset-0 bg-white opacity-10 rounded-full blur-[90px]"></div>
      </div>
    </div>

    <!-- Particles -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-pulse top-[25%] left-[30%]"></div>
      <div class="absolute w-5 h-5 bg-indigo-500 rounded-full opacity-30 animate-ping bottom-[25%] right-[20%]"></div>
      <div class="absolute w-2 h-2 bg-gray-100 rounded-full opacity-60 animate-pulse bottom-[18%] left-[15%]"></div>
      <div class="absolute w-4 h-4 bg-pink-400 rounded-full opacity-50 animate-ping bottom-[10%] left-[50%]"></div>
    </div>
  </section>
</template>

<style scoped>
/* Smooth LED-like gradient */
@keyframes smoothColor {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.animate-smoothColor {
  background-size: 200% 200%;
  animation: smoothColor 6s infinite linear;
}

/* Pulse for Illustration */
.animate-pulseSlow {
  animation: pulseSlow 10s infinite alternate;
}
@keyframes pulseSlow {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(1.05);
    opacity: 0.9;
  }
}
</style>
<script setup lang="ts">
</script>