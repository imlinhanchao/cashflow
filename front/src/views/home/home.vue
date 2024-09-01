<script setup lang="ts">
  import { getHome, IHome } from '@/api/home';
  import { GridLayout, GridItem } from 'vue3-grid-layout-next';
  import { searchReport } from '@/api/report';
  import Item from './item.vue';

  const layout = reactive<IHome[]>([]);
  const colNum = 24;
  const rowHeight = 20;

  function getReports(keyword = '') {
    return searchReport({ like_name: keyword, like_description: keyword, page: 1, size: 10 }).then(
      (res) => res.rows,
    );
  }

  onMounted(() => {
    getHome().then((res) => {
      if (res.length == 0) return;
      layout.splice(0, layout.length, ...res);
    });
  })
</script>

<template>
  <article>
    <main>
      <grid-layout
        v-model:layout="layout"
        :col-num="colNum"
        :row-height="rowHeight"
        :is-draggable="false"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="(item, i) in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
          class="shadow-sm hover:shadow-xl border border-gray-300 rounded-md"
        >
          <Item v-model="layout[i]" :search-report="getReports" @remove="layout.splice(i, 1)" />
        </grid-item>
      </grid-layout>
    </main>
  </article>
</template>
