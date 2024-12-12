<template>
  <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center gap-4">
    <div class="text-purple-500">
      <font-awesome-icon :icon="icon" size="2x" />
    </div>
    <div>
      <p class="text-lg font-bold">{{ title }}</p>
      <p class="text-2xl text-white">{{ value }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{ title: string; value: number; icon: string }>();
</script>
