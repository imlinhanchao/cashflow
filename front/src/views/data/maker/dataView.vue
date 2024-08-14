<script setup lang="ts">
  const props = defineProps<{
    data: any[];
  }>();

  const columns = computed(() => props.data.length ? Object.keys(props.data[0]).map((key) => ({ title: key, dataIndex: key })) : []);
</script>

<template>
  <a-table v-if="props.data.length" sticky :dataSource="props.data" :columns="columns" />
</template>