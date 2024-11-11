<script setup lang="ts">
import {useTagStore} from "~/stores/tagStore";

onMounted(() => {
  console.log(1);
  useTagStore().fetchTags();
})
</script>

<template>
  <div>
    <slot/>
  </div>
</template>

<style scoped></style>
