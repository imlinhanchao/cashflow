<script setup lang="ts">
  import { IReport, searchReport, deleteReport } from '@/api/report';
  import { columns } from './index';
  import { message } from 'ant-design-vue';

  const data = ref<IReport[]>([]);
  const page = reactive({
    page: 1,
    size: 50,
    total: 0,
  });
  const pagination = computed(() => ({
    position: 'bottomRight',
    current: page.page,
    pageSize: page.size,
    total: page.total,
    showTotal: (total) => `共 ${total} 笔`,
    class: 'sticky bottom-0 bg-layout py-4',
    'onUpdate:current': (val: number) => {
      page.page = val;
      queryTable();
    },
    'onUpdate:pageSize': (val: number) => {
      page.size = val;
      queryTable();
    },
  }));
  const query = ref<any>({});
  function queryTable() {
    return searchReport({ ...query.value, ...page }).then((res) => {
      data.value = res.rows;
      page.total = res.total;
    });
  }

  function remove(record) {
    deleteReport(record.id).then(() => {
      queryTable();
      message.success('删除成功！');
    });
  }

  onMounted(() => {
    queryTable();
  });
</script>

<template>
  <article class="flex flex-col h-full">
    <header class="pb-2 flex justify-between">
      <section class="flex space-x-2">
        <a-form-item label="名称">
          <FieldInput field="name" :query="query" :pre="['like']" />
        </a-form-item>
        <a-form-item label="描述">
          <FieldInput field="name" :query="query" :pre="['like']" />
        </a-form-item>
        <a-tooltip title="搜索">
          <a-button type="primary" shape="circle" @click="queryTable">
            <Icon icon="i-ion:search-sharp" />
          </a-button>
        </a-tooltip>
      </section>
      <section>
        <a-button type="primary" shape="circle" @click="$router.push('/report/maker')">
          <Icon icon="i-fluent-mdl2:report-add" />
        </a-button>
      </section>
    </header>
    <main>
      <a-table sticky :columns="columns" :data-source="data" :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'fields'">
            <span>{{ record.fields.map((f) => f.label).join(', ') }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-tooltip title="编辑">
              <a-button type="link" @click="$router.push('/report/' + record.id)" class="!px-2">
                <Icon icon="i-fluent:notepad-edit-16-regular" />
              </a-button>
            </a-tooltip>
            <a-popconfirm
              title="你确定要删除这一项吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="remove(record)"
            >
              <a-tooltip title="删除">
                <a-button type="link" danger class="!px-2">
                  <Icon icon="i-gg:trash" />
                </a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </main>
  </article>
</template>
