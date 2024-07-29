import { isConfig } from "@/api/config"

export function useConfig() {
  let timer;
  let resolve: any = null;
  const waitServer = new Promise((r) => (resolve = r));
  async function checkConfig() {
    if (await isConfig().catch(() => {
      timer = setTimeout(() => checkConfig(), 1000)
    })) resolve();
  }

  setTimeout(() => checkConfig(), 2000);

  onUnmounted(() => {
    clearTimeout(timer);
  })

  return {
    waitServer,
  }
}