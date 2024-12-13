<template>
  <div class="flex min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <DashboardHeader title="Dashboard Admin" />

      <!-- Main Section -->
      <main class="p-6 space-y-6">
        <!-- Stats Section -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Utilisateurs" :value="stats.total_users" icon="users" />
          <StatsCard title="Articles" :value="stats.total_articles" icon="newspaper" />
          <StatsCard title="Catégories" :value="stats.total_category" icon="folder" />
          <StatsCard title="Tags" :value="stats.total_tags" icon="tag" />
        </div>

        <section class="space-y-6">
          <h2 class="text-xl font-bold text-gray-300">Articles en cours de revue</h2>
          <div v-if="loading" class="text-center py-6">
            <p class="text-gray-400">Chargement...</p>
          </div>
          <div v-else-if="paginatedArticles.length === 0" class="text-center py-6">
            <p class="text-gray-400">Aucun article en cours de revue.</p>
          </div>
          <div v-else class="space-y-4">
            <ReviewCard
                v-for="article in paginatedArticles"
                :key="article.id"
                :article="article"
                @approve="handleApprove"
                @reject="handleReject"
                @read="openArticleModal"
            />
            <!-- Pagination -->
            <div class="flex justify-center mt-4">
              <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  class="px-4 py-2 mx-1 rounded-lg"
                  :class="{
                  'bg-purple-600 text-white': page === currentPage,
                  'bg-gray-700 text-gray-300 hover:bg-gray-600': page !== currentPage,
                }"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>

    <Modal
        v-if="modalVisible"
        :visible="modalVisible"
        title="Lecture de l'article"
        @close="closeArticleModal"
    >
      <ArticleContent :content="selectedArticle.content" />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import {
  getAdminStats,
  getArticlesUnderReview,
  acceptArticle,
  rejectArticle,
} from "../api/admin";
import Sidebar from "../components/Dashboard/Sidebar.vue";
import DashboardHeader from "../components/Dashboard/DashboardHeader.vue";
import StatsCard from "../components/Dashboard/StatsCard.vue";
import ReviewCard from "../components/Dashboard/ReviewCard.vue";
import Modal from "../components/Dashboard/Modal.vue";
import ArticleContent from "../components/Articles/ArticleContent.vue";
import { useToast } from "../composables/Toast";

const { success, error } = useToast();

const stats = ref({
  total_users: 0,
  total_articles: 0,
  total_category: 0,
  total_tags: 0,
});
const articlesUnderReview = ref([]);
const loading = ref(true);

const modalVisible = ref(false);
const selectedArticle = ref(null);

const currentPage = ref(1);
const itemsPerPage = 3;

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return articlesUnderReview.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(articlesUnderReview.value.length / itemsPerPage));

const fetchData = async () => {
  try {
    loading.value = true;
    stats.value = await getAdminStats();
    articlesUnderReview.value = await getArticlesUnderReview();
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  } finally {
    loading.value = false;
  }
};

const openArticleModal = (article) => {
  selectedArticle.value = article;
  modalVisible.value = true;
};

const closeArticleModal = () => {
  modalVisible.value = false;
  selectedArticle.value = null;
};

const handleApprove = async (id) => {
  try {
    const message = await acceptArticle(id);
    success(message);
    articlesUnderReview.value = articlesUnderReview.value.filter(
        (article) => article.id !== id
    );
    if (paginatedArticles.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    console.error("Erreur d'approbation :", error);
    error("Erreur d'approbation.");
  }
};

const handleReject = async ({ id, reason }) => {
  try {
    const message = await rejectArticle(id, reason);
    success(message);
    articlesUnderReview.value = articlesUnderReview.value.filter(
        (article) => article.id !== id
    );
  } catch (error) {
    console.error("Erreur lors du refus :", error);
    error(error.message || "Une erreur est survenue.");
  }
};

onMounted(fetchData);
</script>
