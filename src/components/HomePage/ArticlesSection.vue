<template>
  <section class="py-20 bg-gradient-to-br from-[#0d0f18] via-[#131520] to-[#0a0b10] relative">
    <div class="container mx-auto text-center">
      <!-- Title -->
      <h2 class="text-4xl font-extrabold text-textPrimary mb-6" data-aos="fade-up">
        Articles <span class="text-primary">Populaires</span>
      </h2>
      <p class="text-grayLight max-w-2xl mx-auto mb-12 text-sm md:text-base" data-aos="fade-up" data-aos-delay="100">
        Voici une sélection des articles les plus consultés par nos lecteurs.
      </p>

      <!-- Loading -->
      <div v-if="loading" class="text-grayLight text-lg">Chargement des articles...</div>

      <!-- Error -->
      <div v-else-if="error" class="text-red-500 text-lg">{{ error }}</div>

      <!-- Articles Grid -->
      <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          data-aos="fade-up"
          data-aos-delay="200"
      >
        <article
            v-for="article in articles"
            :key="article.id"
            class="relative bg-[#232635] p-6 rounded-2xl shadow-lg hover:shadow-primary/50 transform hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
        >

          <div
              v-if="article.category"
              class="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
          >
            {{ article.category.name }}
          </div>

          <!-- Title -->
          <h3 class="text-xl font-bold text-textPrimary mb-3 line-clamp-2">
            {{ article.title }}
          </h3>

          <!-- Content (Markdown truncated) -->
          <p
              class="text-grayLight text-sm mb-5 line-clamp-3"
              v-html="renderMarkdown(truncateMarkdown(article.content, 125))"
          ></p>

          <!-- Categories & Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            <!-- Tags -->
            <span
                v-for="tag in article.tags"
                :key="tag"
                class="px-3 py-1 bg-white/10 text-gray-300 text-sm font-semibold rounded-full backdrop-blur-md shadow-inner"
            >
              {{ tag.name }}
            </span>
          </div>

          <!-- Metadata -->
          <div class="flex items-center justify-between text-gray-400 text-sm mb-4">
            <!-- Author -->
            <div class="flex items-center gap-2">
              <font-awesome-icon icon="user" class="text-primary"></font-awesome-icon>
              <span class="group-hover:text-white transition">{{ article.user?.name || 'Anonyme' }}</span>
            </div>
            <!-- Date -->
            <div class="flex items-center gap-2">
              <font-awesome-icon icon="calendar-alt" class="text-primary"></font-awesome-icon>
              <span class="group-hover:text-white transition">{{ formatDate(article.created_at) }}</span>
            </div>
          </div>

          <!-- Read Article Button -->
          <a
              :href="`/articles/${article.id}`"
              class="block px-4 py-2 bg-gradient-to-r from-primary to-secondary text-textPrimary font-semibold text-center rounded-lg hover:shadow-lg transition"
          >
            Lire l'article →
          </a>
        </article>
      </div>
    </div>

    <!-- Decorative Blurs -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute w-72 h-72 bg-primary rounded-full blur-3xl opacity-20 -top-16 left-12"></div>
      <div class="absolute w-80 h-80 bg-secondary rounded-full blur-3xl opacity-10 -bottom-20 right-20"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { marked } from 'marked';

// Récupération de la base URL depuis .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// États pour les articles, le chargement et les erreurs
const articles = ref([]);
const loading = ref(true);
const error = ref('');

// Fonction pour transformer Markdown en HTML
const renderMarkdown = (markdown) => marked(markdown || '');

// Fonction pour tronquer le Markdown proprement
const truncateMarkdown = (markdown, maxLength) => {
  if (!markdown) return '';

  let truncated = '';
  let charCount = 0;

  // Divise le Markdown en lignes
  const lines = markdown.split('\n');
  for (const line of lines) {
    if (charCount >= maxLength) break;

    // Ajoute une ligne si elle rentre dans la limite
    if (charCount + line.length <= maxLength) {
      truncated += line + '\n';
      charCount += line.length;
    } else {
      // Tronque la ligne restante
      const remaining = maxLength - charCount;
      truncated += line.slice(0, remaining) + '…';
      break;
    }
  }

  return truncated.trim();
};

// Fonction pour formater une date
const formatDate = (date) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

// Fonction pour récupérer les articles depuis l'API
const fetchArticles = async () => {
  try {
    loading.value = true; // Activer le chargement
    error.value = ''; // Réinitialiser l'erreur

    // Appel de l'API
    const response = await fetch(`${API_BASE_URL}/articles`);
    if (!response.ok) throw new Error('Impossible de récupérer les articles.');

    // Extraction des données
    const data = await response.json();
    articles.value = data.data; // Utilise la clé "data" du JSON de l'API
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue.';
  } finally {
    loading.value = false; // Désactiver le chargement
  }
};

// Charger les articles au montage du composant
onMounted(fetchArticles);
</script>


<style scoped>
/* Clamp for content preview */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
