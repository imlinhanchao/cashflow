<script setup lang="ts" name="User">
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();

  function menuClick({ key }) {
    switch(key) {
      case 'user':
        break;
      case 'logout':
        userStore.confirmLoginOut();
        break;
    }
  }
</script>
<template>
  <a-dropdown placement="bottomLeft" arrow class="mx-3">
    <span class="flex items-center cursor-pointer">
      <a-avatar class="bg-primary">{{ userStore.getUserInfo.username.slice(0, 1) }}</a-avatar>
    </span>

    <template #overlay>
      <a-menu @click="menuClick">
        <a-menu-item key="user">个人中心</a-menu-item>
        <a-menu-item key="logout">退出登录</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
