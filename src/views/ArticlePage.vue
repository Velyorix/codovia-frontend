<template>
  <div class="bg-background text-grayLight min-h-screen">
    <HeaderComponent />

    <!-- Loading/Error -->
    <div v-if="loading" class="text-center py-36 text-primary text-xl animate-pulse">
      Chargement de l'article...
    </div>
    <div v-else-if="error" class="text-center py-56 text-red-500 text-lg">
      {{ error }}
    </div>

    <!-- Article Content -->
    <div v-else class="container mx-auto px-6 md:px-12 lg:px-16 py-12 space-y-16">
      <!-- Article Introduction -->
      <ArticleIntro :article="article" />

      <!-- Article Content -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-8 lg:p-12">
        <ArticleContent :content="article.content" />
      </div>

      <!-- Comments Section -->
      <section class="bg-gray-800 rounded-lg shadow-lg p-8 lg:p-12">
        <ArticleComments :articleId="article.id" />
      </section>
    </div>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import HeaderComponent from "../components/HeaderComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";
import ArticleIntro from "../components/Articles/ArticleIntro.vue";
import ArticleContent from "../components/Articles/ArticleContent.vue";
import ArticleComments from "../components/Articles/ArticleComments.vue";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();

const article = ref(null);
const loading = ref(true);
const error = ref("");

const fetchArticle = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    if (!response.ok) throw new Error("Article introuvable.");
    article.value = await response.json();
  } catch (err) {
    error.value = err.message || "Erreur lors du chargement de l'article.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const id = route.params.id;
  fetchArticle(id);
});
</script>
