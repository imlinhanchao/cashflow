<script setup lang="ts">
  import {
    Cashflow,
    enumField,
    search,
  } from '@/api/cashflow';
  import { columns } from './index';

  const data = ref<Cashflow[]>([]);
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

  const query = ref<any>({ type: '' });
  function queryTable() {
    return search({ ...query.value, ...page }).then((res) => {
      data.value = res.rows;
      page.total = res.total;
    });
  }
  function reset() {
    query.value = { type: '' };
    page.page = 1;
    queryTable();
  }

  onMounted(() => {
    queryTable();
  });

</script>

<template>
  <article class="flex flex-col h-full">
    <header class="pb-2">
      <a-form class="no-error !flex-nowrap justify-between" layout="inline">
        <section class="flex flex-wrap space-y-2">
          <a-form-item label="收/支" class="my-2">
            <a-select v-model:value="query.type" style="width: 100px">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="收入">收入</a-select-option>
              <a-select-option value="支出">支出</a-select-option>
              <a-select-option value="不计收支">不计收支</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="交易状态" class="my-2">
            <FieldInput field="status" :search="enumField" :query="query" :pre="['like', 'eq', 'in', 'notIn']" />
          </a-form-item>
          <a-form-item label="金额">
            <section class="flex items-center space-x-1">
              <a-input-number v-model:value="query.gte_amount" />
              <span>~</span>
              <a-input-number v-model:value="query.lte_amount" />
            </section>
          </a-form-item>
          <a-form-item label="交易时间">
            <section class="flex items-center space-x-1">
              <a-date-picker show-time v-model:value="query.gte_transactionTime" allowClear />
              <span>~</span>
              <a-date-picker show-time v-model:value="query.lte_transactionTime" allowClear />
            </section>
          </a-form-item>
          <a-form-item label="交易分类">
            <FieldInput field="category" :search="enumField" :query="query" :pre="['like', 'eq', 'in', 'notIn']" />
          </a-form-item>
          <a-form-item label="支付方式">
            <FieldInput field="payment" :search="enumField" :query="query" :pre="['like', 'eq', 'in', 'notIn']" />
          </a-form-item>
          <a-form-item label="交易对方">
            <FieldInput field="counterparty" :search="enumField" :query="query" :pre="['like', 'eq', 'in', 'notIn']" />
          </a-form-item>
          <a-form-item label="商品说明">
            <FieldInput field="description" :search="enumField" :query="query" :pre="['like']" />
          </a-form-item>
          <a-form-item label="商家订单号">
            <FieldInput field="merchantNumber" :search="enumField" :query="query" />
          </a-form-item>
          <a-form-item label="交易订单号">
            <FieldInput field="orderNumber" :search="enumField" :query="query" />
          </a-form-item>
        </section>
        <section class="flex items-center space-x-2">
          <a-tooltip title="搜索">
            <a-button type="primary" shape="circle" @click="queryTable">
              <Icon icon="ion:search-sharp" />
            </a-button>
          </a-tooltip>
          <a-tooltip title="重置">
            <a-button type="primary" shape="circle" @click="reset">
              <Icon icon="icon-park-outline:clear" />
            </a-button>
          </a-tooltip>
        </section>
      </a-form>
    </header>
    <main class="flex-1 overflow-auto">
      <a-table sticky :columns="columns" :data-source="data" :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'from'">
            <Icon v-if="record.from == 'wepay'" icon="ri:wechat-pay-line" />
            <Icon v-else-if="record.from == 'alipay'" icon="ant-design:alipay-outlined" />
            <span v-else>{{ record.from }}</span>
          </template>
        </template></a-table
      >
    </main>
  </article>
</template>

<style lang="less" scoped>
  .ant-table-wrapper {
    :deep(.ant-pagination) {
      margin-bottom: 0;
      padding-right: 1em;
    }
  }
</style>
