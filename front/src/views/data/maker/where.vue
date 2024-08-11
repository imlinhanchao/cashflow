<script setup lang="ts">
  import { enumField } from '@/api/cashflow';
  import { SQLWhere } from '@/api/data';
  import Where from './where.vue';
  import FieldSelect from './fieldSelect.vue';

  const model = defineModel<SQLWhere>({ required: true });
  const emit = defineEmits(['active']);

  const activeItems = ref<(Recordable<any> | SQLWhere)[]>([]);
  const active = ref(false);
  function activeHandle() {
    active.value = !active.value;
    emit('active', active.value);
  }

  const newItems = ref<{ key: string; val: any }[]>([]);
  const editItems = ref<{ oldKey: string; key: string; val: any }[]>([]);
  const fieldOp = {
    amount: ['gt', 'gte', 'lt', 'lte', 'ne', 'eq'],
    type: ['eq', 'in', 'notIn'],
    counterparty: ['eq', 'ne', 'notIn', 'in', 'like'],
    description: ['like'],
    payment: ['eq', 'ne', 'notIn', 'in', 'like'],
    status: ['eq', 'ne', 'notIn', 'in'],
    category: ['eq', 'notIn', 'in', 'like'],
    orderNumber: ['eq', 'notIn', 'in'],
    merchantNumber: ['eq', 'notIn', 'in'],
    transactionTime: ['gt', 'gte', 'lt', 'lte', 'ne', 'eq', 'notIn', 'in'],
    remark: ['like'],
    from: ['eq', 'ne', 'notIn', 'in'],
  };
  function addWhere(it: { key: string; val: any }) {
    model.value.items.push(it.val);
    newItems.value.splice(newItems.value.indexOf(it), 1);
  }
  function updateWhere(it: { oldKey: string; key: string; val: any }, index) {
    delete model.value.items[index][it.oldKey];
    Object.assign(model.value.items[index], it.val);
    editItems.value.splice(editItems.value.findIndex(e => e.key == it.key), 1);
  }
  function removeActive() {
    activeItems.value.forEach((item) =>
      model.value.items.splice(model.value.items.indexOf(item), 1),
    );
    activeItems.value = [];
  }
  function logicActive(logic) {
    const firstIndex = model.value.items.indexOf(activeItems.value[0]);
    activeItems.value.forEach((item) =>
      model.value.items.splice(model.value.items.indexOf(item), 1),
    );
    model.value.items.splice(firstIndex, 0, new SQLWhere(activeItems.value, logic));
    activeItems.value = [];
  }
</script>

