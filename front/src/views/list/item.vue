<script setup lang="ts">
  import { Cashflow, create, enumField, update } from '@/api/cashflow';
import { message } from 'ant-design-vue';
  import { FormInstance, Rule } from 'ant-design-vue/es/form';

  const emit = defineEmits(['confirm']);
  const formRef = ref<FormInstance>();
  const rules: Record<string, Rule[]> = {
    counterparty: [{ required: true, message: '请选择交易对方' }],
    payment: [{ required: true, message: '请选择支付方式' }],
    amount: [{ required: true, message: '请输入金额' }],
    category: [{ required: true, message: '请选择交易分类' }],
    transactionTime: [{ required: true, message: '请选择交易时间' }],
    from: [{ required: true, message: '请选择交易来源' }],
  };
  const form = reactive(new Cashflow());
  const visible = ref(false);
  function close() {
    visible.value = false;
  }
  function open(data: Cashflow = new Cashflow()) {
    Object.assign(form, data);
    visible.value = true;
  }
  async function save() {
    if (!(await formRef.value?.validate())) return
      const res = await (form.id ? update(form.id, form) : create([form]));
      if (res) {
        message.success('保存成功！');
        close();
        emit('confirm', form);
      }
  }

  defineExpose({
    open,
    close,
  });
</script>
<template>
  <a-drawer
    :title="form.id ? '编辑' : '新增'"
    :width="720"
    :open="visible"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="close"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
      <a-form-item label="交易订单号" name="orderNumber">
        <a-input v-model:value="form.orderNumber" allowClear />
      </a-form-item>
      <a-form-item label="商家订单号" name="merchantNumber">
        <a-input v-model:value="form.merchantNumber" allowClear />
      </a-form-item>
      <a-form-item label="收/支" name="type">
        <a-select v-model:value="form.type">
          <a-select-option value="收入">收入</a-select-option>
          <a-select-option value="支出">支出</a-select-option>
          <a-select-option value="不计收支">不计收支</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="交易对方" name="counterparty">
        <FieldInput field="counterparty" :query="form" :search="enumField" :pre="[]" />
      </a-form-item>
      <a-form-item label="支付方式" name="payment">
        <FieldInput field="payment" :query="form" :search="enumField" :pre="[]" />
      </a-form-item>
      <a-form-item label="金额" name="amount">
        <a-input-number v-model:value="form.amount" prefix="￥" allowClear />
      </a-form-item>
      <a-form-item label="交易分类" name="category">
        <FieldInput field="category" :query="form" :search="enumField" :pre="[]" />
      </a-form-item>
      <a-form-item label="交易时间" name="transactionTime">
        <a-date-picker show-time v-model:value="form.transactionTime" allowClear valueFormat="YYYY-MM-DD HH:mm:ss" />
      </a-form-item>
      <a-form-item label="交易来源" name="from">
        <a-select v-model:value="form.from">
          <a-select-option value="alipay">支付宝</a-select-option>
          <a-select-option value="wepay">微信支付</a-select-option>
          <a-select-option value="bank">银行卡</a-select-option>
          <a-select-option value="card">信用卡</a-select-option>
          <a-select-option value="cash">现金</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="交易状态" name="status">
        <a-select v-model:value="form.status">
          <a-select-option value="支付成功">支付成功</a-select-option>
          <a-select-option value="退款成功">退款成功</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="交易说明" name="description">
        <a-textarea
          v-model:value="form.description"
          :auto-size="{ minRows: 2, maxRows: 5 }"
        />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea
          v-model:value="form.remark"
          :auto-size="{ minRows: 2, maxRows: 5 }"
        />
      </a-form-item>
    </a-form>
    <template #extra>
      <a-space>
        <a-button @click="close">取消</a-button>
        <a-button type="primary" @click="save">保存</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>
