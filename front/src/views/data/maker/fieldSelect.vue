<script setup lang="ts">
  import { fieldMaps } from '@/api/data';

  const model = defineModel<string | string[]>();
  const emit = defineEmits(['change']);

  function onChange(value) {
    if (Array.isArray(value))
      emit(
        'change',
        value.map((k) => ({ field: k, label: fieldMaps[k] })),
      );
    else emit('change', { field: value, label: fieldMaps[value] });
  }
</script>
<template>
  <a-select v-model:value="model" @change="onChange" v-bind="$attrs">
    <a-select-option v-for="(val, key) in fieldMaps" :value="key" :key="key">
      <span class="inline-block">{{ val }}</span>
      <span class="inline-block text-gray-400 ml-2">{{ key }}</span>
    </a-select-option>
  </a-select>
</template>
