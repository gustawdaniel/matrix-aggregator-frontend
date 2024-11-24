<script setup lang="ts">
import dayjs from "dayjs";
import type { Article } from "~/types/Article";
import type { WithId } from "mongodb";

const props = defineProps<{
  article: WithId<Article>;
}>();

const article = props.article;
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-900">
      {{ article.metadata.title }}
    </h2>
    <p class="my-2 font-bold">
      {{
        article.metadata["article:published_time"].substring(0, 10)
      }}
    </p>
    <p class="text-gray-700 mt-2">{{ article.metadata.description }}</p>

    <nuxt-link
      :to="`/article/${String(article._id)}`"
      class="text-indigo-600 hover:text-indigo-800 mt-4 inline-block"
    >
      Read here
    </nuxt-link>

    <ArticleTagging v-model="article.tags" :articleId="String(article._id)" />
  </div>
</template>

<style scoped></style>
