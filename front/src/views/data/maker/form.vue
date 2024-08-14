<script setup lang="ts">
  import { DataSource } from '@/api/data';
  import { advancedSearch } from '@/api/cashflow';
  import Field from './field.vue';
  import Where from './where.vue';
  import { FormInstance } from 'ant-design-vue';
  import FieldSelect from './fieldSelect.vue';
  import Order from './order.vue';

  const props = withDefaults(
    defineProps<{
      modelValue?: DataSource;
    }>(),
    {},
  );
  const emit = defineEmits<{
    (ev: 'update:modelValue', value: DataSource): void;
    (ev: 'confirm', value: DataSource): void;
    (ev: 'query', data: any[]): void;
  }>();

  watch(() => props.modelValue, (val) => {
    if (val) data.value = val;
  });

  const data = ref(props.modelValue || new DataSource());
  const fieldRef = ref<InstanceType<typeof Field>>();
  const orderRef = ref<InstanceType<typeof Order>>();

  const formRef = ref<FormInstance>();
  const rules = ref({
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    fields: [{ required: true, message: '请输入字段', trigger: 'blur', type: 'array' }],
  });
  const editWhere = ref(false);

  async function save() {
    if (!(await formRef.value?.validate())) return;
    emit('update:modelValue', data.value);
    emit('confirm', data.value);
  }

  async function test() {
    if (!(await formRef.value?.validate())) return;
    console.log(data.value);
    advancedSearch(data.value).then((res) => {
      emit('query', res);
    });
  }
</script>

<template>
  <a-form ref="formRef" :model="data" :rules="rules" :labelCol="{ span: 2 }">
    <a-form-item label="名称" name="name">
      <a-input v-model:value="data.name" />
    </a-form-item>
    <a-form-item label="描述" name="description">
      <a-textarea v-model:value="data.description" />
    </a-form-item>
    <a-form-item label="字段" name="fields">
      <a-button type="link" @click="fieldRef?.open().then((f) => data.fields.push(f))">
        <Icon icon="ic:outline-add-circle" />
      </a-button>
      <a-tag
        v-for="(f, i) in data.fields"
        :key="i"
        closable
        class="group !inline-flex items-center"
        @close="data.fields.splice(i, 1)"
      >
        <a-tooltip :title="f.fun?.toString()"
        ><span>{{ f.label }}</span></a-tooltip
        >
        <Icon
          class="!group-hover:inline !hidden cursor-pointer"
          icon="fluent:edit-20-regular"
          @click="fieldRef?.open(f).then((f) => (data.fields[i] = f))"
        />
      </a-tag>
      <Field ref="fieldRef" />
    </a-form-item>
    <a-form-item label="条件">
      <span>{{ data.where.toString() }}</span>
      <a-button type="link" @click="editWhere = !editWhere">
        <Icon class="cursor-pointer ml-5" icon="fluent:edit-20-regular" />
      </a-button>
    </a-form-item>
    <Transition name="fade-slide">
      <KeepAlive
      ><Where
        v-if="editWhere"
        v-model="data.where"
        class="mb-3 rounded-md bg-white border-1 border-black border-dashed py-2"
      /></KeepAlive>
    </Transition>
    <a-form-item label="排序">
      <a-button type="link" @click="orderRef?.open().then((f) => data.order.push(f))">
        <Icon icon="ic:outline-add-circle" />
      </a-button>
      <a-tag v-for="(f, i) in data.order" :key="i" closable class="group !inline-flex items-center">
        <a-tooltip :title="f.fun?.toString()"
        ><span>{{ f.field || f.fun?.toString() }}</span></a-tooltip
        >
        <Icon icon="ri:sort-alphabet-asc" v-if="f.order == 'ASC'" />
        <Icon icon="ri:sort-alphabet-desc" v-if="f.order == 'DESC'" />
        <Icon
          class="!group-hover:inline !hidden cursor-pointer"
          icon="fluent:edit-20-regular"
          @click="orderRef?.open(f).then((f) => (data.order[i] = f))"
        />
      </a-tag>
      <Order ref="orderRef" />
    </a-form-item>
    <a-form-item label="分组">
      <FieldSelect v-model="data.group" mode="multiple" />
    </a-form-item>
    <a-form-item label="起始">
      <a-input v-model:value="data.index" allowClear type="number" />
    </a-form-item>
    <a-form-item label="数量">
      <a-input v-model:value="data.count" allowClear type="number" />
    </a-form-item>
    <section class="space-x-3 text-center">
      <a-button type="primary" @click="save">确定</a-button>
      <a-button @click="test">测试</a-button>
    </section>
  </a-form>
</template>
