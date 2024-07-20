<script setup lang="ts" name="Logo">
import { PageEnum } from '@/enums/pageEnum';
import { useGlobSetting } from '@/hooks/setting';

  const { title } = useGlobSetting();

  const router = useRouter();
  function goHome() {
    router.push(PageEnum.BASE_HOME);
  }
</script>

<template>
  <div class="anticon h-full py-3" @click="goHome">
    <Icon icon="ph:coin-vertical-fill" :size="30" />
    <div class="ml-2 truncate md:opacity-100 text-2xl font-bold">
      {{ title }}
    </div>
  </div>
</template>