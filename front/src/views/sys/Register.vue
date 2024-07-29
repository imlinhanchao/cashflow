<script lang="ts" setup>
  import { PageEnum } from '@/enums/pageEnum';
  import { useUserStore } from '@/store/modules/user';
  import { notification } from 'ant-design-vue';
  import { FormInstance, Rule } from 'ant-design-vue/es/form';
  import Logo from '@/layouts/components/logo/index.vue';
  import { registerAccount, RegisterParams } from '@/api/user';

  const formData = reactive<RegisterParams>({
    username: '',
    nickname: '',
    password: '',
    email: '',
  });

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
    nickname: [
      {
        required: true,
        message: '请输入昵称',
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
    email: [
      {
        required: true,
        message: '请输入邮箱',
        trigger: 'blur',
      },
      {
        type: 'email',
        message: '请输入正确的邮箱格式',
        trigger: 'blur',
      },
    ],
  };
  const userStore = useUserStore();
  const router = useRouter();
  async function register() {
    await formRef.value?.validate();
    loading.value = true;
    await registerAccount({
      ...formData,
    }).finally(() => (loading.value = false));
    const userInfo = await userStore.login({
      ...formData,
    });
    if (!userInfo) return;
    notification.success({
      message: '注册成功',
      description: `欢迎您: ${userInfo.nickname || userInfo.username}`,
      duration: 3,
    });
    setTimeout(() => router.replace(PageEnum.BASE_HOME), 1000);
  }
</script>
<template>
  <article class="flex items-center justify-center h-full w-full">
    <a-card>
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
              <Icon icon="mdi:user" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="nickname">
          <a-input
            v-model:value="formData.nickname"
            placeholder="昵称"
            allow-clear
            class="max-w-80"
          >
            <template #prefix>
              <Icon icon="ph:star-fill" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-model:value="formData.password"
            placeholder="密码"
            allow-clear
            class="max-w-80"
          >
            <template #prefix>
              <Icon icon="bxs:lock-alt" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="email">
          <a-input
            v-model:value="formData.email"
            placeholder="邮箱"
            allow-clear
            class="max-w-80"
            type="email"
          >
            <template #prefix>
              <Icon icon="tabler:mail-filled" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <section class="flex justify-between">
            <a-button type="primary" @click="register" :loading="loading">注册</a-button>
            <a-button @click="router.push('/login')" :loading="loading">登录</a-button>
          </section>
        </a-form-item>
      </a-form>
    </a-card>
  </article>
</template>
