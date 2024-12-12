<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <HeaderComponent />

    <!-- Bannière utilisateur -->
    <div class="bg-gradient-to-r from-primary to-secondary p-8">
      <div class="container mx-auto flex py-16 flex-col items-center">
        <img
            :src="user?.avatar_url || defaultAvatar"
            alt="Avatar"
            class="w-32 h-32 rounded-full border-4 border-white shadow-md"
        />
        <h1 class="text-4xl font-bold text-white mt-4">{{ user?.name }}</h1>

        <p class="text-lg text-gray-300 mt-2">
          {{ user?.role || "Utilisateur standard" }}
        </p>

        <p class="text-gray-100 mt-2">
          {{ user?.bio || "Cet utilisateur n'a pas encore écrit de biographie." }}
        </p>
        <p class="text-sm text-gray-200 mt-1">
          Inscrit le {{ formatDate(user?.created_at) }}
        </p>
      </div>
    </div>

    <main class="container mx-auto py-12 px-4">

      <!-- Statistiques utilisateur -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-8 space-y-6 mb-8">
        <h2 class="text-2xl font-semibold text-primary border-b border-gray-700 pb-2">
          <font-awesome-icon icon="chart-bar" class="text-primary mr-2" /> Statistiques utilisateur
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          <div class="bg-gray-700 rounded-lg p-6">
            <font-awesome-icon icon="file-alt" class="text-primary mr-2" />
            <h3 class="text-xl font-bold text-primary">Contributions</h3>
            <p class="text-2xl text-gray-100">{{ articles.length }}</p>
            <p class="text-sm text-gray-400">Articles publiés</p>
          </div>
          <div class="bg-gray-700 rounded-lg p-6">
            <font-awesome-icon icon="heart" class="text-primary mr-2" />
            <h3 class="text-xl font-bold text-primary">Favoris</h3>
            <p class="text-2xl text-gray-100">{{ favorites.length }}</p>
            <p class="text-sm text-gray-400">Articles ajoutés aux favoris</p>
          </div>
          <div class="bg-gray-700 rounded-lg p-6">
            <font-awesome-icon icon="clock" class="text-primary mr-2" />
            <h3 class="text-xl font-bold text-primary">{{ accountAgeTitle }}</h3>
            <p class="text-2xl text-gray-100">{{ accountAge }}</p>
            <p class="text-sm text-gray-400">Depuis l'inscription</p>
          </div>
        </div>
      </div>


      <div class="bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
        <section>
          <h2 class="text-2xl font-semibold text-primary border-b border-gray-700 pb-2">
            <font-awesome-icon icon="newspaper" class="text-primary mr-2" /> Articles publiés
          </h2>
          <div
              v-if="articles.length"
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
          >
            <div
                v-for="article in paginatedArticles"
                :key="article.id"
                class="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition cursor-pointer"
                @click="goToArticle(article.id)"
            >
              <h3 class="text-lg font-bold text-primary"><font-awesome-icon icon="file-alt" class="text-primary mr-2" />  {{ article.title }}</h3>
              <div
                  class="text-sm text-gray-400 mt-2 markdown-body"
                  v-html="renderMarkdown(article.content.slice(0, 200))"
              ></div>
              <p class="text-xs text-gray-500 mt-1">
                <font-awesome-icon icon="calendar-alt" class="mr-2"></font-awesome-icon> Publié le {{ formatDate(article.created_at) }}
              </p>
            </div>
          </div>
          <p v-else class="text-gray-400 mt-6">
            <font-awesome-icon icon="exclamation-circle" class="mr-2" /> Cet utilisateur n'a publié aucun article.
          </p>
        </section>

        <div class="flex justify-center mt-6 space-x-4" v-if="totalPages > 1">
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
    </main>

    <FooterComponent />
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from "vue";
import { useRoute } from "vue-router";
import HeaderComponent from "../components/HeaderComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";
import markdown from "../plugins/markdown";

const route = useRoute();
const user = ref(null);
const articles = ref([]);
const favorites = ref([]);

const currentPage = ref(1);
const itemsPerPage = 6;

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return articles.value.slice(start, start + itemsPerPage);
});
const totalPages = computed(() => Math.ceil(articles.value.length / itemsPerPage));

const defaultAvatar = "/images/default-avatar.png";

const fetchUserProfile = async () => {
  try {
    const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${route.params.username}`
    );
    if (!response.ok)
      throw new Error("Erreur lors de la récupération du profil public.");
    const data = await response.json();
    user.value = data.user;
    articles.value = data.articles;
    favorites.value = data.favorites || [];
  } catch (error) {
    console.error("Erreur :", error);
  }
};

const accountAge = computed(() => {
  if (!user.value?.created_at) return "";

  const createdDate = new Date(user.value.created_at);
  const now = new Date();

  let years = now.getFullYear() - createdDate.getFullYear();
  let months = now.getMonth() - createdDate.getMonth();
  let days = now.getDate() - createdDate.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += previousMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} an${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mois`);
  if (days > 0) parts.push(`${days} jour${days > 1 ? "s" : ""}`);

  return parts.join(", ");
});

const accountAgeTitle = computed(() => {
  const createdDate = new Date(user.value?.created_at);
  const now = new Date();

  const years = now.getFullYear() - createdDate.getFullYear();
  const months = years * 12 + now.getMonth() - createdDate.getMonth();

  if (months < 1) return "Jours d'existence";
  if (months < 12) return "Mois d'existence";
  return "Années d'existence";
});

const goToArticle = (id) => {
  window.location.href = `/articles/${id}`;
};

const formatDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

const renderMarkdown = (content) => markdown.render(content);

onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
/* Markdown styles appliqués */
.markdown-body {
  font-family: "Inter", sans-serif;
  line-height: 1.6;
  color: #d1d5db;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 150px;
}

/* Espacement pour le contenu */
.container {
  max-width: 1200px;
}
</style>
