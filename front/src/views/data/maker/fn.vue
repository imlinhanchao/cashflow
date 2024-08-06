<script setup lang="ts">
  import { FormInstance } from 'ant-design-vue';
  import { SQLFn, SQLFnParam } from '@/api/data';
  import Fn from './fn.vue';

  const props = withDefaults(
    defineProps<{
      modelValue?: SQLFn;
    }>(),
    {
      modelValue: () => new SQLFn(),
    },
  );
  const emit = defineEmits(['update:modelValue']);
  const data = ref(props.modelValue instanceof SQLFn ? props.modelValue : new SQLFn());

  watch(() => props.modelValue, (value) => {
    if (value instanceof SQLFn) {
      data.value = value;
    } else {
      data.value = new SQLFn();
    }
  });

  watch(data, (value) => {
    emit('update:modelValue', value);
  })

  function typeChange(value, p) {
    if(typeof p.value != 'string' && value != 'fn') 
      p.value = '';
    else if(value == 'fn') 
      p.value = new SQLFn();
  }

  function addParams() {
    data.value.params.push(new SQLFnParam());
  }

  const formRef = ref<FormInstance>();
  const fnRef = ref<InstanceType<typeof Fn>>();
  const rules = {
    name: [{ required: true, message: '请输入函数名', trigger: 'blur' }],
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    value: [{ required: true, message: '请输入值', trigger: 'blur' }],
  };

  async function validate() {
    return (await fnRef.value?.validate()) && (await formRef.value?.validate());
  }

  defineExpose({
    validate,
  })
</script>

<template>
  <a-form ref="formRef" class="p-3 border border-dashed border-gray-500 rounded-md" :model="data" :rules="rules">
    <a-form-item label="SQL 函数名" name="name">
      <a-input v-model:value="data.name" />
    </a-form-item>
    <section class="flex justify-between">
      <a-button type="primary" size="small" @click="addParams"><Icon icon="mdi:add-bold" /> 添加参数</a-button>
      <section>{{ data.toString() }}</section>
    </section>
    <section v-for="(p, i) in data.params" :key="i" class="border px-3 mt-2">
      <a-divider>参数 {{ i + 1 }} <Icon @click="data.params.splice(i ,1)" class="cursor-pointer hover:text-primary" icon="ic:baseline-close" /></a-divider>
      <a-form-item label="类型" :name="['params', i, 'type']" :rules="rules.type">
        <a-select v-model:value="p.type" @change="typeChange($event, p)">
          <a-select-option value="col">字段</a-select-option>
          <a-select-option value="value">常数</a-select-option>
          <a-select-option value="fn">函数</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="p.type == 'value'" label="　值" :name="['params', i, 'value']" :rules="rules.value">
        <a-input v-model:value="p.value" />
      </a-form-item>
      <a-form-item v-else-if="p.type == 'col'" label="字段" :name="['params', i, 'value']" :rules="rules.value">
        <a-select v-model:value="p.value">
          <a-select-option value="amount">金额</a-select-option>
          <a-select-option value="type">收/支</a-select-option>
          <a-select-option value="counterparty">交易对方</a-select-option>
          <a-select-option value="description">商品说明</a-select-option>
          <a-select-option value="payment">支付方式</a-select-option>
          <a-select-option value="status">交易状态</a-select-option>
          <a-select-option value="category">交易分类</a-select-option>
          <a-select-option value="orderNumber">交易订单号</a-select-option>
          <a-select-option value="merchantNumber">商家订单号</a-select-option>
          <a-select-option value="transactionTime">交易时间</a-select-option>
          <a-select-option value="remark">备注</a-select-option>
          <a-select-option value="from">来源</a-select-option>
        </a-select>
      </a-form-item>
      <Fn ref="fnRef" v-else v-model="p.value as SQLFn" />
    </section>
  </a-form>
</template>
