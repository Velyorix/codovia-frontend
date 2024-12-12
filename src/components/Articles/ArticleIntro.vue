<template>
  <section
      class="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-12 md:py-20 px-8 text-grayLight rounded-lg shadow-lg overflow-hidden"
  >
    <!-- Decorative Background -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="w-96 h-96 bg-primary rounded-full blur-3xl opacity-10 absolute -top-16 -left-16"></div>
      <div class="w-80 h-80 bg-secondary rounded-full blur-3xl opacity-20 absolute bottom-10 right-10"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <!-- Left Section -->
      <div>
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="text-sm text-gray-400 mb-4">
          <ol class="flex space-x-2 items-center">
            <li>
              <a href="/" class="hover:text-primary">
                <font-awesome-icon :icon="['fas', 'house']" />
              </a>
            </li>
            <li>›</li>
            <li>
              <a href="/categories" class="hover:text-primary">Catégories</a>
            </li>
            <li>›</li>
            <li>
              <a :href="`/categories/${article.category_id}`" class="hover:text-primary">
                {{ article.category.name }}
              </a>
            </li>
            <li>›</li>
            <li>
              <span class="text-primary">{{ article.title }}</span>
            </li>
          </ol>
        </nav>

        <!-- Title and Meta -->
        <h1 class="text-4xl md:text-5xl font-extrabold text-primary mb-4">{{ article.title }}</h1>
        <p class="text-gray-300 text-sm">
          Publié le {{ formattedDate }} | Auteur :
          <span class="text-primary">{{ article.user?.name || "Anonyme" }}</span>
        </p>

        <!-- Tags -->
        <div v-if="article.tags.length" class="flex flex-wrap gap-2 mt-4">
          <span
              v-for="tag in article.tags"
              :key="tag.id"
              class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg"
          >
            #{{ tag.name }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2 mt-4">
          ⏱️ Temps estimé de lecture : <span class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg">{{ estimatedReadingTime }} min</span>
        </div>
      </div>

      <!-- Right Section -->
      <div class="flex flex-col items-start md:items-end space-y-6">
        <!-- Favorites Button -->
        <button
            @click="toggleFavorite"
            class="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2 transition-transform transform hover:scale-105"
        >
          <font-awesome-icon
              :icon="[isFavorited ? 'fas' : 'fa', 'heart']"
              class="text-lg"
          />
          {{ isFavorited ? 'Favori' : 'Ajouter' }}
        </button>

        <!-- Rating Section -->
        <div>
          <p class="text-gray-300 text-lg font-semibold mb-2">Évaluation :</p>
          <div class="flex items-center gap-2 text-xl">
            <!-- Stars -->
            <div class="flex items-center gap-1">
              <span
                  v-for="i in 5"
                  :key="i"
                  :class="i <= (hoveredRating || currentRating) ? 'text-yellow-400' : 'text-gray-500'"
                  @mouseover="hoverStars(i)"
                  @mouseleave="resetHover"
                  @click="rateArticle(i)"
                  class="cursor-pointer hover:scale-125 transition"
              >
                ★
              </span>
            </div>
            <!-- Average & Votes -->
            <span class="text-gray-400 text-sm">
              ({{ article.average_rating ? article.average_rating.toFixed(2) : '0.00' }} / 5,
              {{ article.votes || 0 }} votes)
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({
  article: { type: Object, default: () => ({}) },
  isFavorited: { type: Boolean, default: false }, // Check if the article is already favorited
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// State for rating
const currentRating = ref(props.article.average_rating || 0); // Fallback to 0
const hoveredRating = ref(0);

// Format date
const formattedDate = computed(() =>
    new Date(props.article.created_at).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
);

// Hover effect for stars
const hoverStars = (rating) => {
  hoveredRating.value = rating;
};
const resetHover = () => {
  hoveredRating.value = 0;
};

// Submit rating
const rateArticle = async (rating) => {
  try {
    await fetch(`${API_BASE_URL}/articles/${props.article.id}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });
    currentRating.value = rating; // Update the local rating after success
    alert("Merci pour votre évaluation !");
  } catch (error) {
    console.error("Erreur lors de l'évaluation de l'article :", error);
  }
};

// Toggle favorite
const toggleFavorite = async () => {
  try {
    const endpoint = isFavorited
        ? `${API_BASE_URL}/articles/${props.article.id}/favorite`
        : `${API_BASE_URL}/articles/${props.article.id}/favorite`;

    await fetch(endpoint, {
      method: isFavorited ? "DELETE" : "POST",
    });
    alert(isFavorited ? "Favori retiré." : "Ajouté aux favoris !");
  } catch (error) {
    console.error("Erreur lors de la gestion des favoris :", error);
  }
};

const estimatedReadingTime = computed(() => {
  const words = props.article.content.split(/\s+/).length;
  return Math.ceil(words / 200); // Résultat en minutes
});
</script>

<style scoped>
/* Background styles */
.relative .absolute {
  z-index: 0;
}

/* Star colors */
.text-yellow-400:hover {
  color: #facc15; /* Brighter yellow on hover */
}
.text-gray-500:hover {
  color: #facc15; /* Turn gray stars yellow on hover */
}
</style>
