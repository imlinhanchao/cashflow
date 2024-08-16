// uno.config.ts
import { defineConfig, presetUno, presetIcons } from 'unocss';

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  theme: {
    colors: {
      primary: 'var(--color-primary)',
    },
  },
  content: {
    pipeline: {
      include: [
        /\.(vue|[jt]sx|html)($|\?)/,
        // https://unocss.dev/guide/extracting#extracting-from-build-tools-pipeline
        'src/router/routes/**/*.{js,ts}',
      ],
    },
  },
  shortcuts: [
    ['wh-full', 'w-full h-full'],
    ['flex-middle', 'flex items-center'],
    ['flex-center', 'flex justify-center items-center'],
    ['flex-column', 'flex flex-col'],
  ],
  rules: [
    [/^border-(top|left|right|bottom)-(\d+)$/, ([, p, d]) => ({ [`border-${p}-width`]: `${d}px` })],
  ],
});
