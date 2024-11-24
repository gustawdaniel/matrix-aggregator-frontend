<script setup lang="ts">
import {ref, computed} from 'vue';
import {useArticleStore} from '../stores/articleStore';
import {useTagStore} from '../stores/tagStore';
import type {ArticleFilter} from '../types/ArticleFilter';
import Multiselect from "vue-multiselect";
import type {Tag} from "~/types/Tag";

const articlesStore = useArticleStore();
const tagStore = useTagStore();

// Local filter state
const filter = ref<ArticleFilter>({
  search: '',
  tags: [],
  date: '',
});

// Sync local filter with store
const setFilter = (newFilter: ArticleFilter) => {
  filter.value = newFilter;
  articlesStore.setFilter(newFilter);
};

// Fetch tags on component mount
tagStore.$onAction(({name, after}) => {
  if (name === 'fetchTags') {
    after(() => console.log('Tags fetched successfully'));
  }
});
tagStore.fetchTags();
const availableTags = computed(() => tagStore.tags);

function selectTag() {
  setFilter(filter.value);
}

function removeTag() {
  setFilter(filter.value);
}


function reloadArticles() {
  articlesStore.setPaginationPage(1)
  articlesStore.fetchArticles();
}
</script>

<template>
  <div class="space-y-6 p-4">
    <!-- Search Field -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Search</label>
      <input
          v-model="filter.search"
          type="text"
          placeholder="Search articles..."
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          @input="setFilter(filter)"
      />
    </div>

    <!-- Tag Selector -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Tags</label>

      <multiselect
          v-model="filter.tags"
          tag-placeholder="Add this as new tag"
          placeholder="Search or add a tag"
          label="name"
          track-by="_id"
          :options="availableTags"
          :multiple="true"
          :taggable="false"
          @select="selectTag"
          @remove="removeTag"
      ></multiselect>

    </div>

    <!-- Date Selector -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Date</label>
      <input
          v-model="filter.date"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          @change="setFilter(filter)"
      />
    </div>

    <button @click="reloadArticles"
            class="px-4 py-2 mr-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
    >Search</button>
  </div>
</template>
