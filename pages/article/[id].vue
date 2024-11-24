<script setup lang="ts">
import { ref } from "vue";

const route = useRoute();

const article = ref<Article | null>();
const htmlContent = ref<string>("");

const md = new MarkdownIt();

const fetchArticle = async (id: string) => {
  try {
    const response = await fetch(`/api/article/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add query parameters for pagination
    });
    article.value = await response.json();

    // Convert Markdown to HTML
    if (article.value) {
      htmlContent.value = md.render(article.value?.markdown);
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
};
import MarkdownIt from "markdown-it";
import type { Article } from "~/types/Article";

onMounted(() => {
  fetchArticle(route.params.id as string);
});
</script>

<template>
  <div class="container mx-auto">
    <div v-if="article" class="prose prose-slate mx-auto">
      <nuxt-link to="/">Home</nuxt-link>

      Page: {{ route.params.id }}
      <h1>{{ article.metadata.title }}</h1>

      <a
        :href="article.metadata.url"
        target="_blank"
        class="text-indigo-600 hover:text-indigo-800 mt-4 inline-block"
      >
        Read source
      </a>

      <div v-html="htmlContent"></div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<style scoped></style>
