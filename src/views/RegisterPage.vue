<template>
  <div class="min-h-screen flex flex-col bg-gray-900">
    <HeaderComponent />
    <main class="flex-grow flex items-center justify-center">
      <div class="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <h1 class="text-3xl font-bold text-center text-primary">Créer un compte</h1>
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Champ Pseudo -->
          <div class="relative">
            <label for="name" class="block text-gray-400 mb-2">Pseudo</label>
            <div class="relative">
              <input
                  v-model="name"
                  type="text"
                  id="name"
                  class="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pl-12"
                  placeholder="Votre pseudo"
                  required
              />
              <font-awesome-icon
                  icon="user"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"
              />
            </div>
          </div>

          <!-- Champ Email -->
          <div class="relative">
            <label for="email" class="block text-gray-400 mb-2">Adresse e-mail</label>
            <div class="relative">
              <input
                  v-model="email"
                  type="email"
                  id="email"
                  class="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pl-12"
                  placeholder="Votre adresse e-mail"
                  required
              />
              <font-awesome-icon
                  icon="envelope"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"
              />
            </div>
          </div>

          <!-- Champ Mot de Passe -->
          <div class="relative">
            <label for="password" class="block text-gray-400 mb-2">Mot de passe</label>
            <div class="relative">
              <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  class="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pl-12 pr-12"
                  placeholder="Votre mot de passe"
                  required
              />
              <font-awesome-icon
                  icon="lock"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"
              />
              <font-awesome-icon
                  :icon="showPassword ? 'eye-slash' : 'eye'"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg cursor-pointer"
                  @click="toggleShowPassword"
              />
            </div>
          </div>

          <!-- Champ Confirmation de Mot de Passe -->
          <div class="relative">
            <label for="passwordConfirmation" class="block text-gray-400 mb-2">Confirmez le mot de passe</label>
            <div class="relative">
              <input
                  v-model="passwordConfirmation"
                  :type="showPassword ? 'text' : 'password'"
                  id="passwordConfirmation"
                  class="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pl-12 pr-12"
                  placeholder="Confirmez votre mot de passe"
                  required
              />
              <font-awesome-icon
                  icon="lock"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"
              />
            </div>
          </div>

          <!-- CGU -->
          <div class="flex items-center gap-2">
            <input
                v-model="acceptCGU"
                type="checkbox"
                id="cgu"
                class="w-5 h-5 text-primary bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-primary"
                required
            />
            <label for="cgu" class="text-sm text-gray-400">
              J'accepte les
              <a href="/cgu" class="text-primary hover:underline">
                conditions générales d'utilisation
              </a>.
            </label>
          </div>

          <!-- Bouton Soumettre -->
          <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-bold hover:scale-105 transform transition"
          >
            <span v-if="!loading">S'inscrire</span>
            <span v-else class="flex items-center gap-2">
              <font-awesome-icon icon="spinner" spin /> En cours...
            </span>
          </button>
        </form>
        <p
            v-if="message.text"
            :class="`text-center mt-4 ${
            message.type === 'error' ? 'text-red-400' : 'text-green-400'
          }`"
        >
          {{ message.text }}
        </p>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import HeaderComponent from "../components/HeaderComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const acceptCGU = ref(false);
const showPassword = ref(false);
const message = ref({ text: "", type: "" });
const loading = ref(false);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const handleRegister = async () => {
  try {
    loading.value = true;

    if (!acceptCGU.value) {
      throw new Error("Vous devez accepter les conditions générales.");
    }

    await authStore.register(
        name.value,
        email.value,
        password.value,
        passwordConfirmation.value
    );

    message.value = {
      text: "Inscription réussie ! Redirection en cours...",
      type: "success",
    };

    setTimeout(() => router.push("/"), 1500);
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    message.value = {
      text: error.message || "Erreur lors de l'inscription.",
      type: "error",
    };
  } finally {
    loading.value = false;
  }
};
</script>