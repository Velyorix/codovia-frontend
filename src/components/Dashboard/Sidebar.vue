<template>
  <aside class="w-64 bg-gray-800 text-gray-200 h-screen px-4 py-6 flex flex-col">
    <h2 class="text-lg font-bold text-purple-500 mb-6">Codovia Dashboard</h2>
    <nav>
      <router-link
          v-for="link in links"
          :key="link.label"
          :to="link.route"
          class="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          :class="{ 'bg-purple-600 text-white': isActive(link.route) }"
      >
        {{ link.label }}
      </router-link>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

const links = [
  { label: "Dashboard", route: "/admin" },
  { label: "Articles", route: "/admin/articles" },
  { label: "Catégories", route: "/admin/categories" },
  { label: "Tags", route: "/admin/tags" },
  { label: "Utilisateurs", route: "/admin/users" },
];

const route = useRoute();
const isActive = (routeName: string) => route.path.startsWith(routeName);
</script>
