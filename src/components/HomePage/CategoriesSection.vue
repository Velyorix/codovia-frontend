<template>
  <section class="py-20 bg-gradient-to-br from-[#0d0f18] via-[#131520] to-[#0a0b10] relative">
    <div class="container mx-auto text-center">
      <h2 class="text-4xl font-extrabold text-textPrimary mb-6" data-aos="fade-up">
        Explorez nos <span class="text-primary">Catégories</span>
      </h2>
      <p class="text-grayLight max-w-2xl mx-auto mb-12 text-sm md:text-base" data-aos="fade-up" data-aos-delay="100">
        Découvrez des sujets passionnants regroupés par catégories. Chaque domaine est conçu pour enrichir vos connaissances.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" data-aos="fade-up" data-aos-delay="200">
        <div
            v-for="category in categories"
            :key="category.id"
            class="relative bg-[#232635] p-6 rounded-xl shadow-lg hover:shadow-primary/40 hover:translate-y-[-5px] transform transition-all duration-300"
        >
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center rounded-full mb-4">
              <img :src="category.icon" alt="Icône catégorie" class="w-10 h-10" />
            </div>
            <h3 class="text-xl font-bold text-textPrimary mb-2">{{ category.name }}</h3>
            <p class="text-grayLight text-sm text-center">{{ category.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative Blurs -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute w-64 h-64 bg-primary rounded-full blur-3xl opacity-20 -top-20 left-10"></div>
      <div class="absolute w-72 h-72 bg-secondary rounded-full blur-3xl opacity-10 -bottom-20 right-10"></div>
    </div>
  </section>
</template>

<script setup>
const categories = [
  { id: 1, name: 'Technologie', description: 'Les dernières innovations.', icon: 'https://placehold.co/40x40?text=T' },
  { id: 2, name: 'Sciences', description: 'Explorez les mystères du savoir.', icon: 'https://placehold.co/40x40?text=S' },
  { id: 3, name: 'Histoire', description: 'Voyagez à travers le temps.', icon: 'https://placehold.co/40x40?text=H' },
  { id: 4, name: 'Art & Culture', description: 'Laissez libre cours à votre imagination.', icon: 'https://placehold.co/40x40?text=A' },
];
</script>
