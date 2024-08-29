<script setup lang="ts">
  import { DataOrder, SQLFn } from '@/api/data';
  import Fn from './fn.vue';
  import { FormInstance } from 'ant-design-vue';
  import FieldSelect from './fieldSelect.vue';

  const data = ref<DataOrder>(new DataOrder());
  const emit = defineEmits<{
    (ev: 'confirm', value: DataOrder): void;
  }>();

  const visible = ref(false);
  const isFunction = computed(() => !!data.value.fun);

  function functionSwitch(checked) {
    if (checked && !data.value.fun) {
      data.value.fun = new SQLFn();
    } else {
      delete data.value.fun;
    }
  }

  const formRef = ref<FormInstance>();
  const fnRef = ref<InstanceType<typeof Fn>>();
  const rules = {
    field: [{ required: true, message: '请选择字段', trigger: 'change' }],
    label: [{ required: true, message: '请输入标签', trigger: 'change' }],
  };

  let resolve: (value: DataOrder) => void;
  function open(field = new DataOrder()) {
    visible.value = true;
    data.value = new DataOrder(field.field, field.order, field.fun);
    return new Promise<DataOrder>((r) => {
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
    } else if (!(await fnRef.value?.validate())) return;
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
  <a-modal v-model:open="visible" title="排序字段" @cancel="close" @ok="save">
    <section class="overflow-auto h-[70vh]">
      <a-form ref="formRef" :model="data" :rules="rules">
        <a-form-item label="函数字段">
          <a-switch :checked="isFunction" @change="functionSwitch" />
        </a-form-item>
        <a-form-item v-if="!isFunction" label="字段" name="field">
          <FieldSelect v-model="data.field" />
        </a-form-item>
        <a-form-item v-if="isFunction" label="函数表达式" name="fun">
          {{ data.fun?.toString() }}
        </a-form-item>
        <Fn ref="fnRef" v-model="data.fun" v-if="isFunction" />
        <a-form-item label="升降序" name="order">
          <a-select v-model:value="data.order">
            <a-select-option value="ASC">升序</a-select-option>
            <a-select-option value="DESC">降序</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </section>
  </a-modal>
</template>
