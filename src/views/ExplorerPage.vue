<template>
  <div class="min-h-screen flex flex-col bg-gray-900 text-gray-200">
    <!-- Header -->
    <HeaderComponent />

    <!-- Contenu principal -->
    <main class="flex-grow container mx-auto px-4 py-32 space-y-8">
      <!-- Barre de recherche et filtres -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <!-- Barre de recherche -->
        <div class="relative w-full max-w-lg">
          <input
              v-model="searchQuery"
              @input="debouncedSearch"
              type="text"
              class="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="🔎 Rechercher un article..."
          />
          <font-awesome-icon
              icon="search"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>

        <!-- Filtres par catégories -->
        <div class="flex flex-wrap gap-4 items-center">
          <button
              v-for="category in categories"
              :key="category.id"
              @click="filterByCategory(category.id)"
              :class="[
              'px-4 py-2 rounded-lg font-semibold transition',
              activeCategory === category.id
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white',
            ]"
          >
            {{ category.name }}
          </button>
          <button
              v-if="activeCategory"
              @click="resetFilters"
              class="bg-red-500 text-white px-4 py-2 rounded-lg transition hover:bg-red-600"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Articles affichés -->
      <section>
        <!-- Chargement -->
        <div v-if="loading" class="text-center py-32">
          <p class="text-gray-400 text-lg">Chargement des articles...</p>
        </div>

        <!-- Aucun résultat -->
        <div v-else-if="articles.length === 0" class="text-center text-gray-400">
          Aucun article trouvé. Essayez un autre mot-clé ou filtre.
        </div>

        <!-- Liste des articles -->
        <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <article
              v-for="article in paginatedArticles"
              :key="article.id"
              class="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-700 overflow-hidden flex flex-col"
          >
            <!-- Catégorie -->
            <div
                v-if="article.category"
                class="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-md"
            >
              {{ article.category.name }}
            </div>

            <!-- Contenu principal -->
            <div class="p-9 flex-grow flex flex-col">
              <!-- Titre -->
              <h2 class="text-lg font-bold text-purple-400 line-clamp-2 mb-2">
                {{ article.title }}
              </h2>

              <!-- Extrait -->
              <p
                  class="text-gray-400 text-sm line-clamp-3 mb-4"
                  v-html="truncateMarkdown(article.content, 150)"
              ></p>
            </div>

            <!-- Tags -->
            <div v-if="article.tags && article.tags.length" class="px-6 pb-4">
              <span
                  v-for="tag in article.tags"
                  :key="tag"
                  class="inline-block bg-gray-700 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full mr-2 mb-2 hover:bg-purple-500 hover:text-white transition"
              >
                {{ tag.name }}
              </span>
            </div>

            <!-- Métadonnées -->
            <div class="px-6 pb-4 flex justify-between items-center text-sm text-gray-500">
              <span class="flex items-center gap-2">
                <font-awesome-icon icon="user" class="text-purple-400" />
                {{ article.user?.name || 'Anonyme' }}
              </span>
              <span class="flex items-center gap-2">
                <font-awesome-icon icon="calendar-alt" class="text-purple-400" />
                {{ formatDate(article.created_at) }}
              </span>
            </div>

            <!-- Note -->
            <div class="px-6 pb-4 flex justify-between items-center border-t border-gray-700">
              <div class="flex items-center gap-1">
                <font-awesome-icon
                    icon="star"
                    v-for="star in 5"
                    :key="star"
                    :class="{ 'text-yellow-400': star <= article.rating, 'text-gray-600': star > article.rating }"
                />
              </div>
              <span class="text-sm text-gray-400">
                {{ article.rating || '0' }}/5
              </span>
            </div>

            <!-- Bouton -->
            <a
                :href="`/articles/${article.id}`"
                class="block py-3 bg-gradient-to-r from-primary to-secondary text-textPrimary text-center font-semibold hover:opacity-90 transition"
            >
              Lire l'article →
            </a>
          </article>
        </div>
      </section>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center space-x-4 mt-8">
        <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
            'px-4 py-2 rounded-lg transition',
            currentPage === page
              ? 'bg-purple-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white',
          ]"
        >
          {{ page }}
        </button>
      </div>
    </main>

    <!-- Footer -->
    <FooterComponent />
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { debounce } from "lodash";
import HeaderComponent from "../components/HeaderComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";
import { marked } from "marked";

// États principaux
const articles = ref([]);
const originalArticles = ref([]);
const categories = ref([]);
const searchQuery = ref("");
const activeCategory = ref(null);
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = 6;

// Pagination
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return articles.value.slice(start, start + itemsPerPage);
});
const totalPages = computed(() => Math.ceil(articles.value.length / itemsPerPage));

// Charger les catégories
const fetchCategories = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`);
  categories.value = (await response.json()).data || [];
};

// Charger les articles
const fetchArticles = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles`);
    const data = await response.json();
    articles.value = data.data || [];
    originalArticles.value = data.data || [];
  } finally {
    loading.value = false;
  }
};

// Recherche
const searchArticles = debounce(async () => {
  if (!searchQuery.value.trim()) {
    articles.value = [...originalArticles.value];
    return;
  }
  const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/articles/search?query=${searchQuery.value}`
  );
  articles.value = (await response.json()).data || [];
}, 300);

// Helpers
const renderMarkdown = (markdown) => marked(markdown || "");
const truncateMarkdown = (markdown, maxLength) =>
    markdown?.length > maxLength ? `${markdown.slice(0, maxLength)}…` : markdown;
const formatDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

onMounted(() => {
  fetchCategories();
  fetchArticles();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>