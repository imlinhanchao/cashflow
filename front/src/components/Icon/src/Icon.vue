<script setup lang="ts">
  import { computed, unref, RenderFunction } from 'vue';
  import { isNumber, isString, isObject, isFunction } from '@/utils';

  const props = withDefaults(
    defineProps<{
      icon: string | Recordable | RenderFunction;
      color?: string;
      size?: number | string;
    }>(),
    {
      icon: '',
      size: 16
    },
  );

  const isComp = computed(
    () =>
      isObject(props.icon) ||
      isFunction(props.icon) ||
      (isString(props.icon) && props.icon.startsWith(`ant-icon-`)),
  );

  const isSVG = computed(() => isString(props.icon) && props.icon.startsWith('svg-icon:'));
  const symbolId = computed(() => {
    return isString(props.icon) && unref(isSVG)
      ? `#icon-${props.icon.split('svg-icon:')[1]}`
      : props.icon;
  });

  // iconify
  const iconifyClass = computed(() => {
    if (unref(isComp) || unref(isSVG) || !props.icon || !isString(props.icon)) return '';

    if (!props.icon.startsWith('i-')) console.error(`Iconify图标 ${props.icon} 需以 i- 开头`);

    return props.icon;
  });

  const fontSize = computed(() => {
    return isNumber(props.size) || !isNaN(Number(props.size)) ? `${props.size}px` : props.size;
  });
</script>

<template>
  <i class="com-icon" :style="{ fontSize, color }">
    <!-- 组件：对象/函数/ant-icon-xxx -->
    <component v-if="isComp" :is="icon" />

    <!-- svg图标 -->
    <svg v-else-if="isSVG" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>

    <!-- iconify图标 -->
    <span v-else :class="iconifyClass"></span>
  </i>
</template>

<style lang="less">
  .com-icon {
    --color: inherit;
    height: 1em;
    width: 1em;
    line-height: 1em;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    fill: currentColor;
    color: var(--color);
    font-size: inherit;
    vertical-align: -0.2em;
  }
</style>
