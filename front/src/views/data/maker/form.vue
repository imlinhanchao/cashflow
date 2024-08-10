<script setup lang="ts">
  import { DataSource } from '@/api/data';
  import Field from './field.vue';

  const props = withDefaults(
    defineProps<{
      modelValue?: DataSource;
    }>(),
    {},
  );

  const data = ref(props.modelValue || new DataSource());
  const fieldRef = ref<InstanceType<typeof Field>>();
</script>

<template>
  <a-form :model="data">
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
      <a-tag v-for="(f, i) in data.fields" :key="i" closable class="group !inline-flex items-center">
        <a-tooltip :title="f.fun?.toString()"><span>{{ f.label }}</span></a-tooltip>
        <Icon class="!group-hover:inline !hidden cursor-pointer" icon="fluent:edit-20-regular" @click="fieldRef?.open(f).then((f) => data.fields[i] = f)" />
      </a-tag>
      <Field ref="fieldRef" />
    </a-form-item>
  </a-form>
</template>
