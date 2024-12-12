<template>
  <div class="relative">
    <!-- Barre de progression -->
    <div :style="{ width: `${scrollProgress}%` }" class="progress-bar"></div>

    <!-- Article principal -->
    <section ref="articleWrapper" class="article-wrapper">
      <div class="article-content">
        <article v-html="renderedMarkdown" class="markdown-body"></article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import markdown from "../../plugins/markdown"; // Markdown parser configuré

// Props
const props = defineProps({
  content: { type: String, required: true },
});

// Markdown rendu
const renderedMarkdown = computed(() => markdown.render(props.content || ""));

// Barre de progression liée au contenu de l'article
const scrollProgress = ref(0);
const articleWrapper = ref<HTMLElement | null>(null);

const updateScrollProgress = () => {
  if (!articleWrapper.value) return;

  const articleTop = articleWrapper.value.offsetTop;
  const articleHeight = articleWrapper.value.offsetHeight;
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;

  if (scrollTop >= articleTop && scrollTop <= articleTop + articleHeight) {
    const scrolled = scrollTop - articleTop;
    const totalScrollable = articleHeight - windowHeight;
    scrollProgress.value = Math.min((scrolled / totalScrollable) * 100, 100);
  } else if (scrollTop < articleTop) {
    scrollProgress.value = 0;
  } else {
    scrollProgress.value = 100;
  }
};

onMounted(() => {
  window.addEventListener("scroll", updateScrollProgress);
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateScrollProgress);
});
</script>

<style lang="css">
/* Barre de progression */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #3b82f6);
  z-index: 50;
  transition: width 0.2s ease;
}

/* Wrapper */
.article-wrapper {
  background: linear-gradient(to bottom, #1e293b, #111827);
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  color: #e5e7eb;
  overflow: hidden;
}

/* Contenu principal */
.article-content {
  max-width: 850px;
  margin: 0 auto;
}

/* Markdown styles */
.markdown-body {
  font-family: "Inter", sans-serif;
  line-height: 1.9;
  color: #d1d5db;
  text-align: justify;
}

.markdown-body > *:not(:last-child) {
  margin-bottom: 2rem;
}

/* Titres */
.markdown-body h1 {
  font-size: 2.8rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1.5rem;
  border-bottom: 4px solid #4f46e5;
}

.markdown-body h2 {
  font-size: 2.4rem;
  font-weight: 700;
  color: #93c5fd;
  border-left: 6px solid #3b82f6;
  padding-left: 1rem;
  margin-top: 3rem;
}

/* Citations stylées */
.markdown-body blockquote {
  margin: 2rem 0;
  padding: 1rem 1.5rem;
  background: linear-gradient(to right, #4f46e5, #3b82f6);
  border-left: 6px solid #1e3a8a;
  border-radius: 6px;
  font-style: italic;
  color: #e0e7ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Listes */
.markdown-body ul {
  list-style-type: disc;
  margin: 1.5rem 0;
  padding-left: 2rem;
}

.markdown-body li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}
</style>
