<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-purple-500 mb-6">Dashboard Éditeur</h1>
    <div class="grid grid-cols-2 gap-6">
      <DashboardCard
          title="Mes articles"
          description="Créer, modifier ou supprimer vos articles"
          route="/editor/articles"
      />
      <DashboardCard
          title="Catégories"
          description="Gérer les catégories"
          route="/editor/categories"
      />
      <DashboardCard
          title="Tags"
          description="Ajouter ou modifier les tags"
          route="/editor/tags"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import DashboardCard from "../components/Dashboard/StatsCard.vue";
</script>
