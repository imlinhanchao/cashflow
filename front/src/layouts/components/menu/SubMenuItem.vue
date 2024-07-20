<script lang="ts" setup name="SubMenuItem">
  import BasicMenuItem from './MenuItem.vue';
  import MenuItemContent from './MenuItemContent.vue';
  withDefaults(defineProps<{
    icon?: string;
    name: string;
    item: any;
  }>(), {})

  function menuHasChildren(menuTreeItem): boolean {
    return (
      Reflect.has(menuTreeItem, 'children') &&
      !!menuTreeItem.children &&
      menuTreeItem.children.length > 1
    );
  }
</script>
<template>
  <BasicMenuItem v-if="!menuHasChildren(item)" v-bind="$props" />
  <SubMenu
    v-if="menuHasChildren(item)"
    :key="`submenu-${item.path}`"
    popupClassName="app-top-menu-popup"
  >
    <template #title>
      <MenuItemContent v-bind="$props" :item="item" />
    </template>

    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <SubMenuItem v-bind="$props" :item="childrenItem" :name="childrenItem.meta.title" />
    </template>
  </SubMenu>
</template>