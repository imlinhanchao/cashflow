<script lang="ts" setup>
  import { PageEnum } from '@/enums/pageEnum';
  import { useUserStore } from '@/store/modules/user';
  import { notification } from 'ant-design-vue';
  import { FormInstance, Rule } from 'ant-design-vue/es/form';
  import Logo from '@/layouts/components/logo/index.vue';
  import Config from './Config.vue';
  import { isConfig } from '@/api/config';

  const formData = reactive({
    username: '',
    password: '',
  });

  const hasConfig = ref(true);
  isConfig().then((res) => (hasConfig.value = res));

  const formRef = ref<FormInstance>();
  const loading = ref(false);
  const rules: Record<string, Rule[]> = {
    username: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
        trigger: 'blur',
      },
    ],
  };
  const userStore = useUserStore();
  const router = useRouter();
  async function login() {
    await formRef.value?.validate();
    console.log('formData: ', formData);
    loading.value = true;
    const userInfo = await userStore
      .login({
        ...formData,
      })
      .finally(() => (loading.value = false));
    if (userInfo) {
      notification.success({
        message: '登录成功',
        description: `欢迎回来: ${userInfo.nickname || userInfo.username}`,
        duration: 3,
      });
      setTimeout(() => router.replace(PageEnum.BASE_HOME), 1000);
    }
  }
</script>
<template>
  <article class="flex items-center justify-center h-full w-full">
    <Config v-if="!hasConfig" />
    <a-card v-else>
      <template #title>
        <h2 class="text-center"><Logo /></h2>
      </template>
      <a-form ref="formRef" :model="formData" :rules="rules">
        <a-form-item name="username">
          <a-input
            v-model:value="formData.username"
            placeholder="用户名"
            allow-clear
            class="max-w-80"
          >
            <template #prefix>
              <Icon icon="i-mdi:user" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password
            v-model:value="formData.password"
            placeholder="密码"
            allow-clear
            class="max-w-80"
          >
            <template #prefix>
              <Icon icon="i-bxs:lock-alt" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <section class="flex justify-between">
            <a-button type="primary" @click="login" :loading="loading">登录</a-button>
            <a-button @click="router.push('/register')">注册</a-button>
          </section>
        </a-form-item>
      </a-form>
    </a-card>
  </article>
</template>
