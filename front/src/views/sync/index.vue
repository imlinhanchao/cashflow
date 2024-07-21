<script setup lang="tsx" name="DataSync">
  import SyncConfig from './config.vue';
  import SyncChoose from './choose.vue';
  import SyncFinish from './finish.vue';
  import { SyncModel, useSyncData } from '.';
  import { createLocalStorage } from '@/utils/cache';
  import { Form, FormItem, InputPassword, Modal } from 'ant-design-vue';

  const stepItems = reactive<any[]>([
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
  const loading = ref(false);
  const [modal, contextHolder] = Modal.useModal();
  const syncText = ref('开始导入');
  const billCount = ref(0);
  async function syncData() {
    if (!(await chooseRef.value?.vaildate())) return false;
    loading.value = true;
    stepItems[1].status = 'wait';
    const { waitBillMail, syncData } = useSyncData(data);
    if (data.way == 'email') {
      syncText.value = '监听邮件中';
      await waitBillMail;
    }
    await modal.confirm({
      title: '填写对账单解压密码',
      content: () => (<Form model={data} label-col={{ span: 0 }} wrapper-col={{ span: 24 }} class="my-5">
        <FormItem>
          <InputPassword v-model:value={data.archive}  allow-clear placeholder="解压密码" />
        </FormItem>
      </Form>),
      async onOk() {
        syncText.value = '导入数据中';
        syncData().then(count => {
          billCount.value = count;
          currentStep.value = 2;
        }).finally(() => {
          loading.value = false;
          delete stepItems[1].status;
        });
      }
    })
  }

  onMounted(() => {
    const storage = createLocalStorage();
    const syncEmail = storage.get('sync_email');
    if (syncEmail) {
      data.email = syncEmail.email;
      data.password = syncEmail.password;
      data.isRemember = true;
    }
  });
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
        <section v-if="currentStep == 2">
          <SyncFinish :count="billCount" :data="data">
            <a-button type="primary" v-if="currentStep == 2" @click="currentStep = 0">
              再次同步
            </a-button>
          </SyncFinish>
        </section>
        <section class="flex justify-around">
          <a-button
            type="default"
            v-if="currentStep != 2"
            :disabled="currentStep == 0 || loading"
            @click="currentStep--"
          >
            上一步
          </a-button>
          <a-button type="primary" v-if="currentStep == 0" @click="currentStep++">下一步</a-button>
          <a-button type="primary" v-if="currentStep == 1" @click="syncData" :loading="loading">开始导入</a-button>
          <contextHolder />
        </section>
      </section>
    </section>
  </section>
</template>
