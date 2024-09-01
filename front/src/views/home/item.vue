<script setup lang="ts">
  import { advancedSearch } from '@/api/cashflow';
  import { IHome } from '@/api/home';
  import { IReport } from '@/api/report';
  import Chart from '@/views/report/chart.vue';

  const props = withDefaults(
    defineProps<{
      editable: boolean;
      searchReport: (keyword: string) => Promise<IReport[]>;
    }>(),
    {
      editable: false,
    },
  );
  const emit = defineEmits<{
    (ev: 'remove', value: IHome): void;
  }>();

  const data = defineModel<IHome>({ required: true });
  const reports = ref<IReport[]>([]);
  function onSearch(keyword: string) {
    props.searchReport(keyword).then((res) => {
      reports.value = res;
    });
  }
  function onChoose(value: string) {
    data.value.report = reports.value.find((item) => item.id === value)!;
    updateOptions(data.value.report);
  }

  const chartOptions = ref<any>();
  const dataFields = computed(
    () => data.value.report?.datasrc?.fields.map((item) => item.label) ?? [],
  );
  async function updateOptions(report: IReport) {
    const table = await advancedSearch(report.datasrc);
    let options = report.options
      .replace(/\#\{.*?\}/g, (field) => {
        const label = field.slice(2, -1);
        return `($data.map(row => row['${label}']))`;
      })
      .replace(
        /\#\[二维表\]/g,
        `($data.map(row => [${dataFields.value.map((field) => `row['${field}']`).join(', ')}]))`,
      );

    const getOptions = new Function('$data', `${options}\nreturn option;`);
    chartOptions.value = getOptions(table);
  }

  function remove() {
    emit('remove', data.value);
  }

  onMounted(() => {
    if (props.editable) {
      onSearch('');
    }
    if (data.value.report) {
      updateOptions(data.value.report);
    }
  });
</script>

<template>
  <article class="flex flex-col h-full p-2">
    <header v-if="editable" class="flex justify-between w-full">
      <section class="flex-1">
        <a-select
          v-model:value="data.reportId"
          show-search
          :default-active-first-option="false"
          :filter-option="false"
          :not-found-content="null"
          :options="reports"
          @search="onSearch"
          :fieldNames="{ label: 'name', value: 'id', options: 'children' }"
          @change="onChoose"
          allowClear
          class="!w-full"
        />
      </section>
      <section class="flex-1 flex justify-end">
        <a-button type="link" danger shape="circle" @click="remove">
          <Icon icon="i-gg:trash" />
        </a-button>
      </section>
    </header>
    <main class="flex flex-1 items-center justify-center">
      <Chart v-if="data.reportId && chartOptions" :options="chartOptions" />
      <section
        v-else-if="editable"
        class="flex items-center flex-col text-gray-500 text-xl cursor-pointer"
      >
        <Icon icon="i-solar:pie-chart-bold" class="!text-4xl" />
        <span>待配置</span>
      </section>
    </main>
  </article>
</template>
