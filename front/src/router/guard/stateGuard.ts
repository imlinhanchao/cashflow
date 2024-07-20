import type { Router } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { PageEnum } from '@/enums/pageEnum';

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    // Just enter the login page and clear the authentication information
    if (to.path === PageEnum.BASE_LOGIN) {
      const userStore = useUserStore();
      userStore.resetState();
    }
  });
}
