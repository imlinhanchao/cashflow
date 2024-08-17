import 'virtual:uno.css';
import 'virtual:svg-icons-register';
import '@unocss/reset/tailwind-compat.css';
import '@/assets/style/main.less';
import 'ant-design-vue/dist/reset.css';

import { createApp } from 'vue';

import App from '@/layouts/App.vue';
import Antd from 'ant-design-vue';
import router, { setupRouter } from './router';
import { setupStore } from './store';
import { setupGlobDirectives } from './directives';
import { setupRouterGuard } from './router/guard';
import { setupGlobIcon } from './helper/iconHelper';

async function bootstrap() {
  const app = createApp(App);

  app.use(Antd);

  // Configure store
  setupStore(app);

  // Configure routing
  setupRouter(app);

  // router-guard
  setupRouterGuard(router);

  // Register global directive
  setupGlobDirectives(app);

  setupGlobIcon(app);

  app.mount('#app');
}

bootstrap();
