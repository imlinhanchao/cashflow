<script setup lang="ts">
  import Chart from '../chart.vue';
  import ReportForm from './form.vue';

  const options = ref<any>();

</script>

<template>
  <article class="flex h-full space-x-2">
    <section class="flex-1 h-full overflow-auto">
      <ReportForm @preview="options = $event" />
    </section>
    <section class="flex-1 h-full overflow-auto relative">
      <Chart :options="options" />
    </section>
  </article>
</template>