<template>
  <div class="bg-gray-800 p-6 rounded-lg shadow-md">
    <h3 class="text-lg font-bold text-primary mb-2">{{ article.title || "Titre non disponible" }}</h3>
    <p class="text-sm text-gray-400 mb-2">
      Auteur : {{ article.user?.name || "Auteur inconnu" }}
    </p>
    <p class="text-sm text-gray-400 mb-4">
      Créé le : {{ formatDate(article.created_at) || "Date inconnue" }}
    </p>
    <div class="flex gap-4">
      <button
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
          @click="$emit('read', article)"
      >
        Lire
      </button>
      <button
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
          @click="$emit('approve', article.id)"
      >
        Accepter
      </button>
      <button
          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400"
          @click="$emit('reject', article.id)"
      >
        Refuser
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from "../../utils/date";

defineProps<{
  article: {
    id: number | null;
    title: string | null;
    user?: { name: string | null };
    created_at: string | null;
  };
}>();
</script>
