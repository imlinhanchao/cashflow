<script setup lang="ts">
  import { SyncModel } from '.';
  import SyncConfig from './config.vue';
  import SyncChoose from './choose.vue';
import { createLocalStorage } from '@/utils/cache';

  const stepItems = reactive([
    {
      title: '同步配置',
      description: '选择同步数据方式',
    },
    {
      title: '同步数据',
      description: '填写同步配置',
    },
    {
      title: '同步完成',
      description: '完成数据同步',
    },
  ]);

  const currentStep = ref(0);
  const data = reactive(new SyncModel());
  const chooseRef = ref<InstanceType<typeof SyncChoose>>();
  async function syncData() {
    if (!(await chooseRef.value?.vaildate())) return false;
    console.log('data: ', data);
  }

  onMounted(() => {
    const storage = createLocalStorage();
    const syncEmail = storage.get('sync_email');
    if (syncEmail) {
      data.email = syncEmail.email;
      data.password = syncEmail.password;
      data.isRemember = true;
    }
  })
</script>

<template>
  <section class="m-auto max-w-[800px] flex flex-col h-full justify-center space-y-25">
    <section class="w-full">
      <a-steps :current="currentStep" :items="stepItems" />
    </section>
    <section class="items-center flex">
      <section class="w-full space-y-20">
        <section v-if="currentStep == 0">
          <SyncConfig v-model="data" />
        </section>
        <section v-if="currentStep == 1">
          <SyncChoose ref="chooseRef" v-model="data" />
        </section>
        <section class="flex justify-around">
          <a-button
            type="default"
            v-if="currentStep != 2"
            :disabled="currentStep == 0"
            @click="currentStep--"
          >
            上一步
          </a-button>
          <a-button type="primary" v-if="currentStep == 0" @click="currentStep++">下一步</a-button>
          <a-button type="primary" v-if="currentStep == 1" @click="syncData">开始导入</a-button>
          <a-button type="primary" v-if="currentStep == 2" @click="currentStep = 0">
            再次同步
          </a-button>
        </section>
      </section>
    </section>
  </section>
</template>
