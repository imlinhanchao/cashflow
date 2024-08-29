import { tryOnMounted, tryOnUnmounted, useDebounceFn } from '@vueuse/core';

interface WindowSizeOptions {
  once?: boolean;
  immediate?: boolean;
  listenerOptions?: AddEventListenerOptions | boolean;
}

export function useWindowResize<T>(fn: Fn<T>, wait = 150, options?: WindowSizeOptions) {
  let handler = () => {
    try {
      fn();

      if (options && options.once) stop();
    } catch (error) {
      console.error(`useWindowResize error:`, error);
    }
  };
  const handleSize = useDebounceFn(handler, wait);
  handler = handleSize;

  const start = () => {
    if (options && options.immediate) handler();

    window.addEventListener('resize', handler, options?.listenerOptions);
  };

  const stop = () => window.removeEventListener('resize', handler);

  tryOnMounted(() => start());
  tryOnUnmounted(() => stop());
}
