<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <HeaderComponent />
      <!-- Bannière utilisateur -->
      <div class="bg-gradient-to-r from-primary to-secondary p-8 mb-8">
        <div class="container mx-auto py-16 flex flex-col items-center">
          <img
              :src="user?.avatar_url || defaultAvatar"
              alt="Avatar"
              class="w-32 h-32 rounded-full border-4 border-white shadow-md"
          />
          <h1 class="text-4xl font-bold text-white mt-4">{{ name }}</h1>
          <p class="text-gray-100 mt-2">
            {{ bio || "Ajoutez une biographie dans vos paramètres." }}
          </p>
        </div>
      </div>

      <!-- Contenu principal -->
      <main class="container mx-auto py-12 px-4">
        <div class="bg-gray-800 rounded-lg shadow-lg p-8">
          <!-- Onglets de navigation -->
          <div class="flex border-b border-gray-700 pb-4 space-x-8">
            <button
                v-for="tab in tabs"
                :key="tab"
                @click="activeTab = tab"
                :class="{
                'text-primary border-primary border-b-2': activeTab === tab,
                'text-gray-400': activeTab !== tab,
              }"
                class="px-4 py-2"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Onglet Profil -->
          <div v-if="activeTab === 'Profil'" class="mt-6">
            <h2 class="text-2xl font-bold text-primary mb-4">Informations personnelles</h2>
            <form @submit.prevent="updateProfile" class="space-y-4">
              <div>
                <label class="block text-gray-400">Nom d'utilisateur</label>
                <input
                    v-model="name"
                    type="text"
                    class="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label class="block text-gray-400">Adresse e-mail</label>
                <input
                    v-model="email"
                    type="email"
                    class="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label class="block text-gray-400">Biographie</label>
                <textarea
                    v-model="bio"
                    rows="3"
                    class="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
              <button
                  type="submit"
                  class="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-bold"
              >
                Enregistrer les modifications
              </button>
            </form>
          </div>

          <!-- Onglet Articles -->
          <div v-if="activeTab === 'Articles'" class="mt-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-primary">Vos articles publiés</h2>
              <!-- Sélecteur de style d'affichage -->
              <select
                  v-model="displayMode"
                  class="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="default">Par défaut</option>
                <option value="compact">Compact</option>
                <option value="large">Grand</option>
                <option value="list">Liste</option>
                <option value="card">Carte avec image</option>
              </select>
            </div>

            <!-- Articles -->
            <div v-if="paginatedArticles.length" :class="gridClass">
              <div
                  v-for="article in paginatedArticles"
                  :key="article.id"
                  :class="cardClass"
              >
                <template v-if="displayMode === 'card'">
                  <img
                      src="https://via.placeholder.com/150"
                      alt="Image d'article"
                      class="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div class="p-4">
                    <h3 class="text-lg font-bold text-primary">{{ article.title }}</h3>
                    <p class="text-sm text-gray-400 mt-2">
                      {{ article.content.slice(0, 100) }}...
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      Publié le {{ formatDate(article.created_at) }}
                    </p>
                  </div>
                </template>
                <template v-else>
                  <h3 class="text-lg font-bold text-primary">{{ article.title }}</h3>
                  <div
                      class="text-sm text-gray-400 mt-2 markdown-body"
                      v-html="renderMarkdown(article.content.slice(0, 200))"
                  ></div>
                  <p class="text-xs text-gray-500 mt-1">
                    Publié le {{ formatDate(article.created_at) }}
                  </p>
                </template>
              </div>
            </div>
            <p v-else class="text-gray-400">Vous n'avez publié aucun article.</p>

            <!-- Pagination -->
            <div class="flex justify-center mt-6 space-x-4">
              <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="{
                  'bg-primary text-white': currentPage === page,
                  'bg-gray-700 text-gray-400': currentPage !== page,
                }"
                  class="px-4 py-2 rounded-lg"
              >
                {{ page }}
              </button>
            </div>
          </div>

          <!-- Onglet Paramètres -->
          <div v-if="activeTab === 'Paramètres'" class="mt-6">
            <h2 class="text-2xl font-bold text-primary mb-4">Paramètres du compte</h2>
            <p class="text-gray-400">Modifier votre mot de passe ou désactiver votre compte ici.</p>
          </div>
        </div>
      </main>

      <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import HeaderComponent from "../components/HeaderComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";
import markdown from "../plugins/markdown";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const activeTab = ref("Profil");
const tabs = ["Profil", "Articles", "Paramètres"];
const displayMode = ref("default");

const name = ref("");
const email = ref("");
const bio = ref("");
const articles = ref([]);
const currentPage = ref(1);
const itemsPerPage = 6;

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return articles.value.slice(start, start + itemsPerPage);
});
const totalPages = computed(() => Math.ceil(articles.value.length / itemsPerPage));

const gridClass = computed(() => {
  if (displayMode.value === "list") return "grid grid-cols-1";
  return displayMode.value === "compact" ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2 gap-6";
});
const cardClass = computed(() => {
  if (displayMode.value === "card") return "bg-gray-700 rounded-lg overflow-hidden";
  return displayMode.value === "large" ? "bg-gray-700 rounded-lg p-6" : "bg-gray-700 rounded-lg p-4";
});

const fetchPrivateProfile = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
    headers: {Authorization: `Bearer ${authStore.token}`},
  });
  const data = await response.json();
  name.value = data.user.name;
  email.value = data.user.email;
  bio.value = data.user.bio;
  articles.value = data.articles;
};

const formatDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

const renderMarkdown = (content) => markdown.render(content);

onMounted(() => {
  fetchPrivateProfile();
});
</script>

<style scoped>

button {
  min-width: 40px;
  text-align: center;
}
</style>
