<script setup lang="ts" name="Header">
  import Logo from '@/layouts/components/logo/index.vue';
  import Menu from '@/layouts/components/menu/index.vue';
  import User from '@/layouts/components/user/index.vue';
</script>

<template>
  <a-layout-header class="!bg-transparent !px-2 flex justify-between items-center">
    <Menu @menu-click="$router.push($event)" />
    <Logo />
    <User />
  </a-layout-header>
</template>
