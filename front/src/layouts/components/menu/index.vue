<script setup lang="ts">
  import { asyncRoutes } from '@/router/routes';
  import SubMenuItem from './SubMenuItem.vue';

  const collapsed = ref(false);
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value;
  };
  function onClose() {
    collapsed.value = false;
  }

  const menus = computed(() => asyncRoutes.filter((route) => !route.meta?.hidden));

  const selectedKeys = ref<string[]>([]);
  const openKeys = ref<string[]>([]);
  const defaultSelectedKeys = ref<string[]>([]);

  function handleOpenChange(keys: string[]) {
    openKeys.value = keys;
  }

  const emit = defineEmits(['menuClick']);
  function handleMenuClick({ key }) {
    selectedKeys.value = [key];
    emit('menuClick', key);
  }
</script>

<template>
  <section>
    <a-button block type="text" @click="toggleCollapsed">
      <Icon icon="ant-design:menu-unfold-outlined" v-if="collapsed" />
      <Icon icon="ant-design:menu-fold-outlined" v-else />
    </a-button>
    <a-drawer
      placement="left"
      class="!w-50"
      :closable="false"
      :open="collapsed"
      @close="onClose"
      :bodyStyle="{ padding: 0 }"
    >
      <a-menu
        :selectedKeys="selectedKeys"
        :defaultSelectedKeys="defaultSelectedKeys"
        :openKeys="openKeys"
        :inlineIndent="20"
        @open-change="handleOpenChange"
        @click="handleMenuClick"
        :subMenuOpenDelay="0.2"
        class="!border-none"
      >
        <SubMenuItem :item="item" v-for="item in menus" :key="item.name" :name="item.meta.title" :icon="item.meta.icon" />
      </a-menu>
    </a-drawer>
  </section>
</template>