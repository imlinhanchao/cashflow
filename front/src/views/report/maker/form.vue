<script setup lang="ts">
  import { advancedSearch } from '@/api/cashflow';
import { DataSource, search } from '@/api/data';
  import { IReport, Report } from '@/api/report';
  import CodeEditor, { MODE } from '@/components/CodeEditor';

  const emit = defineEmits(['preview']);

  const data = reactive<IReport>(new Report() as IReport);
  const rules = {};
  const datasrcList = ref<DataSource[]>([]);
  function getDataSrc(value: string) {
    search({ page: 1, size: 10, like_name: value }).then((res) => {
      datasrcList.value = res.rows;
    });
  }
  getDataSrc('');
  function chooseDataSrc(value: string) {
    data.datasrc = datasrcList.value.find((item) => item.id === value)!;
  }

  const codeRef = ref<InstanceType<typeof CodeEditor>>();
  const dataFields = computed(() => data.datasrc?.fields.map((item) => item.label) ?? []);
  function pushField(field: string) {
    codeRef.value?.replace(`$[${field}]`);
  }

  async function onPreview() {
    const table = await advancedSearch(data.datasrc);
    let options = data.options.replace(/\$\[.*?\]/g, (field) => {
      const label = field.slice(2, -1);
      return `($table.map(row => row['${label}']))`;
    });
    
    const getOptions = new Function('$table', `return ${options}`);
    
    emit('preview', getOptions(table));
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
    <a-form-item label="数据源" name="dataSrc">
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
            <a-button type="primary" ghost v-for="field in dataFields" :key="field" size="small" @click="pushField(field)">
              $[{{ field }}]
            </a-button>
          </section>
          <section class="space-x-2">
            <a-button size="small" type="primary" @click="data.options = ''">清空</a-button>
            <a-button size="small" type="primary" @click="onPreview">预览</a-button>
          </section>
        </section>
        <CodeEditor ref="codeRef" class="border border-gray-300 rounded overflow-hidden" v-model:value="data.options" :mode="MODE.JAVASCRIPT" />
      </section>
    </a-form-item>
  </a-form>
</template>
