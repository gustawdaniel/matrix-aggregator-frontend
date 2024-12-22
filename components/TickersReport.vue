<script setup lang="ts">
import type { AiSummaryTicker } from "~/types/AiSummaryTicker";

const props = withDefaults(
  defineProps<{
    tickers: AiSummaryTicker[];
  }>(),
  {
    tickers: () => [],
  },
);

interface GroupedTickerItem {
  code: string;
  move: 'up' | 'down' | 'volatility';
  count: number;
  reason: string;
  name: string
}

const separator = `---`

const countByCodeAndMove = computed<GroupedTickerItem[]>((): GroupedTickerItem[] => {
  const countByCodeAndMove = props.tickers.reduce(
    (acc, ticker) => {
      const key = `${ticker.code}${separator}${ticker.move}`;
      if (acc[key]) {
        acc[key]++;
      } else {
        acc[key] = 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
  return Object.entries(countByCodeAndMove).map(([key, value]): GroupedTickerItem=> {
    const [code, move] = key.split(`${separator}`);
    const existing = props.tickers.find((ticker) => ticker.code === code && ticker.move === move);

    return {
      code,
      move,
      count: value,
      reason: existing?.reason ?? 'unknown',
      name: existing?.name ?? 'unknown',
    } as GroupedTickerItem;
  });
});

const maxTickerCount = computed(() => {
  return Math.max(...countByCodeAndMove.value.map((item) => item.count));
});

const getOpacityStyle = (count: number) => {
  // Calculate opacity based on count: higher count = more opacity.
  const opacity = Math.min(count / maxTickerCount.value, 1); // Cap at 1 for full opacity
  return {
    opacity: opacity,
  };
};
</script>

<template>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(item, index) in countByCodeAndMove.toSorted((a, b) => b.count - a.count)"
        :key="index"
        class="p-1 rounded-lg border transition-all duration-300"
        :class="{
            'bg-green-600 hover:bg-green-700': item.move === 'up',
            'bg-red-600 hover:bg-red-700': item.move === 'down',
            'bg-yellow-600 hover:bg-yellow-700': item.move === 'volatility'
          }"
        :style="getOpacityStyle(item.count)"

      >
          <span class="text-lg font-semibold text-white"
                :title="`${item.count}\n${item.name}\n${item.reason}`"
          >{{ item.code }}</span>
      </div>
    </div>




<!--  <pre>{{ countByCodeAndMove }}</pre>-->
</template>

<style scoped>
/* Custom styling for hover effect */
p:hover {
  font-weight: normal;
  color: #4b5563; /* Normal text color */
}

span:hover {
  font-weight: bold;
}
</style>