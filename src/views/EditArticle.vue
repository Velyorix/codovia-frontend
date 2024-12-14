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
              <!-- Titre -->
              <label class="block">
                <span class="text-gray-300">Titre</span>
                <input
                    v-model="article.title"
                    type="text"
                    class="mt-1 block w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
                    required
                />
              </label>

              <!-- Contenu -->
              <label class="block">
                <span class="text-gray-300">Contenu (Markdown supporté)</span>
                <textarea
                    v-model="article.content"
                    class="mt-1 block w-full h-60 bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
                    required
                ></textarea>
              </label>

              <!-- Catégorie -->
              <label class="block">
                <span class="text-gray-300">Catégorie</span>
                <select
                    v-model="article.category_id"
                    class="mt-1 block w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
                >
                  <option value="" disabled>-- Sélectionner une catégorie --</option>
                  <template v-for="category in hierarchicalCategories" :key="category.id">
                    <option :value="category.id">{{ category.name }}</option>
                    <option
                        v-for="subCategory in category.subcategories"
                        :key="subCategory.id"
                        :value="subCategory.id"
                    >
                      -- {{ subCategory.name }}
                    </option>
                  </template>
                </select>
              </label>

              <!-- Tags -->
              <label class="block">
                <span class="text-gray-300">Tags</span>
                <div class="flex flex-wrap gap-2 mt-2">
                  <!-- Afficher tous les tags disponibles -->
                  <button
                      v-for="tag in availableTags"
                      :key="tag.id"
                      @click.prevent="toggleTag(tag.id)"
                      class="px-4 py-2 rounded-lg"
                      :class="{
                      'bg-green-500 text-white': article.tags.includes(tag.id), // Tag relié
                      'bg-gray-700 text-gray-300 hover:bg-gray-600': !article.tags.includes(tag.id), // Tag non relié
                    }"
                  >
                    {{ tag.name }}
                  </button>
                </div>
              </label>

              <!-- Statut -->
              <label class="block">
                <span class="text-gray-300">Statut</span>
                <select
                    v-model="article.status"
                    class="mt-1 block w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
                >
                  <option value="under_review">En revue</option>
                  <option value="public">Publié</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </label>
            </div>

            <!-- Erreur -->
            <div v-if="errorMessage" class="text-red-500 mt-4">
              {{ errorMessage }}
            </div>

            <!-- Boutons -->
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
import { getTags, getArticleById, getCategories, updateArticle } from "../api/admin";

const { success, error } = useToast();
const route = useRoute();
const router = useRouter();

const article = ref({
  id: 0,
  title: "",
  content: "",
  status: "draft",
  category_id: null,
  tags: [], // Tags liés à l'article
});

const availableTags = ref([]); // Tous les tags disponibles
const categories = ref([]);
const hierarchicalCategories = ref([]);
const loading = ref(false);
const errorMessage = ref("");

// Récupérer les tags disponibles
const fetchTags = async () => {
  try {
    const response = await getTags();
    availableTags.value = response.data; // Récupérer tous les tags
  } catch (err) {
    error("Erreur lors de la récupération des tags.");
    console.error(err);
  }
};

// Récupérer les catégories
const fetchCategories = async () => {
  try {
    const response = await getCategories();
    categories.value = response.data;

    hierarchicalCategories.value = categories.value.filter(
        (category) => !category.parent_id
    );
  } catch (err) {
    error("Erreur lors de la récupération des catégories.");
    console.error(err);
  }
};

// Récupérer les détails de l'article
const fetchArticle = async () => {
  try {
    loading.value = true;
    const response = await getArticleById(Number(route.params.id));
    if (!response || !response.id) {
      error("Article introuvable.");
      router.push("/admin/articles");
      return;
    }
    article.value = {
      ...response,
      tags: response.tags ? response.tags.map((tag) => tag.id) : [], // Mapper les tags liés
    };
  } catch (err) {
    error("Erreur lors du chargement de l'article.");
    console.error(err);
    router.push("/admin/articles");
  } finally {
    loading.value = false;
  }
};

// Ajouter ou retirer un tag
const toggleTag = (tagId: number) => {
  if (article.value.tags.includes(tagId)) {
    article.value.tags = article.value.tags.filter((id) => id !== tagId);
  } else {
    article.value.tags.push(tagId);
  }
};

// Mettre à jour l'article
const handleUpdate = async () => {
  if (!article.value.title.trim() || !article.value.content.trim()) {
    errorMessage.value = "Veuillez remplir tous les champs obligatoires.";
    return;
  }

  try {
    errorMessage.value = "";
    await updateArticle({
      id: article.value.id,
      title: article.value.title.trim(),
      content: article.value.content.trim(),
      status: article.value.status,
      category_id: article.value.category_id || null,
      tags: article.value.tags,
    });

    success("Article mis à jour avec succès !");
    router.push("/admin/articles");
  } catch (err: any) {
    console.error("Erreur lors de la mise à jour de l'article :", err);
    errorMessage.value = err?.message || "Erreur inattendue.";
  }
};

const goBack = () => {
  router.push("/admin/articles");
};

onMounted(() => {
  fetchTags();
  fetchCategories();
  fetchArticle();
});
</script>
