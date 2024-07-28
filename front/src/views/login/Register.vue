<script lang="ts" setup>
  import { PageEnum } from '@/enums/pageEnum';
  import { useUserStore } from '@/store/modules/user';
  import { notification } from 'ant-design-vue';
  import { FormInstance, Rule } from 'ant-design-vue/es/form';
  import Logo from '@/layouts/components/logo/index.vue';

  const formData = reactive({
    username: 'imlinhanchao',
    password: '123456',
  });

  const formRef = ref<FormInstance>();
  const loading = ref(false);
  const rules: Record<string, Rule[]> = {};
  const userStore = useUserStore();
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
        description: `欢迎回来: ${userInfo.username}`,
        duration: 3,
      });
      useRouter().replace(PageEnum.BASE_HOME);
    }
  }
</script>
<template>
  <article class="flex items-center justify-center h-full w-full">
    <a-card>
      <template #title>
        <h2 class="text-center"><Logo /></h2>
      </template>
      <a-form ref="formRef" :model="formData" :rules="rules">
        <a-form-item>
          <a-input v-model:value="formData.username" placeholder="用户名" allow-clear class="max-w-80">
            <template #prefix>
              <Icon icon="mdi:user" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password v-model:value="formData.password" placeholder="密码" allow-clear class="max-w-80">
            <template #prefix>
              <Icon icon="bxs:lock-alt" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <section class="flex justify-between">
            <a-button type="primary" @click="login" :loading="loading">登录</a-button>
            <a-button @click="login" :loading="loading">注册</a-button>
          </section>
        </a-form-item>
      </a-form>
    </a-card>
  </article>
</template>
