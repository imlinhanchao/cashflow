<script setup lang="ts">
  import { DataField, SQLFn } from '@/api/data';
  import Fn from './fn.vue';
  import { FormInstance } from 'ant-design-vue';
  import FieldSelect from './fieldSelect.vue';
import { clone } from '@/utils';

  const data = ref<DataField>(new DataField());
  const emit = defineEmits<{
    (ev: 'confirm', value: DataField): void
  }>()

  const visible = ref(false);
  const isFunction = computed(() => !!data.value.fun);

  function functionSwitch(checked) {
    if (checked && !data.value.fun) {
      data.value.fun = new SQLFn();
    }
  }

  const formRef = ref<FormInstance>();
  const rules = {
    field: [{ required: true, message: '请输入字段', trigger: 'blur' }],
    label: [{ required: true, message: '请输入标签', trigger: 'blur' }],
  };

  let resolve: (value: DataField) => void;
  function open(field = new DataField()) {
    visible.value = true;
    data.value = Object.assign(new DataField(), clone(field));
    return new Promise<DataField>((r) => {
      resolve = r;
    });
  }

  function close() {
    visible.value = false;
  }

  async function save() {
    if (!(await formRef.value?.validate())) return;
    if (!isFunction.value) {
      delete data.value.fun;
    }
    emit('confirm', data.value);
    resolve?.(data.value);
    close();
  }

  defineExpose({
    open,
    close,
  });
</script>

<template>
  <a-modal :visible="visible" title="数据源字段" @cancel="close" @ok="save">
    <section class="overflow-auto h-[70vh]">
      <a-form ref="formRef" :model="data" :rules="rules">
        <a-form-item label="函数字段">
          <a-switch :checked="isFunction" @click="functionSwitch" />
        </a-form-item>
        <a-form-item v-if="!isFunction" label="字段" name="field">
          <FieldSelect v-model="data.field" />
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
