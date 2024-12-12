<template>
  <div class="min-h-screen flex flex-col bg-gray-900">
    <HeaderComponent />
    <main class="flex-grow flex items-center justify-center">
      <div class="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <h1 class="text-3xl font-bold text-center text-primary">Se connecter</h1>
        <form @submit.prevent="handleLogin" class="space-y-6">
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

          <!-- Bouton Soumettre -->
          <button
              type="submit"
              class="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-bold hover:scale-105 transform transition"
          >
            Connexion
          </button>
        </form>

        <!-- Messages -->
        <p v-if="message.text" :class="`text-center mt-4 text-sm ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`">
          {{ message.text }}
        </p>

        <!-- Liens -->
        <div class="text-center text-sm text-gray-400">
          <p>
            Pas encore inscrit ?
            <router-link to="/register" class="text-primary hover:underline">
              Créer un compte
            </router-link>
          </p>
          <p>
            <router-link to="/reset-password" class="text-primary hover:underline">
              Mot de passe oublié ?
            </router-link>
          </p>
        </div>
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

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const message = ref({ text: "", type: "" });

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);

    message.value = { text: "Connexion réussie ! Redirection en cours...", type: "success" };
    setTimeout(() => router.push("/"), 1500);
  } catch (error) {
    message.value = { text: error.message || "Erreur lors de la connexion.", type: "error" };
  }
};
</script>
