<template>
  <span class="flex items-center">
    <Icon v-if="icon" :icon="icon" :size="18" class="mr-2" />
    {{ name }}
  </span>
</template>
<script lang="ts" setup>
  import Icon from '@/components/Icon/index';

  withDefaults(
    defineProps<{
      icon?: string;
      name: string;
    }>(),
    {},
  );
</script>
