<template>
  <div class="py-8 px-6">
    <p class="text-xl">
      Note moyenne :
      <span class="font-bold text-primary">{{ averageRating || "Pas encore noté" }}</span>
    </p>
    <div class="mt-4 flex space-x-2">
      <button
          v-for="i in 5"
          :key="i"
          @click="rateArticle(i)"
          class="px-3 py-2 rounded-full"
          :class="i <= userRating ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'"
      >
        {{ i }} ★
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const props = defineProps({
  articleId: { type: Number, required: true },
});

const averageRating = ref(0);
const userRating = ref(0);
const authStore = useAuthStore();


// Fetch average rating
const fetchRating = async () => {
  const response = await fetch(`${API_BASE_URL}/articles/${props.articleId}/ratings`);
  const data = await response.json();
  averageRating.value = data.average_rating;
};

// Submit rating
const rateArticle = async (rating: number) => {
  const response = await fetch(`${API_BASE_URL}/articles/${props.articleId}/rate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${authStore.token}`},
    body: JSON.stringify({ rating }),
  });
  if (response.ok) await fetchRating();
};

onMounted(fetchRating);
</script>
