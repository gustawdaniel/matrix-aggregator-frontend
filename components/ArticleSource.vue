<script lang="ts" setup>
import type { Source } from "~/types/Source";
import reutersImg from "~/assets/reuters.svg";
import yahooImg from "~/assets/finance.yahoo.svg";
defineProps<{
  source: Source
}>()
</script>

<template>
  <div class="h-6 w-6">
  <img v-if="source === 'reuters'" :src="reutersImg" alt="Reuters">
  <img v-if="source === 'finance.yahoo'" :src="yahooImg" alt="Yahoo">
  </div>
</template>