<template>
  <header
      class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/90 backdrop-blur-md shadow-lg rounded-full px-6 py-3 transition-all duration-300 flex items-center w-[90%] max-w-[1200px]"
      :class="{ 'shadow-glow': scrolled }"
  >
    <div class="flex justify-between items-center w-full">
      <!-- Logo -->
      <h1 class="text-xl font-extrabold text-primary flex items-center">
        <span class="w-4 h-4 bg-gradient-to-r from-primary to-secondary rounded-full mr-2"></span>
        Codovia
      </h1>

      <!-- Navigation -->
      <nav class="hidden md:flex space-x-6 items-center ml-6">
        <a href="#" class="text-textPrimary hover:text-primary transition">Articles</a>
        <a href="#" class="text-textPrimary hover:text-primary transition">Catégories</a>
        <a href="#" class="text-textPrimary hover:text-primary transition">À propos</a>
      </nav>

      <!-- Search Bar -->
      <div ref="searchBox" class="relative group ml-6 flex items-center">
        <button
            class="text-textPrimary hover:text-primary transition"
            @click="toggleSearch"
        >
          🔍
        </button>
        <transition name="fade">
          <div
              v-if="showSearch"
              class="absolute top-12 left-0 bg-glassBg p-4 rounded-lg shadow-lg w-[300px] md:w-[400px]"
          >
            <input
                type="text"
                placeholder="Rechercher des articles..."
                class="w-full bg-background text-textPrimary px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-primary transition"
                v-model="searchQuery"
                @input="performSearch"
                @keydown.escape="closeSearch"
            />
            <!-- Results -->
            <div class="mt-4 space-y-2" v-if="results.length">
              <div
                  v-for="result in results"
                  :key="result.id"
                  class="block bg-background hover:bg-primary/20 text-textPrimary p-2 rounded-lg transition cursor-pointer"
                  @click="navigateToArticle(result.id)"
              >
                <h3 class="font-semibold">{{ result.title }}</h3>
                <p class="text-sm text-gray-400">
                  Catégorie: {{ result.category || 'Non défini' }}
                </p>
                <div class="flex flex-wrap space-x-2">
                  <span
                      v-for="tag in result.tags"
                      :key="tag.id"
                      class="bg-primary/20 text-primary text-xs px-2 py-1 rounded"
                  >
                    {{ tag.name }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="!results.length && searchQuery" class="text-gray-400 text-sm mt-2">
              Aucun résultat trouvé.
            </div>
          </div>
        </transition>
      </div>

      <!-- Auth Section -->
      <div class="hidden md:flex items-center space-x-4 ml-auto">
        <a href="#" class="text-gray-300 hover:text-primary transition">Connexion</a>
        <button
            class="px-4 py-2 bg-primary text-textPrimary font-semibold rounded-full shadow-glow hover:shadow-xl transition"
        >
          Inscription
        </button>
      </div>

      <!-- Mobile Menu Button -->
      <button class="md:hidden text-textPrimary" @click="toggleMenu">☰</button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { onClickOutside } from "@vueuse/core";
import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: import.meta.env.VITE_MEILI_HOST,
  apiKey: import.meta.env.VITE_MEILI_API_KEY,
});

// States
const showSearch = ref(false);
const searchQuery = ref("");
const results = ref([]);
const searchBox = ref(null);

// Toggle search box visibility
const toggleSearch = () => {
  showSearch.value = true;
};

// Close search box
const closeSearch = () => {
  showSearch.value = false;
  searchQuery.value = "";
  results.value = [];
};

// Perform search query
const performSearch = async () => {
  if (searchQuery.value.trim() === "") {
    results.value = [];
    return;
  }

  try {
    const searchResults = await client.index("articles").search(searchQuery.value, {
      limit: 5, // Limit results
    });
    results.value = searchResults.hits;
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
  }
};

// Navigate to article
const navigateToArticle = (id) => {
  window.location.href = `/articles/${id}`;
};

// Close search when clicking outside
onClickOutside(searchBox, closeSearch);

// Scroll detection for shadow effects
const scrolled = ref(false);
const updateScroll = () => {
  scrolled.value = window.scrollY > 10;
};

onMounted(() => {
  window.addEventListener("scroll", updateScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateScroll);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

