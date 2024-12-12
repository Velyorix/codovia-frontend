<template>
  <section class="py-8 px-6 space-y-6">
    <!-- Comment List -->
    <h2 class="text-2xl font-bold text-primary">Commentaires</h2>
    <ul class="space-y-4">
      <li
          v-for="comment in comments"
          :key="comment.id"
          class="bg-gray-800 p-4 rounded-lg shadow-sm flex items-start gap-4"
      >
        <!-- Avatar -->
        <img
            :src="comment.user?.avatar_url || '/images/default-avatar.gif'"
            alt="Avatar"
            class="w-12 h-12 rounded-full object-cover"
        />

        <!-- Comment Content -->
        <div class="flex-1">
          <!-- User Info -->
          <div class="flex justify-between items-center">
            <span class="font-semibold text-primary">{{ comment.user?.name || 'Anonyme' }}</span>
            <span class="text-gray-500 text-sm">{{ formattedDate(comment.created_at) }}</span>
          </div>

          <!-- Content -->
          <p class="text-gray-300 mt-2">{{ comment.content }}</p>

          <!-- Actions (Votes + Report) -->
          <div class="flex items-center gap-4 mt-4 text-sm text-gray-400">
            <!-- Votes -->
            <div class="flex items-center gap-2">
              <button
                  @click="voteComment(comment.id, 'upvote')"
                  class="hover:text-green-400 transition"
              >
                👍
              </button>
              <span>{{ comment.upvotes || 0 }}</span>
              <button
                  @click="voteComment(comment.id, 'downvote')"
                  class="hover:text-red-400 transition"
              >
                👎
              </button>
            </div>

            <!-- Report -->
            <button
                @click="reportComment(comment.id)"
                class="hover:text-yellow-400 transition"
            >
              Signaler
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- Comment Form -->
    <form @submit.prevent="addComment" class="mt-6 bg-gray-900 p-4 rounded-lg shadow-md">
      <textarea
          v-model="newComment"
          class="w-full bg-gray-800 text-grayLight p-3 rounded-lg"
          placeholder="Ajoutez votre commentaire..."
          rows="3"
      ></textarea>
      <button
          type="submit"
          class="block w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg font-bold shadow-md hover:shadow-lg transition"
      >
        Publier
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Props
const props = defineProps({
  articleId: { type: Number, required: true },
});

// States
const comments = ref([]);
const newComment = ref('');

// Fetch comments
const fetchComments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${props.articleId}/comments`);
    const data = await response.json();
    comments.value = data.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires :', error);
  }
};

// Add comment
const addComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    const response = await fetch(`${API_BASE_URL}/articles/${props.articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment.value }),
    });

    if (response.ok) {
      newComment.value = '';
      fetchComments(); // Refresh comments after posting
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire :', error);
  }
};

// Vote on comment
const voteComment = async (commentId, voteType) => {
  try {
    await fetch(`${API_BASE_URL}/comments/${commentId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote_type: voteType }),
    });
    fetchComments(); // Refresh votes after action
  } catch (error) {
    console.error('Erreur lors du vote sur le commentaire :', error);
  }
};

// Report comment
const reportComment = async (commentId) => {
  const reason = prompt('Indiquez la raison du signalement :');
  if (!reason) return;

  try {
    await fetch(`${API_BASE_URL}/comments/${commentId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    alert('Commentaire signalé avec succès !');
  } catch (error) {
    console.error('Erreur lors du signalement du commentaire :', error);
  }
};

// Format date
const formattedDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

onMounted(fetchComments);
</script>

<style scoped>
/* Limiter la taille de l'avatar tout en préservant l'animation GIF */
img {
  display: block;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}
</style>
