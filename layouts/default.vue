<script setup lang="ts">
import { useTagStore } from "~/stores/tagStore";

onMounted(() => {
  useTagStore().fetchTags();
});
</script>

<template>
  <div>
    <slot />
  </div>
</template>

<style scoped></style>
