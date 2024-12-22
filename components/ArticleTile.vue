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
  const rawTextOrArray = props.article.summary ?? props.article.metadata.description;
  let rawText = '';
  if(Array.isArray(rawTextOrArray)) {
    rawText = rawTextOrArray.at(-1) ?? '';
  } else {
    rawText = rawTextOrArray;
  }
  if(!rawText) {
    return '';
  }
  console.log('props.article', props.article._id);
  console.log('props.article.summary', props.article.summary);
  console.log('props.article.metadata.description', props.article.metadata.description);
  console.log('rawText', rawText, typeof rawText);

  return md.render(rawText);
});

function dateFromObjectId (objectId: string | ObjectId): string {
  return new Date(parseInt(String(objectId).substring(0, 8), 16) * 1000).toISOString();
}

function articleDates(article: WithId<Article>) {
  const published = article.metadata["article:published_time"] ?? '';
  const updated = article.metadata["article:modified_time"] ?? '';
  const created = dateFromObjectId(article._id) ?? '';

  const options: Intl. DateTimeFormatOptions = {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("sv", options);
  const publishedNy = published ? formatter.format(new Date(published)) : '';
  const updatedNY = updated ? formatter.format(new Date(updated)) : '';
  const createdNY = created ? formatter.format(new Date(created)) : '';

  const lines: string[] = [];
  if (published) {
    lines.push(`published: ${published}`);
  }
  if (updated) {
    lines.push(`updated: ${updated}`);
  }
  if (created) {
    lines.push(`downloaded: ${created}`);
  }
  if (publishedNy) {
    lines.push(`\npublished in NY: ${publishedNy}`);
  }
  if (updatedNY) {
    lines.push(`updated in NY: ${updatedNY}`);
  }
  if (createdNY) {
    lines.push(`downloaded in NY: ${createdNY}`);
  }

  return lines.join('\n');
}

function mainArticleDate(article: WithId<Article>) {
  const published = article.metadata["article:published_time"] ?? '';

  if (published) {
    return published.substring(0, 10)
  }

  const created = dateFromObjectId(article._id) ?? '';

  return created.substring(0, 10);
}

function getTitle(title: string | string[]): string {
  if(Array.isArray(title)) {
    return title.at(-1) ?? '';
  }
  return title;
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-900">
      {{ getTitle(article.metadata.title) }}
    </h2>
    <p class="my-2 font-bold flex justify-between w-full">
      <span :title="articleDates(article)" class="flex gap-2">
        {{ mainArticleDate(article) }}
        <ArticleSource :source="article.source" />
      </span>
      <button class="flex gap-2" @click="createSummary(article._id)">
        <span>{{article.rawSummaries?.length ?? 0}}</span>
        <Loader v-if="loading" />
        <Bot v-else/>
      </button>
    </p>

    <p class="text-gray-700 mt-2 prose" v-html="summary"/>

    <TickersReport :tickers="article.tickers ?? []"/>
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
