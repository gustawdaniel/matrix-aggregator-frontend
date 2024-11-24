<script setup lang="ts">
const articlesStore = useArticleStore();

const changePage = (page: number) => {
  articlesStore.setPaginationPage(page);
  articlesStore.fetchArticles(page);
};
</script>

<template>
  <div
      v-if="articlesStore.pagination.totalPages > 1"
      class="flex justify-center items-center"
  >
    <button
        :disabled="articlesStore.pagination.page === 1"
        @click="changePage(articlesStore.pagination.page - 1)"
        class="px-4 py-2 mr-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
    >
      Previous
    </button>
    <span class="text-lg text-gray-700">
          {{ articlesStore.pagination.page }} / {{ articlesStore.pagination.totalPages }}
        </span>
    <button
        :disabled="articlesStore.pagination.page === articlesStore.pagination.totalPages"
        @click="changePage(articlesStore.pagination.page + 1)"
        class="px-4 py-2 ml-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
    >
      Next
    </button>
  </div>
</template>