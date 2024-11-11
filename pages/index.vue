<template>
  <div class="container mx-auto p-6">

    <nav class="flex justify-between items-center my-8">
    <h1 class="text-3xl font-bold">Articles</h1>

      <nuxt-link to="/tags">Tags</nuxt-link>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center items-center">
      <button
          :disabled="pagination.page === 1"
          @click="changePage(pagination.page - 1)"
          class="px-4 py-2 mr-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        Previous
      </button>
      <span class="text-lg text-gray-700">
        {{ pagination.page }} / {{ pagination.totalPages }}
      </span>
      <button
          :disabled="pagination.page === pagination.totalPages"
          @click="changePage(pagination.page + 1)"
          class="px-4 py-2 ml-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        Next
      </button>
    </div>
    </nav>

    <div v-if="articles.length" class="space-y-6 grid grid-cols-4 gap-5">
      <div v-for="article in articles" :key="String(article._id)" class="col-span-4 md:col-span-2 xl:col-span-1">
        <ArticleTile :article="article" />
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500">No articles found</p>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type {ArticleMetadata} from "~/types/ArticleMetadata";
import ArticleTile from "~/components/ArticleTile.vue";
import dayjs from "dayjs";
import type {Article} from "~/types/Article";
import type {WithId} from "mongodb";



interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

const articles = ref<WithId<Article>[]>([]);
const pagination = ref<Pagination>({
  page: 1,
  limit: 12,
  totalCount: 0,
  totalPages: 1,
});

const fetchArticles = async (page: number = pagination.value.page) => {
  try {
    const response = await fetch(`/api/articles?${new URLSearchParams({
      page: page.toString(),
      limit: pagination.value.limit.toString(),
    }).toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add query parameters for pagination
    });
    const data = await response.json();
    articles.value = data.articles;
    pagination.value = data.pagination;
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};

const changePage = (page: number) => {
  console.log('page', page);

  pagination.value.page = page;
  fetchArticles(page);
};

onMounted(() => {
  fetchArticles();
});
</script>