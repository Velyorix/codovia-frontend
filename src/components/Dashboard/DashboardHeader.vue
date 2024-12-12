<template>
  <header class="bg-gray-900 text-gray-200 p-4 flex justify-between items-center">
    <h1 class="text-2xl font-bold">{{ title }}</h1>
    <div class="relative">
      <img
          :src="authStore.user?.avatar_url || '/default-avatar.png'"
          alt="Avatar"
          class="w-10 h-10 rounded-full cursor-pointer"
          @click="toggleDropdown"
      />
      <div
          v-if="dropdownVisible"
          class="absolute right-0 mt-2 bg-white/30 backdrop-blur-md text-gray-900 rounded-lg shadow-lg w-48"
      >
        <router-link
            to="/profile"
            class="block px-4 py-2 hover:bg-gray-100 transition"
        >
          Mon Profil
        </router-link>
        <button
            @click="logout"
            class="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
        >
          Déconnexion
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();
const title = "Dashboard Admin";

const dropdownVisible = ref(false);

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const logout = () => {
  authStore.logout();
  window.location.reload();
};
</script>
