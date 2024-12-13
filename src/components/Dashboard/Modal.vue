<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="bg-glass p-6 w-full max-w-3xl rounded-2xl relative shadow-xl">
      <!-- Bouton de fermeture -->
      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
      >
        ✕
      </button>

      <!-- Titre de la modal -->
      <h3 class="text-2xl font-bold text-primary mb-6 text-center">{{ title }}</h3>

      <!-- Contenu passé par slot -->
      <div class="max-h-96 overflow-y-auto p-4 custom-scrollbar text-background">
        <slot></slot>
      </div>

      <!-- Boutons d'action -->
      <div class="mt-6 flex justify-end gap-4">
        <button
            @click="$emit('close')"
            class="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
        >
          Annuler
        </button>
        <button
            @click="$emit('submit')"
            class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition"
        >
          Valider
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ visible: boolean; title: string }>();
</script>

<style lang="css">
/* Glassmorphism Background */
.bg-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Custom Scrollbar for modal content */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #4f46e5 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4f46e5;
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Text color classes */
.text-primary {
  color: #a78bfa;
}
</style>
