<script setup lang="ts">
  const model = defineModel<string | string[]>();
  const fields = {
    amount: '金额',
    type: '收/支',
    counterparty: '交易对方',
    description: '商品说明',
    payment: '支付方式',
    status: '交易状态',
    category: '交易分类',
    orderNumber: '交易订单号',
    merchantNumber: '商家订单号',
    transactionTime: '交易时间',
    remark: '备注',
    from: '来源',
  };
  const emit = defineEmits(['change'])

  function onChange(value) {
    if (Array.isArray(value)) emit('change', value.map((k) => ({ field: k, label: fields[k] })))
    else emit('change', { field: value, label: fields[value] })
  }
</script>
<template>
  <a-select v-model:value="model" @change="onChange" v-bind="$attrs">
    <a-select-option v-for="(val, key) in fields" :value="key" :key="key">
      <span class="inline-block">{{ val }}</span>
      <span class="inline-block text-gray-400 ml-2">{{ key }}</span>
    </a-select-option>
  </a-select>
</template>
