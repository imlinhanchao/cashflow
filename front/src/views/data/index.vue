<script setup lang="ts"></script>

<template>
  <article class="flex flex-col h-full">
    <header class="pb-2">
      <a-button type="primary" shape="circle" @click="$router.push('/data/maker')"><Icon icon="majesticons:data-plus-line" /></a-button>
    </header>
    <main class="flex-1 overflow-auto min-h-[50vh]"> </main>
  </article>
</template>