<template>
  <section class="sql-where flex" :class="{ 'pb-5': activeItems.length }">
    <section class="relational flex items-center">
      <span class="flex items-center">
        <span
          class="hover:border hover:border-dashed hover:border-gray-400 item"
          @click="activeHandle"
        >
          {{ model.relational }}
        </span>
        <a-dropdown :trigger="['click']">
          <Icon icon="icon-park:down" class="cursor-pointer" />
          <template #overlay>
            <a-menu selectable :selectedKeys="[model.relational]" @click="model.relational = $event.key">
              <a-menu-item key="and">
                <a href="javascript:;">And</a>
              </a-menu-item>
              <a-menu-item key="or">
                <a href="javascript:;">Or</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <Icon
          :size="12"
          icon="gg:add"
          class="hover:text-blue-500 cursor-pointer"
          @click="newItems.push({ key: '', val: {} })"
        />
      </span>
      <section
        class="w-3 border-l border-t border-b h-full border-[var(--where-line-color)]"
      ></section>
    </section>
    <section class="p-1 px-3">
      <section v-for="(item, i) in model.items" :key="i">
        <section v-if="!item.relational" class="flex flex-col space-y-2">
          <section
            v-for="(val, field) in item"
            :key="field"
            class="formula hover:border hover:border-dashed hover:border-gray-400 item group"
            :class="{ active: activeItems.includes(item) }"
            @click="
              !activeItems.includes(item)
                ? activeItems.push(item)
                : activeItems.splice(activeItems.indexOf(item), 1)
            "
          >
            <span v-if="!editItems.some((e) => field.endsWith(e.key))">
              <span>{{ SQLWhere.formula({ [field]: val }) }}</span>
              <a-button
                class="group-hover:inline hidden"
                type="link"
                size="small"
                @click.stop="editItems.push({ oldKey: field, key: field.split('_').slice(1).join('_'), val: { [field]: val } })"
              >
                <Icon icon="fluent:edit-20-regular" size="12" />
              </a-button>
            </span>
            <span v-else class="formula flex flex-nowrap" @click.stop>
              <FieldSelect
                v-model="editItems.find((e) => field == e.oldKey)!.key"
                placeholder="字段"
                class="!w-26"
                size="small"
              />
              <FieldInput
                v-if="editItems.find((e) => field == e.oldKey)?.key"
                :field="editItems.find((e) => field == e.oldKey)!.key"
                :query="editItems.find((e) => field == e.oldKey)!.val"
                :pre="fieldOp[editItems.find((e) => field == e.oldKey)!.key]"
                size="small"
                :search="enumField"
                :prefix="field.split('_')[0]"
              />
              <a-button size="small" type="link" @click.stop="updateWhere(editItems.find(e => field == e.oldKey)!, i)">
                <Icon icon="ic:baseline-check" />
              </a-button>
              <a-button size="small" type="link" @click.stop="editItems.splice(editItems.findIndex(e => field == e.oldKey), 1)">
                <Icon icon="ic:baseline-close" />
              </a-button>
            </span>
          </section>
        </section>
        <Where
          v-else
          v-model="item as SQLWhere"
          :class="{ active: activeItems.includes(item) }"
          @active="
            $event ? activeItems.push(item) : activeItems.splice(activeItems.indexOf(item), 1)
          "
        />
      </section>
      <section>
        <span v-for="(it, j) in newItems" :key="j" class="formula flex flex-nowrap">
          <FieldSelect v-model="it.key" placeholder="字段" class="!w-26" size="small" />
          <FieldInput
            v-if="it.key"
            :field="it.key"
            :query="it.val"
            :pre="fieldOp[it.key]"
            size="small"
            :search="enumField"
          />
          <a-button size="small" type="link" @click="addWhere(it)"
          ><Icon icon="ic:baseline-check"
          /></a-button>
          <a-button size="small" type="link" @click="newItems.splice(newItems.indexOf(it), 1)"
          ><Icon icon="ic:baseline-close"
          /></a-button>
        </span>
      </section>
      <section class="toolbar absolute">
        <a-tooltip title="OR" v-if="activeItems.length > 1" @click="logicActive('or')">
          <a-button size="small" type="link"><Icon icon="tabler:logic-or" /></a-button>
        </a-tooltip>
        <a-tooltip title="AND" v-if="activeItems.length > 1" @click="logicActive('and')">
          <a-button size="small" type="link"><Icon icon="tabler:logic-and" /></a-button>
        </a-tooltip>
        <a-popconfirm
          title="是否确认删除选中条件?"
          ok-text="是"
          cancel-text="否"
          @confirm="removeActive"
        >
          <span>
            <a-tooltip title="删除" v-if="activeItems.length > 0" @click="removeActive">
              <a-button size="small" type="link"><Icon icon="tabler:trash-x" /></a-button>
            </a-tooltip>
          </span>
        </a-popconfirm>
      </section>
    </section>
  </section>
</template>
<style lang="less" scoped>
  @import '@/assets/style/color.less';
  .sql-where {
    --where-line-color: #aaa;
  }
  .relational {
    > span {
      &::after {
        content: '-';
        color: var(--where-line-color);
      }
    }
  }

  .item {
    cursor: pointer;
    padding: 2px 4px;
    display: inline-block;
  }

  .active {
    border: 1px dashed @primary-color;
  }
</style>
