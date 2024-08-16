<script setup lang="ts">
  import { Config, initConfig } from '@/api/config';
  import { FormInstance } from 'ant-design-vue';
  import { Rule } from 'ant-design-vue/es/form';
  import Logo from '@/layouts/components/logo/index.vue';
  import { useTitle } from '@/hooks/web/useTitle';
  import { useConfig } from './config';
  import { randStr } from '@/utils';

  const formData = reactive<Config & { password?: string; email?: string }>(new Config());
  const formRef = ref<FormInstance>();
  const loading = ref(false);
  const rules: Record<string, Rule[]> = {
    'database.host': [
      {
        required: true,
        message: '请输入数据库地址',
        trigger: 'blur',
      },
      {
        validator: async () => {
          if (!formData.database.port) {
            return Promise.reject(new Error('请输入数据库端口号'));
          }
          return Promise.resolve();
        },
      },
    ],
    'database.database': [
      {
        required: true,
        message: '请输入数据库名',
        trigger: 'blur',
      },
    ],
    'database.username': [
      {
        required: true,
        message: '请输入登录名',
        trigger: 'blur',
      },
    ],
    'database.password': [
      {
        required: true,
        message: '请输入密码',
        trigger: 'blur',
      },
    ],
    salt: [
      {
        required: true,
        message: '请输入数据盐',
        trigger: 'change',
      },
    ],
    'jwtConstants.secret': [
      {
        required: true,
        message: '请输入JWT Secret',
        trigger: 'change',
      },
    ],
    password: [
      {
        required: true,
        message: '请输入管理员密码',
        trigger: 'change',
      },
    ],
    email: [
      {
        required: true,
        message: '请输入管理员邮箱',
        trigger: 'blur',
      },
      {
        type: 'email',
        message: '请输入正确的邮箱格式',
        trigger: 'blur',
      },
    ],
  };

  const isConfiged = ref(false);
  async function save() {
    await formRef.value?.validate();
    loading.value = true;
    await initConfig(formData);

    isConfiged.value = true;
    const { waitServer } = useConfig();
    await waitServer;

    setTimeout(() => reload(), 1000);
  }

  function reload() {
    location.reload();
  }

  onMounted(() => {
    useTitle().setTitle('系统配置');
  });
</script>

<template>
  <a-card>
    <template #title>
      <h2 class="text-center"><Logo /></h2>
    </template>
    <a-form
      v-if="!isConfiged"
      ref="formRef"
      :model="formData"
      :rules="rules"
      class="max-w-120 grid grid-cols-2 gap-x-2"
    >
      <a-divider class="col-span-2">数据库配置</a-divider>
      <a-form-item :name="['database', 'host']" :rules="rules['database.host']">
        <a-input-group>
          <a-input
            v-model:value="formData.database.host"
            placeholder="数据库地址"
            allow-clear
            style="width: 65%"
          >
            <template #prefix>
              <Icon icon="i-mdi:network" title="数据库地址" />
            </template>
          </a-input>
          <a-input
            type="number"
            v-model:value="formData.database.port"
            placeholder="端口"
            style="width: 35%"
          >
            <template #prefix> : </template>
          </a-input>
        </a-input-group>
      </a-form-item>
      <a-form-item :name="['database', 'database']" :rules="rules['database.database']">
        <a-input v-model:value="formData.database.database" placeholder="数据库名" allow-clear>
          <template #prefix>
            <Icon icon="i-mdi:database" title="数据库名" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item :name="['database', 'username']" :rules="rules['database.username']">
        <a-input v-model:value="formData.database.username" placeholder="登录名" allow-clear>
          <template #prefix>
            <Icon icon="i-mdi:user" title="数据库登录名" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item :name="['database', 'password']" :rules="rules['database.password']">
        <a-input-password v-model:value="formData.database.password" placeholder="密码" allow-clear>
          <template #prefix>
            <Icon icon="i-bxs:lock-alt" title="数据库密码" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-divider class="col-span-2">安全配置</a-divider>
      <a-form-item name="salt">
        <a-input v-model:value="formData.salt" placeholder="数据盐" allow-clear>
          <template #prefix>
            <Icon icon="i-tabler:salt" title="数据加密盐" />
          </template>
          <template #suffix>
            <Icon
              icon="i-ri:dice-fill"
              class="cursor-pointer"
              title="随机生成"
              @click="formData.salt = randStr()"
            />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item :name="['jwtConstants', 'secret']" :rules="rules['jwtConstants.secret']">
        <a-input v-model:value="formData.jwtConstants.secret" placeholder="JWT Secret" allow-clear>
          <template #prefix>
            <Icon icon="i-fa-solid:user-secret" title="JWT Secret" />
          </template>
          <template #suffix>
            <Icon
              icon="i-ri:dice-fill"
              class="cursor-pointer"
              title="随机生成"
              @click="formData.jwtConstants.secret = randStr()"
            />
          </template>
        </a-input>
      </a-form-item>
      <a-divider class="col-span-2">管理员配置</a-divider>
      <a-form-item name="password">
        <a-input-password v-model:value="formData.password" placeholder="管理员密码" allow-clear>
          <template #prefix>
            <Icon icon="i-bxs:lock-alt" title="管理员密码" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="email">
        <a-input v-model:value="formData.email" placeholder="管理员邮箱" allow-clear>
          <template #prefix>
            <Icon icon="i-tabler:mail-filled" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item class="col-span-2">
        <section class="flex justify-between">
          <a-button block type="primary" @click="save" :loading="loading">保存</a-button>
        </section>
      </a-form-item>
    </a-form>
    <a-result v-else status="success" title="配置成功，请重启后端服务">
      <template #extra>
        <a-button type="primary" @click="reload">刷新登录</a-button>
      </template>
    </a-result>
  </a-card>
</template>
<style lang="less" scoped>
  .ant-divider {
    margin-top: 0;
  }
</style>
