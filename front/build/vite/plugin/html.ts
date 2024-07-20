/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import { createHtmlPlugin } from 'vite-plugin-html';
import pkg from '../../../package.json';
import { GLOB_CONFIG_FILE_NAME } from '../../constant';

export function configHtmlPlugin(env, isBuild) {
  const { VITE_PUBLIC_PATH } = env;

  const path = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`;

  const getAppConfigSrc = () => {
    return `${path}${GLOB_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`;
  };

  const htmlPlugin = createHtmlPlugin({
    minify: isBuild,
    /**
     * After writing entry here, you will not need to add script tags in `index.html`, the original tags need to be deleted
     * @default src/main.ts
     */
    //  entry: 'src/main.ts',
    /**
     * If you want to store `index.html` in the specified folder, you can modify it, otherwise no configuration is required
     * @default index.html
     */
    //  template: 'public/index.html',

    /**
     * Data that needs to be injected into the index.html ejs template
     */
    inject: {
      data: {
        // title: VITE_GLOB_APP_TITLE,
        //  injectScript: `<script src="./inject.js"></script>`,
      },
      // Embed the generated app.config.js file
      tags: isBuild
        ? [
            {
              tag: 'script',
              attrs: {
                src: getAppConfigSrc(),
              },
            },
          ]
        : [],
    },
  });
  return htmlPlugin;
}
