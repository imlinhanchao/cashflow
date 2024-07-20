<script setup lang="ts">
  import Logo from '@/layouts/components/logo/index.vue';
  import Menu from '@/layouts/components/menu/index.vue';
</script>

<template>
  <a-layout-header class="!bg-transparent !px-2">
    <section class="h-full flex space-x-2">
      <Menu @menu-click="$router.push($event)" />
      <Logo />
    </section>
  </a-layout-header>
</template>