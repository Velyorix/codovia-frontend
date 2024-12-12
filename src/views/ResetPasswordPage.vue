<template>
  <div class="min-h-screen flex flex-col bg-gray-900">
    <HeaderComponent />
    <main class="flex-grow flex items-center justify-center">
      <div class="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <h1 class="text-3xl font-bold text-center text-primary">Réinitialiser le mot de passe</h1>
        <form @submit.prevent="handleResetPassword" class="space-y-6">
          <!-- Nouveau mot de passe -->
          <div class="relative">
            <label for="password" class="block text-gray-400 mb-2">Nouveau mot de passe</label>
            <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                class="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg pl-12 pr-12 focus:ring-2 focus:ring-primary"
                placeholder="Nouveau mot de passe"
                required
            />
            <font-awesome-icon
                icon="lock"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <font-awesome-icon
                :icon="showPassword ? 'eye-slash' : 'eye'"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                @click="toggleShowPassword"
            />
          </div>

          <!-- Confirmation mot de passe -->
          <div class="relative">
            <label for="password_confirmation" class="block text-gray-400 mb-2">Confirmer le mot de passe</label>
            <input
                v-model="passwordConfirmation"
                :type="showPassword ? 'text' : 'password'"
                id="password_confirmation"
                class="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg pl-12 pr-12 focus:ring-2 focus:ring-primary"
                placeholder="Confirmer le mot de passe"
                required
            />
          </div>

          <!-- Bouton soumettre -->
          <button
              type="submit"
              class="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-bold hover:scale-105 transition"
          >
            Réinitialiser
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
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import HeaderComponent from "../components/HeaderComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";

const route = useRoute();
const authStore = useAuthStore();

const password = ref("");
const passwordConfirmation = ref("");
const showPassword = ref(false);
const message = ref({ text: "", type: "" });

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const handleResetPassword = async () => {
  try {
    const token = route.query.token as string;
    const email = route.query.email as string;

    if (!token || !email) {
      throw new Error("Token ou email manquant.");
    }

    await authStore.resetPassword(email, token, password.value, passwordConfirmation.value);

    message.value = { text: "Mot de passe réinitialisé avec succès !", type: "success" };
    password.value = "";
    passwordConfirmation.value = "";
  } catch (error) {
    message.value = { text: error.message || "Erreur lors de la réinitialisation.", type: "error" };
  }
};
</script>
