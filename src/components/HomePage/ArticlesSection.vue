<template>
  <section class="py-20 bg-gradient-to-br from-[#0d0f18] via-[#131520] to-[#0a0b10] relative">
    <div class="container mx-auto text-center">
      <h2 class="text-4xl font-extrabold text-textPrimary mb-6" data-aos="fade-up">
        Articles <span class="text-primary">Populaires</span>
      </h2>
      <p class="text-grayLight max-w-2xl mx-auto mb-12 text-sm md:text-base" data-aos="fade-up" data-aos-delay="100">
        Voici une sélection des articles les plus consultés par nos lecteurs.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="200">
        <div
            v-for="article in articles"
            :key="article.id"
            class="relative bg-[#232635] p-6 rounded-xl shadow-lg hover:shadow-primary/50 transform hover:-translate-y-2 transition-all duration-300"
        >
          <div class="relative overflow-hidden rounded-lg mb-4">
            <img :src="article.image" alt="Article Image" class="w-full h-48 object-cover rounded-lg hover:scale-105 transform transition-transform" />
          </div>
          <div class="text-left">
            <h3 class="text-xl font-bold text-textPrimary mb-2">{{ article.title }}</h3>
            <p class="text-grayLight text-sm mb-4">{{ article.summary }}</p>
            <button class="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-textPrimary font-semibold rounded-lg hover:shadow-lg transition">
              Lire l'article →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative Blurs -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute w-72 h-72 bg-primary rounded-full blur-3xl opacity-20 -top-16 left-12"></div>
      <div class="absolute w-80 h-80 bg-secondary rounded-full blur-3xl opacity-10 -bottom-20 right-20"></div>
    </div>
  </section>
</template>

<script setup>
const articles = [
  { id: 1, title: 'Les bases de Vue.js', summary: 'Apprenez les fondamentaux de Vue.js.', image: 'https://placehold.co/300x200?text=Vue.js' },
  { id: 2, title: 'Introduction à TailwindCSS', summary: 'Un framework CSS moderne.', image: 'https://placehold.co/300x200?text=Tailwind' },
  { id: 3, title: 'L’histoire d’Internet', summary: 'Explorez l’évolution du web.', image: 'https://placehold.co/300x200?text=Internet' },
];
</script>
