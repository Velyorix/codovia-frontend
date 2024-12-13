<template>
  <div class="flex min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <DashboardHeader title="Gestion des Articles" />

      <!-- Main Section -->
      <main class="p-6 space-y-6">
        <div v-if="loading" class="text-center py-6">
          <p class="text-gray-400">Chargement...</p>
        </div>
        <div v-else-if="articles.length === 0" class="text-center py-6">
          <p class="text-gray-400">Aucun article trouvé.</p>
        </div>
        <div v-else>
          <!-- Articles Table -->
          <table class="w-full table-auto text-left bg-gray-800 rounded-lg overflow-hidden">
            <thead class="bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-sm font-semibold text-gray-300">Titre</th>
              <th class="px-6 py-3 text-sm font-semibold text-gray-300">Auteur</th>
              <th class="px-6 py-3 text-sm font-semibold text-gray-300">Statut</th>
              <th class="px-6 py-3 text-sm font-semibold text-gray-300">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="article in articles"
                :key="article.id"
                class="hover:bg-gray-700"
            >
              <td class="px-6 py-4 text-sm text-gray-200">{{ article.title }}</td>
              <td class="px-6 py-4 text-sm text-gray-400">{{ article.user.name }}</td>
              <td class="px-6 py-4 text-sm">
                <select
                    v-model="article.status"
                    @change="updateArticleStatus(article.id, article.status)"
                    class="bg-gray-600 text-white rounded-md px-2 py-1"
                >
                  <option value="under_review">En revue</option>
                  <option value="public">Publié</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </td>
              <td class="px-6 py-4 text-sm space-x-2">
                <button
                    @click="navigateToEditPage(article.id)"
                    class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-400"
                >
                  Modifier
                </button>
                <button
                    @click="deleteArticle(article.id)"
                    class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-400"
                >
                  Supprimer
                </button>
              </td>
            </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="flex justify-center mt-4 space-x-2">
            <button
                v-for="page in totalPages"
                :key="page"
                @click="fetchArticles(page)"
                class="px-4 py-2 rounded-lg"
                :class="{
                'bg-purple-600 text-white': page === currentPage,
                'bg-gray-700 text-gray-300 hover:bg-gray-600': page !== currentPage,
              }"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "../components/Dashboard/Sidebar.vue";
import DashboardHeader from "../components/Dashboard/DashboardHeader.vue";
import { useToast } from "../composables/Toast";
import { getArticles, updateArticleStatus, deleteArticle } from "../api/admin";

const { success, error } = useToast();
const router = useRouter();

const articles = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(0);

const fetchArticles = async (page = 1) => {
  try {
    loading.value = true;
    currentPage.value = page;

    const response = await getArticles(page);
    articles.value = response.data.filter(
        (article) => article.title && article.user && article.status
    );
    totalPages.value = response.meta.last_page;
  } catch (err) {
    error("Erreur lors du chargement des articles.");
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const updateArticleStatus = async (id, status) => {
  try {
    await updateArticleStatus(id, status);
    success("Statut mis à jour avec succès !");
  } catch (err) {
    error("Erreur lors de la mise à jour du statut.");
    console.error(err);
  }
};

const deleteArticle = async (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
    try {
      await deleteArticle(id);
      articles.value = articles.value.filter((article) => article.id !== id);
      success("Article supprimé avec succès !");
    } catch (err) {
      error("Erreur lors de la suppression de l'article.");
      console.error(err);
    }
  }
};

const navigateToEditPage = (id) => {
  router.push(`/admin/articles/${id}/edit`);
};

onMounted(() => {
  fetchArticles();
});
</script>
