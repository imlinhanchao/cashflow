<script lang="ts" setup>
  import { SyncModel } from '.';

  withDefaults(
    defineProps<{
      count: number;
      data: SyncModel;
    }>(),
    {},
  );
</script>
<template>
  <a-result
    status="success"
    :title="`${{ alipay: '支付宝', wepay: '微信支付' }[data.from]}对账单已完成同步`"
    :sub-title="`共完成同步账单数量 ${count} 笔`"
  >
    <template #extra>
      <slot></slot>
    </template>
  </a-result>
</template>
