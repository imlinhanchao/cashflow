<template>
  <ConfigProvider :locale="zhCN">
    <RouterView />
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { useTitle } from '@/hooks/web/useTitle';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';

  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>
