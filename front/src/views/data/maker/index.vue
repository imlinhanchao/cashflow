<script setup lang="ts">
  import { create, DataSource, getDetail } from '@/api/data';
  import DataView from './dataView.vue';
  import DataForm from './form.vue';
  import { message } from 'ant-design-vue';

  const router = useRouter();
  const route = useRoute();

  const data = ref<any[]>([]);
  const source = ref<DataSource>();
  async function save(data: DataSource) {
    await create([data]);
    message.success('保存成功！');
    router.replace('/data');
  }

  if (route.params.id) {
    getDetail(route.params.id as string).then((res) => {
      source.value = Object.assign(new DataSource(), res);
    });
  }
</script>

<template>
  <article class="flex h-full space-x-2">
    <section class="flex-1 h-full overflow-auto">
      <DataForm v-model="source" @query="data = $event" @confirm="save" />
    </section>
    <section class="flex-1 h-full overflow-auto relative">
      <DataView :data="data" />
    </section>
  </article>
</template>
