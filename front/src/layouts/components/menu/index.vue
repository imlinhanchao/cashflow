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
  function getActiveMenu() {
    menus.value.forEach((menu) => {
      if (menu.children && menu.children.length > 1) {
        menu.children.forEach((child) => {
          if (child.name === route.name && !route.meta.hidden) {
            selectedKeys.value = [child.path];
            openKeys.value = [menu.path];
          } else if (child.name === route.name) {
            selectedKeys.value = [menu.path];
            openKeys.value = [menu.path];
          }
        });
      } else if (menu.name === route.name || menu.children?.[0]?.name === route.name) {
        selectedKeys.value = [menu.path];
      }
    });
  }

  const route = useRoute();
  const selectedKeys = ref<string[]>([]);
  const openKeys = ref<string[]>([]);
  const defaultSelectedKeys = ref<string[]>([]);

  onMounted(() => {
    getActiveMenu();
  })

  function handleOpenChange(keys: string[]) {
    openKeys.value = keys;
  }

  const emit = defineEmits(['menuClick']);
  function handleMenuClick({ key }) {
    selectedKeys.value = [key];
    emit('menuClick', key);
    collapsed.value = false;
  }
</script>

<template>
  <section class="flex items-center">
    <a-button type="link" @click="toggleCollapsed" class="!text-inherit hover:text-primary">
      <Icon icon="ri:menu-fold-3-fill" v-if="collapsed" size="20" />
      <Icon icon="ri:menu-unfold-3-fill" v-else size="20" />
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