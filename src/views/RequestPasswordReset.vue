<template>
  <div class="min-h-screen flex flex-col bg-gray-900">
    <HeaderComponent />
    <main class="flex-grow flex items-center justify-center">
      <div class="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <h1 class="text-3xl font-bold text-center text-primary">Demander une réinitialisation</h1>
        <form @submit.prevent="handleRequestReset" class="space-y-6">
          <!-- Adresse e-mail -->
          <div class="relative">
            <label for="email" class="block text-gray-400 mb-2">Adresse e-mail</label>
            <input
                v-model="email"
                type="email"
                id="email"
                class="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg pl-12 focus:ring-2 focus:ring-primary"
                placeholder="Votre adresse e-mail"
                required
            />
            <font-awesome-icon
                icon="envelope"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
          </div>

          <!-- Bouton soumettre -->
          <button
              type="submit"
              class="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-bold hover:scale-105 transition"
          >
            Envoyer le lien
          </button>
        </form>
        <p v-if="message.text" :class="`text-center mt-4 text-sm ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`">
          {{ message.text }}
        </p>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import HeaderComponent from "../components/HeaderComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";

const authStore = useAuthStore();
const email = ref("");
const message = ref({ text: "", type: "" });

const handleRequestReset = async () => {
  try {
    await authStore.requestPasswordReset(email.value);

    message.value = {
      text: "Un lien de réinitialisation a été envoyé à votre adresse e-mail.",
      type: "success",
    };
    email.value = "";
  } catch (error) {
    message.value = { text: error.message || "Erreur lors de la demande.", type: "error" };
  }
};
</script>
