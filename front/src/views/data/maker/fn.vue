<script setup lang="ts">
  import { FormInstance } from 'ant-design-vue';
  import { SQLFn, SQLFnParam } from '@/api/data';
  import Fn from './fn.vue';
  import FieldSelect from './fieldSelect.vue';

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

  watch(
    () => props.modelValue,
    (value) => {
      if (value instanceof SQLFn) {
        data.value = value;
      } else {
        data.value = new SQLFn();
      }
    },
  );

  watch(data, (value) => {
    emit('update:modelValue', value);
  });

  function typeChange(value, p) {
    if (typeof p.value != 'string' && value != 'fn') p.value = '';
    else if (value == 'fn') p.value = new SQLFn();
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
    return (await formRef.value?.validate()) && (!fnRef.value || (await fnRef.value?.validate()));
  }

  defineExpose({
    validate,
  });
</script>

<template>
  <a-form
    ref="formRef"
    class="p-3 border border-dashed border-gray-500 rounded-md mb-2"
    :model="data"
    :rules="rules"
  >
    <a-form-item label="SQL 函数名" name="name">
      <a-input v-model:value="data.name" />
    </a-form-item>
    <section class="flex justify-between">
      <a-button type="primary" size="small" @click="addParams"
      >
        <Icon icon="i-mdi:add-bold" /> 添加参数
      </a-button
      >
      <section>{{ data.toString() }}</section>
    </section>
    <section v-for="(p, i) in data.params" :key="i" class="border px-3 mt-2">
      <a-divider
      >
        参数 {{ i + 1 }}
        <Icon
          @click="data.params.splice(i, 1)"
          class="cursor-pointer hover:text-primary"
          icon="i-ic:baseline-close"
        />
      </a-divider>
      <a-form-item label="类型" :name="['params', i, 'type']" :rules="rules.type">
        <a-select v-model:value="p.type" @change="typeChange($event, p)">
          <a-select-option value="col">字段</a-select-option>
          <a-select-option value="value">常数</a-select-option>
          <a-select-option value="string">字符串</a-select-option>
          <a-select-option value="fn">函数</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="p.type == 'value'"
        label="　值"
        :name="['params', i, 'value']"
        :rules="rules.value"
      >
        <a-input-number v-model:value="p.value" />
      </a-form-item>
      <a-form-item
        v-if="p.type == 'string'"
        label="　值"
        :name="['params', i, 'value']"
        :rules="rules.value"
      >
        <a-input v-model:value="p.value" />
      </a-form-item>
      <a-form-item
        v-else-if="p.type == 'col'"
        label="字段"
        :name="['params', i, 'value']"
        :rules="rules.value"
      >
        <FieldSelect v-model="p.value as string" />
      </a-form-item>
      <Fn ref="fnRef" v-else v-model="p.value as SQLFn" />
    </section>
  </a-form>
</template>
