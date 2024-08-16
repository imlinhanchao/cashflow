<script setup lang="ts">
  import { SyncModel } from '.';

  const props = withDefaults(
    defineProps<{
      modelValue: SyncModel;
    }>(),
    {},
  );

  const data = reactive(props.modelValue);

  defineExpose({
    async vaildate() {
      return true;
    },
  });
</script>

<template>
  <a-form :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" class="w-full">
    <a-form-item label="同步来源">
      <a-radio-group v-model:value="data.from">
        <a-radio-button value="alipay">
          <Icon icon="i-ant-design:alipay-outlined" /> 支付宝
        </a-radio-button>
        <a-radio-button value="wepay"><Icon icon="i-ri:wechat-pay-line" /> 微信支付</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="同步方式">
      <a-radio-group v-model:value="data.way">
        <a-radio-button value="email">
          <Icon icon="i-mingcute:mail-line" /> 邮箱接收对账单
        </a-radio-button>
        <a-radio-button value="file">
          <Icon icon="i-hugeicons:csv-02" size="1.3em" /> 直接上传对账单
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
  </a-form>
</template>
