<template>
  <div class="flex min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <DashboardHeader title="Modifier l'article" />

      <!-- Main Section -->
      <main class="p-6 space-y-6">
        <div v-if="loading" class="text-center py-6">
          <p class="text-gray-400">Chargement...</p>
        </div>
        <div v-else>
          <form @submit.prevent="handleUpdate">
            <div class="space-y-4">
              <label class="block">
                <span class="text-gray-300">Titre</span>
                <input
                    v-model="article.title"
                    type="text"
                    class="mt-1 block w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
                    required
                />
              </label>

              <label class="block">
                <span class="text-gray-300">Contenu (Markdown supporté)</span>
                <textarea
                    v-model="article.content"
                    class="mt-1 block w-full h-60 bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
                    required
                ></textarea>
              </label>

              <label class="block">
                <span class="text-gray-300">Statut</span>
                <select
                    v-model="article.status"
                    class="mt-1 block w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
                >
                  <option value="under_review">En revue</option>
                  <option value="public">Publié</option>
                  <option value="draft">Brouillon</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </label>
            </div>

            <div class="mt-6 flex justify-end space-x-4">
              <button
                  type="button"
                  @click="goBack"
                  class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Annuler
              </button>
              <button
                  type="submit"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "../components/Dashboard/Sidebar.vue";
import DashboardHeader from "../components/Dashboard/DashboardHeader.vue";
import { useToast } from "../composables/Toast";
import { getArticleById, updateArticle } from "../api/admin";

const { success, error } = useToast();
const route = useRoute();
const router = useRouter();

const article = ref({
  id: 0,
  title: "",
  content: "",
  status: "draft",
});

const loading = ref(false);

const fetchArticle = async () => {
  try {
    loading.value = true;
    const response = await getArticleById(Number(route.params.id));
    article.value = response;
  } catch (err) {
    error("Erreur lors du chargement de l'article.");
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleUpdate = async () => {
  try {
    await updateArticle(article.value);
    success("Article mis à jour avec succès !");
    router.push("/admin/articles");
  } catch (err) {
    error("Erreur lors de la mise à jour de l'article.");
    console.error(err);
  }
};

const goBack = () => {
  router.push("/admin/articles");
};

onMounted(fetchArticle);
</script>
