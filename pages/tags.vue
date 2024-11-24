<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="flex items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Manage Tags</h1>
      <nuxt-link to="/" class="ml-5">Home</nuxt-link>
    </div>

    <!-- Add Tag Section -->
    <div class="mb-6">
      <form @submit.prevent="addTag" class="flex space-x-4">
        <input
          v-model="newTagName"
          type="text"
          placeholder="New tag name"
          class="px-4 py-2 border rounded-lg text-gray-800 flex-1"
          :class="{ 'border-red-500': error }"
        />
        <input
          v-model="newTagColor"
          type="color"
          class="w-12 h-12 border-0 rounded-lg cursor-pointer"
        />
        <button
          type="submit"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Tag
        </button>
      </form>
      <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
    </div>

    <!-- Tags List Section -->
    <div class="space-y-4">
      <div
        v-for="tag in tagStore.tags"
        :key="tag._id"
        class="flex items-center space-x-4"
      >
        <span
          class="px-4 py-2 rounded-full ext-white font-semibold"
          :style="{ backgroundColor: tag.color }"
        >
          {{ tag.name }}
        </span>
        <button
          @click="removeTag(tag._id)"
          class="text-red-600 hover:text-red-800 focus:outline-none"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTagStore } from "@/stores/tagStore";

const tagStore = useTagStore();

// Add a new tag
const handleAddTag = async () => {
  await tagStore.addTag("New Tag", "#00ff00");
};

// Remove a tag
const handleRemoveTag = async (tagId: string) => {
  await tagStore.removeTag(tagId);
};

import { ref, onMounted } from "vue";

const newTagName = ref("");
const newTagColor = ref("#ff0000");
const error = ref<string | null>(null);

const addTag = async () => {
  if (!newTagName.value.trim()) {
    error.value = "Tag name is required.";
    return;
  }

  try {
    await tagStore.addTag(newTagName.value.trim(), newTagColor.value);

    newTagName.value = "";
    newTagColor.value = "#ff0000";
    error.value = null;
    await tagStore.fetchTags(); // Refresh the tags list after adding
  } catch (err) {
    console.error("Error adding tag:", err);
    error.value = "Failed to add tag.";
  }
};

const removeTag = async (tagId: string) => {
  try {
    await tagStore.removeTag(tagId);

    await tagStore.fetchTags(); // Refresh the tags list after removal
  } catch (err) {
    console.error("Error removing tag:", err);
  }
};

onMounted(async () => {
  console.log(1);
  await tagStore.fetchTags();
  console.log(2);
});
</script>
