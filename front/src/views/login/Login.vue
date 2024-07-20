<script lang="ts" setup>
  import { PageEnum } from '@/enums/pageEnum';
  import { useUserStore } from '@/store/modules/user';
  import { notification } from 'ant-design-vue';
  import { FormInstance, Rule } from 'ant-design-vue/es/form';

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
        mode: 'none', //不要默认的错误提示
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
  <article>
    <a-card>
      <a-form ref="formRef" :model="formData" :rules="rules">
        <a-form-item>
          <a-input v-model:value="formData.username" placeholder="Username" />
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="formData.password" placeholder="Password" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="login" :loading="loading">Login</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </article>
</template>
