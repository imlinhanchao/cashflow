<script setup lang="ts">
  import { DataField, SQLFn } from '@/api/data';
  import Fn from './fn.vue';
  import { FormInstance } from 'ant-design-vue';
  import FieldSelect from './fieldSelect.vue';

  withDefaults(
    defineProps<{
      label?: boolean;
      fields?: DataField[];
    }>(),
    {
      label: true,
    },
  );

  const data = ref<DataField>(new DataField());
  const emit = defineEmits<{
    (ev: 'confirm', value: DataField): void;
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

  let resolve: (value: DataField) => void;
  function open(field = new DataField()) {
    visible.value = true;
    data.value = new DataField(field.field, field.label, field.fun);
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
  <a-modal v-model:open="visible" title="数据源字段" @cancel="close" @ok="save">
    <section class="overflow-auto h-[70vh]">
      <a-form ref="formRef" :model="data" :rules="rules">
        <a-form-item label="函数字段">
          <a-switch :checked="isFunction" @change="functionSwitch" />
        </a-form-item>
        <a-form-item v-if="!isFunction" label="字段" name="field">
          <FieldSelect v-model="data.field" @change="data.label = $event.label" />
        </a-form-item>
        <a-form-item v-if="label" label="标签" name="label">
          <a-input v-model:value="data.label" />
        </a-form-item>
        <a-form-item v-if="isFunction" label="函数表达式" name="fun">
          {{ data.fun?.toString() }}
        </a-form-item>
        <Fn ref="fnRef" v-model="data.fun" v-if="isFunction" />
      </a-form>
      <section>
        <b>使用数据源字段：</b>
        <a-tag
          v-for="(f, i) in fields"
          :key="i"
          class="group !inline-flex items-center cursor-pointer"
          @click="data = new DataField(f.field, f.label, f.fun)"
        >
          <a-tooltip :title="f.name">
            <span><Icon v-if="f.fun" icon="i-fluent:braces-24-filled" /> {{ f.label }}</span>
          </a-tooltip>
        </a-tag>
      </section>
    </section>
  </a-modal>
</template>
