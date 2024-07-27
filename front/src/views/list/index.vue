<script setup lang="ts">
  import {
    Cashflow,
    CashflowQuery,
    enumField,
    EnumFieldRsp,
    EnumQuery,
    query as queryList,
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

  const query = reactive(new CashflowQuery());
  function queryTable() {
    return queryList({ ...query, ...page }).then((res) => {
      data.value = res.rows;
      page.total = res.total;
    });
  }
  function reset() {
    Object.assign(query, new CashflowQuery());
    page.page = 1;
    queryTable();
  }

  onMounted(() => {
    queryTable();
    Object.keys(autoOption.value).forEach((k) => {
      searchField(k, '', autoOption.value[k]);
    });
  });

  const autoOption = ref<Recordable<EnumFieldRsp[]>>({
    category: [],
    payment: [],
    counterparty: [],
    status: [],
    description: [],
  });
  function searchField(key: string, value: string, options: EnumFieldRsp[]) {
    enumField(new EnumQuery(key, value)).then((res) => {
      options.splice(0, options.length, ...res);
    });
  }
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
            <a-auto-complete
              class="!w-40"
              v-model:value="query.status"
              :options="autoOption.status"
              @search="searchField('status', $event, autoOption.status)"
              allowClear
            />
          </a-form-item>
          <a-form-item label="金额">
            <section class="flex items-center space-x-1">
              <a-input-number v-model:value="query.amountMin" />
              <span>~</span>
              <a-input-number v-model:value="query.amountMax" />
            </section>
          </a-form-item>
          <a-form-item label="交易时间">
            <section class="flex items-center space-x-1">
              <a-date-picker show-time v-model:value="query.transactionTimeStart" allowClear />
              <span>~</span>
              <a-date-picker show-time v-model:value="query.transactionTimeEnd" allowClear />
            </section>
          </a-form-item>
          <a-form-item label="交易分类">
            <a-auto-complete
              class="!w-40"
              v-model:value="query.category"
              :options="autoOption.category"
              @search="searchField('category', $event, autoOption.category)"
              allowClear
            />
          </a-form-item>
          <a-form-item label="支付方式">
            <a-auto-complete
              class="!w-40"
              v-model:value="query.payment"
              :options="autoOption.payment"
              @search="searchField('payment', $event, autoOption.payment)"
              allowClear
            />
          </a-form-item>
          <a-form-item label="交易对方">
            <a-auto-complete
              class="!w-40"
              v-model:value="query.counterparty"
              :options="autoOption.counterparty"
              @search="searchField('counterparty', $event, autoOption.counterparty)"
              allowClear
            />
          </a-form-item>
          <a-form-item label="商品说明">
            <a-auto-complete
              class="!w-40"
              v-model:value="query.description"
              :options="autoOption.description"
              @search="searchField('description', $event, autoOption.description)"
              allowClear
            />
          </a-form-item>
          <a-form-item label="商家订单号">
            <a-input v-model:value="query.merchantNumber" allowClear />
          </a-form-item>
          <a-form-item label="交易订单号">
            <a-input v-model:value="query.orderNumber" allowClear />
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
      margin-right: 1em;
    }
  }
</style>
