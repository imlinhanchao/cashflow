<script setup lang="ts">
  import { advancedSearch } from '@/api/cashflow';
  import { DataSource, search } from '@/api/data';
  import { IReport, Report } from '@/api/report';
  import CodeEditor, { MODE } from '@/components/CodeEditor';
  import { FormInstance } from 'ant-design-vue';

  const props = withDefaults(
    defineProps<{
      modelValue?: IReport;
    }>(),
    {},
  );

  const emit = defineEmits<{
    (ev: 'update:modelValue', value: IReport): void;
    (ev: 'confirm', value: IReport): void;
    (ev: 'preview', options: any): void;
  }>();

  watch(
    () => props.modelValue,
    (val) => {
      if (val) {
        data.value = val;
        data.value.datasrcId = val.datasrc.id;
      }
    },
  );

  const data = ref<IReport>(props.modelValue || (new Report() as IReport));
  const datasrcList = ref<DataSource[]>([]);
  function getDataSrc(value: string) {
    search({ page: 1, size: 10, like_name: value }).then((res) => {
      datasrcList.value = res.rows;
    });
  }
  getDataSrc('');
  function chooseDataSrc(value: string) {
    data.value.datasrc = datasrcList.value.find((item) => item.id === value)!;
  }

  const codeRef = ref<InstanceType<typeof CodeEditor>>();
  const dataFields = computed(() => data.value.datasrc?.fields.map((item) => item.label) ?? []);
  function pushField(field: string) {
    pushCode(`\#{${field}}`);
  }
  function pushCode(code: string) {
    codeRef.value?.replace(code);
  }

  async function onPreview() {
    const table = await advancedSearch(data.value.datasrc);
    let options = data.value.options
      .replace(/\#\{.*?\}/g, (field) => {
        const label = field.slice(2, -1);
        return `($data.map(row => row['${label}']))`;
      })
      .replace(
        /\#\[二维表\]/g,
        `($data.map(row => [${dataFields.value.map((field) => `row['${field}']`).join(', ')}]))`,
      );

    const getOptions = new Function('$data', `${options}\nreturn option;`);

    emit('preview', getOptions(table));
  }

  const formRef = ref<FormInstance>();
  const rules = ref({
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    datasrcId: [{ required: true, message: '请选择数据源', trigger: 'blur' }],
    options: [{ required: true, message: '请编写 Echart 配置', trigger: 'blur' }],
  });
  async function save() {
    if (!(await formRef.value?.validate())) return;
    emit('update:modelValue', data.value);
    emit('confirm', data.value);
  }
</script>

<template>
  <a-form ref="formRef" :model="data" :rules="rules" :labelCol="{ span: 2 }">
    <a-form-item label="名称" name="name">
      <a-input v-model:value="data.name" />
    </a-form-item>
    <a-form-item label="描述" name="description">
      <a-input v-model:value="data.description" />
    </a-form-item>
    <a-form-item label="数据源" name="datasrcId">
      <a-select
        v-model:value="data.datasrcId"
        show-search
        :max-tag-count="2"
        :default-active-first-option="false"
        :filter-option="false"
        :not-found-content="null"
        :options="datasrcList"
        @search="getDataSrc"
        :fieldNames="{ label: 'name', value: 'id' }"
        @change="chooseDataSrc"
        allowClear
      />
    </a-form-item>
    <a-form-item label="Echart 配置" name="options">
      <section class="flex-column">
        <section class="flex justify-between pb-2 px-2">
          <section class="space-x-2">
            <a-button
              :title="`$table.map(row => row['${field}'])`"
              type="primary"
              ghost
              v-for="field in dataFields"
              :key="field"
              size="small"
              @click="pushField(field)"
            >
              #{<span>{{ field }}</span
              >}
            </a-button>
            <a-button type="primary" ghost size="small" @click="pushCode('#[二维表]')">
              #[二维表]
            </a-button>
          </section>
          <section class="space-x-2">
            <a-button size="small" type="primary" @click="data.options = ''">清空</a-button>
            <a-button size="small" type="primary" :disabled="!data.datasrcId" @click="onPreview">
              预览
            </a-button>
          </section>
        </section>
        <section class="rounded border border-gray-300">
          <section class="font-mono p-1 whitespace-pre-wrap">
            <span class="text-#7a3e9d">function </span>
            <span class="text-#aa3731 font-bold">getOptions </span>
            <span class="text-#0431fa">(<span class="text-#7a3e9d">$data</span>) {</span>
          </section>
          <CodeEditor
            ref="codeRef"
            class="border border-gray-300 rounded overflow-hidden -mx-[1px]"
            v-model:value="data.options"
            :mode="MODE.JAVASCRIPT"
          />
          <section class="font-mono indent-42px p-1">
            <span class="text-#4b69c6">return </span>
            <span class="text-#7a3e9d"> option<b>;</b> </span>
            <br />
            <span class="text-#7a3e9d">}</span>
          </section>
        </section>
      </section>
    </a-form-item>
    <a-form-item label="是否公开">
      <a-switch v-model:check="data.public" />
    </a-form-item>
    <section class="space-x-3 text-center">
      <a-button type="primary" @click="save">确定</a-button>
    </section>
  </a-form>
</template>
