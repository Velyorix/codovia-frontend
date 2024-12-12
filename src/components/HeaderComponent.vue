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
        <a href="/" class="text-textPrimary hover:text-primary transition">Accueil</a>
        <a href="/explorer" class="text-textPrimary hover:text-primary transition">Explorer</a>
        <a href="#" class="text-textPrimary hover:text-primary transition">À propos</a>
      </nav>

      <!-- Search Bar -->
      <div
          ref="searchBox"
          class="relative group ml-6 flex items-center"
          @mouseover="showSearch = true"
          @mouseleave="showSearch = false"
      >
        <!-- Bouton et Input de Recherche -->
        <span
            class="text-textPrimary cursor-pointer hover:text-primary transition text-xl"
            v-show="!showSearch"
        >
          🔍
        </span>
        <transition name="fade">
          <div
              v-if="showSearch"
              class="relative flex items-center gap-2"
          >
            <span class="text-xl text-primary"></span>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher..."
                class="rounded-lg bg-gray-700 text-textPrimary px-4 py-2 focus:ring-2 focus:ring-primary transition w-72"
                @input="performSearch"
            />
            <!-- Résultats -->
            <div
                v-if="results.length > 0"
                class="absolute top-12 left-0 w-80 bg-background rounded-lg shadow-md p-4 space-y-2 z-50"
            >
              <div
                  v-for="result in results"
                  :key="result.id"
                  class="cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition"
                  @click="navigateToArticle(result.id)"
              >
                <p class="font-bold">{{ result.title }}</p>
                <p class="text-sm text-gray-500">{{ result.category || "Non défini" }}</p>
              </div>
            </div>
            <div
                v-if="results.length === 0 && searchQuery"
                class="absolute top-12 left-0 w-80 bg-background rounded-lg shadow-md p-4 text-gray-500 text-sm"
            >
              Aucun résultat trouvé.
            </div>
          </div>
        </transition>
      </div>

      <!-- Auth Section -->
      <div class="hidden md:flex items-center space-x-4 ml-auto">
        <template v-if="isAuthenticated">
          <div class="relative group">
            <span class="text-gray-300 hover:text-primary cursor-pointer transition">🔔</span>
            <!-- Notifications Dropdown -->
            <div
                class="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-md p-4 w-64 hidden group-hover:block"
            >
              <p class="text-gray-400">Aucune notification.</p>
            </div>
          </div>
          <div class="relative group">
            <button
                class="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-full"
                @click="toggleDropdown"
            >
              <img
                  v-if="user?.avatar_url"
                  :src="user.avatar_url"
                  alt="Avatar"
                  class="w-8 h-8 rounded-full"
              />
              <span>{{ user?.name }}</span>
            </button>
            <!-- Profile Dropdown -->
            <div
                v-show="showDropdown"
                class="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-md p-4 w-48"
            >
              <a href="/profile" class="block py-2 px-4 text-textPrimary hover:bg-gray-700 rounded-lg">
                Profil
              </a>
              <button
                  class="block w-full text-left py-2 px-4 text-red-500 hover:bg-gray-700 rounded-lg"
                  @click="logout"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <a href="/login" class="text-gray-300 hover:text-primary transition">Connexion</a>
          <a
              href="/register"
              class="px-4 py-2 bg-primary text-white rounded-full shadow-md hover:shadow-lg transition"
          >
            Inscription
          </a>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <button class="md:hidden text-textPrimary" @click="toggleMenu">☰</button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { MeiliSearch } from "meilisearch";

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const scrolled = ref(false);
const searchQuery = ref("");
const results = ref([]);
const showSearch = ref(false);
const showDropdown = ref(false);

const client = new MeiliSearch({
  host: import.meta.env.VITE_MEILI_HOST,
  apiKey: import.meta.env.VITE_MEILI_API_KEY,
});

const updateScroll = () => {
  scrolled.value = window.scrollY > 10;
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    results.value = [];
    return;
  }
  const searchResults = await client.index("articles").search(searchQuery.value, { limit: 5 });
  results.value = searchResults.hits;
};

const navigateToArticle = (id) => {
  window.location.href = `/articles/${id}`;
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const logout = async () => {
  await authStore.logout();
};

onMounted(() => window.addEventListener("scroll", updateScroll));
onUnmounted(() => window.removeEventListener("scroll", updateScroll));
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
