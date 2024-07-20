<script setup lang="ts">
  import Header from './header/index.vue';
  import Footer from './footer/index.vue';
  import Content from './content/index.vue';
</script>
<template>
  <a-layout>
    <Header />
    <Content />
    <Footer />
  </a-layout>
</template>

<style lang="less" scoped>
.ant-layout {
  min-height: 100vh;
}
</style>
