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
          <div v-else-if="articlesUnderReview.length === 0" class="text-center py-6">
            <p class="text-gray-400">Aucun article en cours de revue.</p>
          </div>
          <div v-else class="space-y-4">
            <ReviewCard
                v-for="article in articlesUnderReview"
                :key="article.id"
                :article="article"
                @approve="approveArticle"
                @reject="rejectArticle"
                @read="openArticleModal"
            />
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
import { ref, onMounted } from "vue";
import {
  getAdminStats,
  getArticlesUnderReview,
  updateArticleStatus,
  removeArticle,
} from "../api/admin";
import Sidebar from "../components/Dashboard/Sidebar.vue";
import DashboardHeader from "../components/Dashboard/DashboardHeader.vue";
import StatsCard from "../components/Dashboard/StatsCard.vue";
import ReviewCard from "../components/Dashboard/ReviewCard.vue";
import Modal from "../components/Dashboard/Modal.vue";
import ArticleContent from "../components/Articles/ArticleContent.vue";

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

const openArticleModal = (article) => {
  selectedArticle.value = article;
  modalVisible.value = true;
};

const closeArticleModal = () => {
  modalVisible.value = false;
  selectedArticle.value = null;
};

const fetchData = async () => {
  try {
    loading.value = true;

    const statsData = await getAdminStats();
    stats.value = statsData;

    const articles = await getArticlesUnderReview();
    console.log("Articles récupérés :", articles);

    articlesUnderReview.value = articles.filter((article) => {
      return article?.id && article?.title && article?.user?.name && article?.created_at;
    });
    console.log("Articles valides récupérés :", articlesUnderReview.value);
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    articlesUnderReview.value = [];
  } finally {
    loading.value = false;
  }
};

const approveArticle = async (id: number) => {
  try {
    await updateArticleStatus(id, "public");
    articlesUnderReview.value = articlesUnderReview.value.filter(
        (article) => article.id !== id
    );
  } catch (error) {
    console.error("Erreur lors de l'approbation de l'article:", error);
  }
};

const rejectArticle = async (id: number) => {
  try {
    await removeArticle(id);
    articlesUnderReview.value = articlesUnderReview.value.filter(
        (article) => article.id !== id
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error);
  }
};

onMounted(fetchData);
</script>


<style>
.bg-gradient-to-b {
  background: linear-gradient(to bottom, #1e1e2f, #141428);
}

.bg-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 8px;
}

.text-primary {
  color: #8b5cf6;
}

.text-secondary {
  color: #34d399;
}

</style>
