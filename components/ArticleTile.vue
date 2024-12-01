<script setup lang="ts">
import dayjs from "dayjs";
import type { Article } from "~/types/Article";
import type { ObjectId, WithId } from "mongodb";
import { Bot, Loader } from 'lucide-vue-next';
import { useArticleStore } from "#imports";
import MarkdownIt from "markdown-it";

const props = defineProps<{
  article: WithId<Article>;
}>();

const loading = ref(false);

async function createSummary(articleId: string | ObjectId) {
  const articleStore = useArticleStore();
  loading.value = true;
  await articleStore.createSummary(String(articleId));
  console.log(`Creating summary for article ${articleId}`);
  loading.value = false;
}

const md = new MarkdownIt();

const summary = computed(() => {
  const rawText = props.article.summary ?? props.article.metadata.description;
  return  md.render(rawText);
});
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-900">
      {{ article.metadata.title }}
    </h2>
    <p class="my-2 font-bold flex justify-between w-full">
      <span>
        {{ article.metadata["article:published_time"].substring(0, 10) }}
      </span>
      <button class="flex gap-2" @click="createSummary(article._id)">
        <span>{{article.rawSummaries?.length ?? 0}}</span>
        <Loader v-if="loading" />
        <Bot v-else/>
      </button>
    </p>

    <p class="text-gray-700 mt-2 prose" v-html="summary"/>

    <TickersReport :tickers="article.tickers"/>
<!--    <pre>{{article.tickers}}</pre>-->

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
