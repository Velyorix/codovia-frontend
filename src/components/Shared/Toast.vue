<template>
  <div class="fixed bottom-4 right-4 space-y-4">
    <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="`px-4 py-2 rounded-lg text-white shadow-lg ${toast.type}`"
        class="toast"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useToast } from "../../composables/Toast";

const { toasts } = useToast();
</script>

<style scoped>
.toast {
  transition: all 0.3s ease;
  opacity: 0.9;
}
.toast:hover {
  opacity: 1;
}
</style>
