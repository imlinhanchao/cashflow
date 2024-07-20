<script setup lang="ts" name="Logo">
import { PageEnum } from '@/enums/pageEnum';
import { useGlobSetting } from '@/hooks/setting';
import { useUserStore } from '@/store/modules/user';

  const { title } = useGlobSetting();

  const userStore = useUserStore();
  const router = useRouter();
  function goHome() {
    router.push(userStore.getUserInfo.homePath || PageEnum.BASE_HOME);
  }
</script>

<template>
  <div class="anticon h-full py-3" @click="goHome">
    <img class="h-[90%]" src="../../../assets/images/logo.svg" />
    <div class="ml-2 truncate md:opacity-100 text-2xl font-bold">
      {{ title }}
    </div>
  </div>
</template>