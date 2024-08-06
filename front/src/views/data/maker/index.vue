<script setup lang="ts">
  import DataForm from './form.vue';
</script>

<template>
  <article class="flex h-full space-x-2">
    <section class="flex-1 h-full overflow-auto">
      <DataForm />
    </section>
    <section class="flex-1 h-full overflow-auto relative"> </section>
  </article>
</template>
