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
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-300">Liste des Articles</h2>
          <button
              @click="navigateToCreatePage"
              class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Créer un article
          </button>
        </div>

        <!-- Loader -->
        <div v-if="loading" class="text-center py-6">
          <p class="text-gray-400">Chargement...</p>
        </div>

        <!-- No Articles Found -->
        <div v-else-if="articles.length === 0" class="text-center py-6">
          <p class="text-gray-400">Aucun article trouvé.</p>
        </div>

        <!-- Articles Table -->
        <div v-else>
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
              <td class="px-6 py-4 text-sm text-gray-400">{{ article.user?.name || 'Inconnu' }}</td>
              <td class="px-6 py-4 text-sm capitalize">{{ article.status }}</td>
              <td class="px-6 py-4 text-sm space-x-2">
                <button
                    @click="navigateToEditPage(article.id)"
                    class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-400"
                >
                  Modifier
                </button>
                <button
                    @click="deleteArticleHandler(article.id)"
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
                v-for="link in paginationLinks"
                :key="link.label"
                @click="fetchArticlesByUrl(link.url)"
                class="px-4 py-2 rounded-lg"
                :class="{
                'bg-purple-600 text-white': link.active,
                'bg-gray-700 text-gray-300 hover:bg-gray-600': !link.active,
              }"
                :disabled="!link.url"
            >
              {{ link.label }}
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
import { getAllArticles, deleteArticle } from "../api/admin";

const { success, error } = useToast();
const router = useRouter();

const articles = ref([]); // Liste des articles
const loading = ref(false); // Indicateur de chargement
const paginationLinks = ref([]); // Liens de pagination

const fetchArticles = async (pageUrl = null) => {
  try {
    loading.value = true;

    // Appel API
    const result = pageUrl
        ? await fetch(pageUrl).then((res) => res.json())
        : await getAllArticles();

    console.log("API Response:", result);

    // Vérification de la structure des données
    if (result.data && result.data.data && Array.isArray(result.data.data)) {
      articles.value = result.data.data; // Mettre à jour les articles
      paginationLinks.value = result.data.links?.map((link) => ({
        ...link,
        url: link.url || null,
        label: link.label.replace("&laquo;", "«").replace("&raquo;", "»"),
      }));
    } else {
      throw new Error("Structure inattendue des données.");
    }

    console.log("Articles chargés :", articles.value); // Debugging
  } catch (err) {
    error("Erreur lors du chargement des articles.");
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const deleteArticleHandler = async (id) => {
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

const navigateToCreatePage = () => {
  router.push(`/admin/articles/create`);
};

const fetchArticlesByUrl = async (url) => {
  if (url) {
    await fetchArticles(url);
  }
};

onMounted(() => {
  fetchArticles();
});
</script>
