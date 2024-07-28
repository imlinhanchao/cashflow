<script setup lang="tsx">
  import { EnumFieldRsp, EnumQuery } from '@/api/common';

  const props = withDefaults(
    defineProps<{
      field?: string;
      query?: any;
      search?: (params: EnumQuery) => Promise<EnumFieldRsp[]>;
      pre: ('between' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ne' | 'eq' | 'in' | 'notIn')[];
    }>(),
    {
      pre: () => ['like', 'eq'],
      field: '',
      query: () => ({}),
    },
  );
  const emit = defineEmits(['prefix'])

  const options = ref<EnumFieldRsp[]>([]);
  const data = ref(props.query);
  const prefix = ref(props.pre[0]);
  const prefixs = reactive({
    between: '~',
    gt: '>',
    gte: '≥',
    lt: '<',
    lte: '≤',
    like: '%',
    ne: '≠',
    eq: '=',
    in: '[ ]',
    notIn: '![ ]',
  });
  const prefixMeans = reactive({
    between: '之间',
    gt: '大于',
    gte: '大于等于',
    lt: '小于',
    lte: '小于等于',
    like: '模糊',
    ne: '不等于',
    eq: '等于',
    in: '包含',
    notIn: '不包含',
  });

  function searchField(value: string) {
    props.search?.(new EnumQuery(props.field, value)).then((res) => {
      options.value = res;
    });
  }

  watch(prefix, (n, o) => {
    let oldValue = data.value[o + '_' + props.field];
    delete data.value[o + '_' + props.field];
    if (!oldValue) return;
    if (!['in', 'notIn'].includes(o) && ['in', 'notIn'].includes(n)) {
      data.value[n + '_' + props.field] = [oldValue];
    } else if (['in', 'notIn'].includes(o) && !['in', 'notIn'].includes(n)){
      data.value[n + '_' + props.field] = oldValue[0] || '';
    } else {
      data.value[n + '_' + props.field] = oldValue;
    }
  })

  onMounted(() => {
    searchField('');
  });

</script>
<template>
  <a-input-group compact>
    <slot :query="data" :prefix="prefix" :field="field" :options="options" :search="searchField">
      <template v-if="field">
        <a-auto-complete
          v-if="!['in', 'notIn'].includes(prefix)"
          class="!w-40"
          v-model:value="data[prefix ? prefix + '_' + field : field]"
          :options="options"
          @search="searchField"
          allowClear
        />
        <a-select
          v-else
          v-model:value="data[prefix + '_' + field]"
          show-search
          mode="multiple"
          :max-tag-count="2"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :options="options"
          @search="searchField"
          allowClear
          class="min-w-30"
        >
          <template #maxTagPlaceholder="values">
            <a-tooltip :title="values.map(v => v.value).join(', ')">
              <span>+ {{ values.length }} ...</span>
            </a-tooltip>
          </template>
        </a-select>
      </template>
      <span v-else>缺少 Field，请自定义组件</span>
    </slot>
    <a-select v-if="pre.length > 1" v-model:value="prefix" class="w-14" @change="emit('prefix', $event)">
      <a-select-option v-for="p in pre" :key="p" :value="p" :label="prefixs[p]">
        <a-tooltip :title="prefixMeans[p]"><section>{{ prefixs[p] }}</section></a-tooltip>
      </a-select-option>
    </a-select>
  </a-input-group>
</template>
