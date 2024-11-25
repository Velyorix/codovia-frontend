<template>
  <div class="bg-background text-grayLight overflow-hidden">
    <HeaderComponent />
    <HeroSection />
    <CategoriesSection />
    <ArticlesSection />
    <FooterComponent />
  </div>
</template>

<script setup>
import HeroSection from "../components/HomePage/HeroSection.vue";
import CategoriesSection from "../components/HomePage/CategoriesSection.vue";
import ArticlesSection from "../components/HomePage/ArticlesSection.vue";
import FooterComponent from "../components/FooterComponent.vue";
import HeaderComponent from "../components/HeaderComponent.vue";
</script>

<style scoped>
</style>
