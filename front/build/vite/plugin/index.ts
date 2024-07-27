import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import UnoCSS from 'unocss/vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';
import eslintPlugin from 'vite-plugin-eslint';
import { configCompressPlugin } from './compress';
import { configHtmlPlugin } from './html';
import { autoImports } from './autoImports';
import { configSvgIconsPlugin } from './svgSprite';
import DevTools from 'vite-plugin-vue-devtools';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_LEGACY, VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // have to
    vue(),
    vueJsx(),
    // support name
    vueSetupExtend(),
    // enhance Vite builtin dynamic import
    autoImports(),
    // unocss
    UnoCSS(),
    // vue-devtools
    DevTools()
  ];

  // TODO 循环引用报错临时解决方案，等待vite升级后删除
  // !isBuild && vitePlugins.push(configHmrPlugin());

  // eslint
  vitePlugins.push(eslintPlugin({ include: ['src/**/*.js', 'src/**/*.ts', 'src/**/*.vue'] }));

  // @vitejs/plugin-legacy
  VITE_LEGACY &&
    isBuild &&
    vitePlugins.push(
      legacy({
        targets: ['defaults', 'ie >= 11', 'chrome 52'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks: true,
        polyfills: true,
        modernPolyfills: true,
      }),
    );

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin(isBuild));

  // rollup-plugin-gzip
  if (isBuild) {
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE),
    );
  }

  return vitePlugins;
}
