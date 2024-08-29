<script setup lang="ts">
import { useECharts } from '@/hooks/web/useECharts';

  const props = withDefaults(defineProps<{
    width?: string;
    height?: string;
    options?: any;
  }>(), {
    width: '100%',
    height: '100%',
  });

  const chartRef = ref<HTMLDivElement>();
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  onMounted(() => {
    if (props.options) {
      setOptions(props.options);
    }
  })

  watch(() => props.options, (options) => {
    if (options) {
      setOptions(options);
    }
  });
</script>
<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>