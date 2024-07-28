<script setup lang="ts"></script>

<template>
  <a-layout-footer class="!px-0 !py-2">
    <p class="text-gray-300">
      Copyright © {{ new Date().getFullYear() }}
      <br />
      All Rights Reserved. Power by
      <a href="https://github.com/imlinhanchao/cashflow" target="_blank">Cashflow</a> Open Source.
    </p>
  </a-layout-footer>
</template>

<style lang="less" scoped>
  .ant-layout-footer {
    text-align: center;
  }
</style>
