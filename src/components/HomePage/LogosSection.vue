<template>
  <section class="relative py-20 bg-gradient-to-b from-background via-background/80 to-background">
    <!-- Section Container -->
    <div class="container mx-auto text-center">
      <!-- Title and Subtitle -->
      <div class="mb-16" data-aos="fade-up">
        <h2 class="text-4xl md:text-5xl font-extrabold text-textPrimary tracking-wide">
          Faites confiance aux leaders mondiaux
        </h2>
        <p class="text-grayLight max-w-2xl mx-auto mt-4 text-sm md:text-base">
          Des entreprises de renom adoptent nos solutions pour exceller dans l’innovation et la technologie.
        </p>
      </div>

      <!-- Logos Grid -->
      <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10"
          data-aos="fade-up"
          data-aos-delay="200"
      >
        <div
            v-for="logo in logos"
            :key="logo"
            class="flex justify-center items-center bg-glassBg p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-neon transition-all duration-300"
        >
          <img
              :src="logo"
              alt="Logo partenaire"
              class="w-24 md:w-32 lg:w-36 h-auto grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>
      </div>
    </div>

    <!-- Decorative Particles -->
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div
          class="absolute w-96 h-96 bg-primary rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse"
      ></div>
      <div
          class="absolute w-72 h-72 bg-secondary rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse"
      ></div>
    </div>
  </section>
</template>



<script setup>
const logos = [
  'https://placehold.co/120',
  'https://placehold.co/120',
  'https://placehold.co/120',
  'https://placehold.co/120',
];
</script>
