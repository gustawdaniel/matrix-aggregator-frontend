<template>
  <div class="container mx-auto p-6">
    <nav class="flex justify-between items-center my-8">
      <h1 class="text-3xl font-bold">Articles</h1>

      <nuxt-link to="/tags">Tags</nuxt-link>
      <nuxt-link to="/prompt">Prompt</nuxt-link>

      <!-- Pagination -->
      <ArticlesPagination />
    </nav>

    <!-- Filters -->
    <ArticlesFilter />

    <div v-if="articlesStore.articles.length" class="space-y-6 grid grid-cols-4 gap-5">
      <div
        v-for="article in articlesStore.articles"
        :key="String(article._id)"
        class="col-span-4 md:col-span-2 xl:col-span-1"
      >
        <ArticleTile :article="article" />
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500">No articles found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import ArticleTile from "~/components/ArticleTile.vue";

const articlesStore = useArticleStore();

onMounted(() => {
  articlesStore.fetchArticles();
});
</script>
