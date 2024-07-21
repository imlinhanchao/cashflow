<script setup lang="ts">
  import { FormInstance, UploadProps } from 'ant-design-vue';
  import { SyncModel } from './index.ts';
import { createLocalStorage } from '@/utils/cache';

  const props = withDefaults(
    defineProps<{
      modelValue: SyncModel;
    }>(),
    {},
  );

  const data = reactive(props.modelValue);
  const fileList = computed(() => (data.file && [data.file]) || []);

  const handleRemove: UploadProps['onRemove'] = (_) => {
    data.file = undefined;
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    data.file = file;
    return false;
  };

  const formRef = ref<FormInstance>();
  const rules = reactive({
    email: [{ required: true, message: '请输入邮箱账号', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入邮箱密码', trigger: 'blur' }],
    file: [{ required: true, message: '请上传对账单', trigger: 'blur' }],
  })
  defineExpose({
    async vaildate() {
      if (!(await formRef.value?.validate())) return false;
      if (data.way == 'email') {
        const storage = createLocalStorage();
        if (data.isRemember) {
          storage.set('sync_email', {
            email: data.email,
            password: data.password,
          });
        } else  {
          storage.remove('sync_email');
        }
      }
      return true;
    },
  });
</script>

<template>
  <a-form ref="formRef" :model="data" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" class="w-full" :rules="rules">
    <a-form-item label="邮箱账号" name="email" v-if="data.way == 'email'">
      <a-input v-model:value="data.email" allow-clear type="email" class="max-w-80" />
    </a-form-item>
    <a-form-item label="邮箱密码" name="password" v-if="data.way == 'email'">
      <a-input-password v-model:value="data.password" allow-clear class="max-w-80" />
    </a-form-item>
    <a-row v-if="data.way == 'email'">
      <a-col span="8" />
      <a-col span="16">
        <a-checkbox v-model:checked="data.isRemember">在本地记住账号和密码</a-checkbox>
      </a-col>
    </a-row>
    <a-form-item name="file" v-if="data.way == 'file'" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
      <section class="flex justify-center w-full">
        <a-upload-dragger
          :file-list="fileList"
          :before-upload="beforeUpload"
          @remove="handleRemove"
          :max-count="1"
          accept=".csv"
          class=" w-full"
        >
          <p class="ant-upload-drag-icon">
            <Icon icon="vscode-icons:file-type-excel2" :size="50" />
          </p>
          <p class="ant-upload-text">点击或拖拽对账单到此区域上传</p>
          <p class="ant-upload-hint">
            支持单个文件上传，仅支持 .csv 格式文件
          </p>
        </a-upload-dragger>
      </section>
    </a-form-item>
  </a-form>
</template>
