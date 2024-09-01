<script setup lang="ts">
  import { getHome, IHome, saveHome } from '@/api/home';
  import { GridLayout, GridItem } from 'vue3-grid-layout-next';
  import { searchReport } from '@/api/report';
  import Item from './item.vue';

  const layout = reactive<IHome[]>([{ x: 0, y: 0, w: 6, h: 10, i: '0', reportId: '' } as IHome]);
  const colNum = 24;
  const rowHeight = 20;
  function add() {
    let y = Math.max(...layout.map((item) => item.y));
    let x = layout.filter((l) => l.y == y).reduce((acc, cur) => acc + cur.w, 0);
    let w = Math.min(6, colNum - x);
    if (w < 6) {
      x = 0;
      y += 1;
      w = 6;
    }
    layout.push({
      x: x,
      y: y,
      w: w,
      h: 10,
      i: String(layout.length),
      reportId: '',
    } as IHome);
  }

  function getReports(keyword = '') {
    return searchReport({ like_name: keyword, like_description: keyword, page: 1, size: 10 }).then(
      (res) => res.rows,
    );
  }

  function save() {
    saveHome(layout);
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
    <header class="space-x-2">
      <a-button type="primary" ghost shape="circle" @click="add">
        <Icon icon="i-fluent:slide-add-28-regular" />
      </a-button>
      <a-button type="primary" shape="circle" @click="save">
        <Icon icon="i-fluent:save-16-regular" />
      </a-button>
    </header>
    <main>
      <grid-layout
        v-model:layout="layout"
        :col-num="colNum"
        :row-height="rowHeight"
        :is-draggable="true"
        :is-resizable="true"
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
          class="border-dashed border border-gray-500 rounded-md"
        >
          <Item v-model="layout[i]" editable :search-report="getReports" @remove="layout.splice(i, 1)" />
        </grid-item>
      </grid-layout>
    </main>
  </article>
</template>
