import type { Plugin } from 'vite';

/**
 * TODO 循环引用报错临时解决方案，等待vite升级后删除
 */

export function configHmrPlugin(): Plugin {
  return {
    name: 'singleHMR',
    handleHotUpdate({ modules, file }) {
      if (file.match(/xml$/)) return [];

      modules.forEach((m) => {
        if (!m.url.match(/\.(css|less|scss)/)) {
          // m.importedModules = new Set();
          m.importers = new Set();
        }
      });

      return modules;
    },
  };
}
