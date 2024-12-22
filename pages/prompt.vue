<script setup lang="ts">
import type { Prompt } from "~/types/Propmt";

const prompt = ref<Prompt>({
  command: "",
  example: "",
  persona: "",
});
const error = ref<string | null>(null);
const loading = ref<boolean>(true);
const saving = ref<boolean>(false);

onMounted(async () => {
 await getPrompt();
});

async function getPrompt() {
  loading.value = true;
  try {
    const response = await $fetch<{ statusCode: number; body: Prompt }>(
      "/api/prompt",
    );
    if (response.statusCode !== 200) {
      console.error("Failed to fetch prompt:", response);
      error.value = "Failed to fetch prompt";
      return;
    } else {
      prompt.value = response.body;
    }
  } catch (err) {
    console.error("Failed to fetch prompt:", err);
    error.value = "Failed to fetch prompt";
  } finally {
    loading.value = false;
  }
}

async function updatePrompt() {
  saving.value = true;
  try {
    const response = await $fetch<{ statusCode: number; body: Prompt }>(
      "/api/prompt",
      {
        method: "PUT",
        body: JSON.stringify(prompt.value),
      },
    );
    if (response.statusCode !== 200) {
      console.error("Failed to update prompt:", response);
      error.value = "Failed to update prompt";
      return;
    } else {
      prompt.value = response.body;
    }
  } catch (err) {
    console.error("Failed to update prompt:", err);
    error.value = "Failed to update prompt";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="flex items-center mb-6">
      <nuxt-link class="text-2xl font-semibold text-gray-900" to="/prompt">
        Prompt
      </nuxt-link>
      <nuxt-link to="/" class="ml-5">Home</nuxt-link>
      <nuxt-link to="/tags" class="ml-5">Tags</nuxt-link>
    </div>

    <pre v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</pre>
    <pre v-if="loading" class="text-gray-700 text-sm mt-2">Loading...</pre>
    <div v-if="!error && !loading">
      <div class="border p-2 m-2">
        <h3 class="font-semibold text-lg">Persona</h3>
        <textarea v-model="prompt.persona" class="w-full p-1" rows="2" />
      </div>

      <div class="border p-2 m-2">
        <h3 class="font-semibold text-lg">Command</h3>
        <textarea v-model="prompt.command" class="w-full p-1" rows="10" />
      </div>

      <div class="border p-2 m-2">
        <h3 class="font-semibold text-lg">Example</h3>
        <textarea v-model="prompt.example" class="w-full p-1" rows="10" />
      </div>

      <div class="m-2">
        <button
          @click="updatePrompt"
          :disabled="saving"
          class="px-4 py-2 mr-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 w-full"
        >
          Update
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
