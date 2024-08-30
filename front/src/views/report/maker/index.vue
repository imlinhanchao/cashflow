<script setup lang="ts">
  import { createReport, getReport, IReport, Report, updateReport } from '@/api/report';
  import Chart from '../chart.vue';
  import ReportForm from './form.vue';
  import { DataSource } from '@/api/data';
  import { message } from 'ant-design-vue';

  const options = ref<any>();

  const router = useRouter();
  const route = useRoute();

  const source = ref<IReport>(new Report() as IReport);
  async function save(data: IReport) {
    data.id ? await updateReport(data.id, data) : await createReport([data]);
    message.success('保存成功！');
    router.replace('/report');
  }

  if (route.params.id) {
    getReport(route.params.id as string).then((res) => {
      source.value = res;
      source.value.datasrc = DataSource.from(res.datasrc);
    });
  }
</script>

<template>
  <article class="flex h-full space-x-2">
    <section class="flex-1 h-full overflow-auto">
      <ReportForm v-model="source" @preview="options = $event" @confirm="save" />
    </section>
    <section class="flex-1 h-full overflow-auto relative">
      <Chart :options="options" />
    </section>
  </article>
</template>
