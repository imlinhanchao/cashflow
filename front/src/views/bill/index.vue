<script setup lang="ts">
  import { Cashflow, enumField, search, remove as removeItem, exportBill } from '@/api/cashflow';
  import { columns } from './index';
  import Item from './item.vue';
  import { message } from 'ant-design-vue';
import { downloadByAxios } from '@/utils/file/download';

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

  const query = ref<any>({ type: '', eq_from: '' });
  function queryTable() {
    return search({ ...query.value, ...page }).then((res) => {
      data.value = res.rows;
      page.total = res.total;
    });
  }
  function reset() {
    query.value = { type: '', eq_from: '' };
    page.page = 1;
    queryTable();
  }
  function remove(record) {
    removeItem(record.id).then(() => {
      queryTable();
      message.success('删除成功！');
    });
  }
  async function exportData() {
    await downloadByAxios(await exportBill({ ...query.value }));
    message.success('导出成功！');
  }

  onMounted(() => {
    queryTable();
  });

  const itemRef = ref<InstanceType<typeof Item>>();
  const froms = reactive([
    { value: 'alipay', title: '支付宝', icon: 'ant-design:alipay-outlined' },
    { value: 'wepay', title: '微信支付', icon: 'ri:wechat-pay-line' },
    { value: 'bank', title: '银行卡', icon: 'ion:card' },
    { value: 'card', title: '信用卡', icon: 'majesticons:creditcard-hand-line' },
    { value: 'cash', title: '现金', icon: 'la:money-bill-alt' },
  ]);
</script>

<template>
  <article class="flex flex-col h-full">
    <header class="pb-2">
      <a-form class="no-error !flex-nowrap justify-between" layout="inline">
        <section class="flex flex-wrap space-y-2">
          <a-form-item class="my-2">
            <FieldInput
              field="from"
              :search="enumField"
              :query="query"
              :pre="['eq', 'in', 'notIn']"
            >
              <template #default="{ prefix }">
                <a-select
                  allowClear
                  v-model:value="query[prefix + '_from']"
                  :max-tag-count="1"
                  :mode="prefix == 'eq' ? 'combobox' : 'multiple'"
                  :class="{ 'w-36': prefix != 'eq', 'w-20': prefix == 'eq' }"
                >
                  <a-select-option v-if="prefix == 'eq'" value="">全部</a-select-option>
                  <a-select-option v-for="f in froms" :key="f.value" :value="f.value">
                    <a-tooltip :title="prefix != 'eq' ? '' : f.title">
                      <section class="flex h-full items-center space-x-1 justify-between">
                        <Icon :icon="f.icon" />
                        <span v-if="prefix != 'eq'">{{ f.title }}</span>
                      </section>
                    </a-tooltip>
                  </a-select-option>
                  <template v-if="prefix != 'eq'" #tagRender="{ value, closable, onClose }">
                    <a-tag
                      v-if="froms.find((f) => f.value == value)"
                      :closable="closable"
                      style="margin-right: 3px"
                      @close="onClose"
                    >
                      <Icon :icon="froms.find((f) => f.value == value)!.icon" />
                    </a-tag>
                  </template>
                  <template v-if="prefix != 'eq'" #maxTagPlaceholder="values">
                    <a-tooltip
                      :title="
                        froms
                          .filter((f) => values.some((v) => v.value == f.value))
                          .map((f) => f.title)
                          .join(', ')
                      "
                    >
                      <span>+ {{ values.length }} ...</span>
                    </a-tooltip>
                  </template>
                </a-select>
              </template>
            </FieldInput>
          </a-form-item>
          <a-form-item label="收/支">
            <a-select v-model:value="query.type" class="!w-26">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="收入">收入</a-select-option>
              <a-select-option value="支出">支出</a-select-option>
              <a-select-option value="不计收支">不计收支</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="交易状态" class="my-2">
            <FieldInput
              field="status"
              :search="enumField"
              :query="query"
              :pre="['like', 'eq', 'in', 'notIn']"
            />
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
              <a-date-picker
                show-time
                v-model:value="query.gte_transactionTime"
                allowClear
                class="max-w-[35vw]"
                valueFormat="YYYY-MM-DD HH:mm:ss"
              />
              <span>~</span>
              <a-date-picker
                show-time
                v-model:value="query.lte_transactionTime"
                allowClear
                class="max-w-[35vw]"
                valueFormat="YYYY-MM-DD HH:mm:ss"
              />
            </section>
          </a-form-item>
          <a-form-item label="交易分类">
            <FieldInput
              field="category"
              :search="enumField"
              :query="query"
              :pre="['like', 'eq', 'in', 'notIn']"
            />
          </a-form-item>
          <a-form-item label="支付方式">
            <FieldInput
              field="payment"
              :search="enumField"
              :query="query"
              :pre="['like', 'eq', 'in', 'notIn']"
            />
          </a-form-item>
          <a-form-item label="交易对方">
            <FieldInput
              field="counterparty"
              :search="enumField"
              :query="query"
              :pre="['like', 'eq', 'in', 'notIn']"
            />
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
              <Icon icon="i-ion:search-sharp" />
            </a-button>
          </a-tooltip>
          <a-tooltip title="导出">
            <a-button type="primary" shape="circle" @click="exportData">
              <Icon icon="i-hugeicons:file-export" />
            </a-button>
          </a-tooltip>
          <a-tooltip title="重置">
            <a-button type="primary" shape="circle" @click="reset">
              <Icon icon="i-icon-park-outline:clear" />
            </a-button>
          </a-tooltip>
          <a-tooltip title="添加交易">
            <a-button type="primary" shape="circle" @click="itemRef?.open()">
              <Icon icon="i-ic:sharp-post-add" />
            </a-button>
          </a-tooltip>
        </section>
      </a-form>
    </header>
    <main class="flex-1 overflow-auto min-h-[50vh]">
      <a-table sticky :columns="columns" :data-source="data" :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'from'">
            <Icon
              v-if="froms.find((f) => f.value == record.from)"
              :icon="froms.find((f) => f.value == record.from)!.icon"
            />
            <span v-else>{{ record.from }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-tooltip title="编辑">
              <a-button type="link" @click="itemRef?.open(record)" class="!px-2">
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
    <Item ref="itemRef" @confirm="queryTable" />
  </article>
</template>

<style lang="less" scoped>
  .ant-table-wrapper {
    :deep(.ant-pagination) {
      margin-bottom: 0;
      padding-right: 1em;
      z-index: 2;
    }
  }
</style>
