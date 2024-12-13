<template>
  <div id="app">
    <div
        v-if="errorMessage"
        class="fixed top-4 right-3 transform -translate-x-1/2 z-50 p-4 w-11/12 max-w-md bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 text-center text-white text-sm transition-opacity duration-300"
    >
      {{ errorMessage }}
    </div>
    <router-view />
    <Toast />
  </div>
</template>

<script lang="ts">
import { useAuthStore } from "./stores/auth";
import { computed } from "vue";
import Toast from "./components/Shared/Toast.vue";

export default {
  components: {Toast},
  setup() {
    const authStore = useAuthStore();
    const errorMessage = computed(() => authStore.errorMessage);

    return { errorMessage };
  },
};
</script>

<style scoped>
/* Ajout d'une animation */
.fixed {
  animation: fade-in-out 5s ease-in-out forwards;
  z-index: 999999;
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
    transform: translateY(-20px) translateX(-50%);
  }
  10% {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
  90% {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) translateX(-50%);
  }
}
</style>
