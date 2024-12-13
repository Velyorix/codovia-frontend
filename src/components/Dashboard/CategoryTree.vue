<template>
  <li>
    <div class="flex items-center justify-between">
      <span class="text-gray-200">{{ category.name }}</span>
      <div class="space-x-2">
        <button
            @click="$emit('edit', category)"
            class="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-md"
        >
          Modifier
        </button>
        <button
            @click="$emit('delete', category.id)"
            class="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md"
        >
          Supprimer
        </button>
      </div>
    </div>

    <ul v-if="category.children && category.children.length" class="pl-4 border-l border-gray-600 mt-2">
      <CategoryTree
          v-for="subCategory in category.children"
          :key="subCategory.id"
          :category="subCategory"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
      />
    </ul>
  </li>
</template>

<script lang="ts" setup>
defineProps({
  category: {
    type: Object,
    required: true,
  },
});
</script>
