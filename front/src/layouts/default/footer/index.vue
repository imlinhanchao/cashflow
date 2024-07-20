<script setup lang="ts"></script>

<template>
  <a-layout-footer class="!p-0">
    <p>
      Copyright © {{ new Date().getFullYear() }}
      <br />
      All Rights Reserved. Power by <a href="https://github.com/imlinhanchao/cashflow" target="_blank">Cashflow</a> Open Source.
    </p>
  </a-layout-footer>
</template>

<style lang="less" scoped>
.ant-layout-footer {
  text-align: center;
}
</style>