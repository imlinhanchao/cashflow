<script setup lang="ts">
  import { DataField, SQLFn } from '@/api/data';
  import Fn from './fn.vue';
import { FormInstance } from 'ant-design-vue';

  const props = withDefaults(
    defineProps<{
      modelValue?: DataField;
    }>(),
    {
      modelValue: () => new DataField(),
    },
  );
  const visible = ref(false);
  const data = reactive(props.modelValue);
  const isFunction = computed(() => !!data.fun);

  function functionSwitch(checked) {
    if (!checked) {
      data.fun = undefined;
    } else {
      data.fun = new SQLFn();
    }
  }

  const formRef = ref<FormInstance>();
  const rules = {
    field: [{ required: true, message: '请输入字段', trigger: 'blur' }],
    label: [{ required: true, message: '请输入标签', trigger: 'blur' }],
  };

  function open(field = new DataField()) {
    visible.value = true;
    Object.assign(data, field);
  }

  function close() {
    visible.value = false;
  }

  defineExpose({
    open,
    close,
  });
</script>

<template>
  <a-modal :visible="visible" title="数据源字段">
    <section class="overflow-auto h-[70vh]">
      <a-form ref="formRef" :model="data" :rules="rules">
        <a-form-item label="函数字段">
          <a-switch :checked="isFunction" @click="functionSwitch" />
        </a-form-item>
        <a-form-item v-if="!isFunction" label="字段" name="field">
          <a-input v-model:value="data.field" />
        </a-form-item>
        <a-form-item label="标签" name="label">
          <a-input v-model:value="data.label" />
        </a-form-item>
        <a-form-item v-if="isFunction" label="函数表达式">
          {{ data.fun?.toString() }}
        </a-form-item>
        <Fn ref="fnRef" v-model="data.fun" v-if="isFunction" />
      </a-form>
    </section>
  </a-modal>
</template>
