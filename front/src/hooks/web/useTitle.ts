import { watch, unref } from 'vue';
import { useTitle as usePageTitle } from '@vueuse/core';
import { useGlobSetting } from '@/hooks/setting';
import { useRouter } from 'vue-router';

import { REDIRECT_NAME } from '@/router/constant';

/**
 * Listening to page changes and dynamically changing site titles
 */
export function useTitle() {
  const { title } = useGlobSetting();
  const { currentRoute } = useRouter();

  const pageTitle = usePageTitle();

  watch(
    [() => currentRoute.value.path],
    () => {
      const route = unref(currentRoute);

      if (route.name === REDIRECT_NAME) {
        return;
      }

      const tTitle = route?.meta?.title;
      pageTitle.value = tTitle ? ` ${tTitle} - ${title} ` : `${title}`;
    },
    { immediate: true },
  );

  function setTitle(tTitle: string) {
    pageTitle.value = tTitle ? ` ${tTitle} - ${title} ` : `${title}`;
  }

  return {
    setTitle,
  };
}
