/**
 * Configure and register global directives
 */
import type { App } from 'vue';
import * as AntIcon from '@ant-design/icons-vue';

export function setupGlobIcon(app: App) {
  Object.keys(AntIcon).forEach((key) => {
    app.component(`AntIcon${key}`, AntIcon[key]);
  });
}