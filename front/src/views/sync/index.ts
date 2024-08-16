import { analysis, analysisFile, connectMail, stopMail } from '@/api/cashflow';

export class SyncModel {
  from: 'alipay' | 'wepay' = 'alipay';
  way: 'email' | 'file' = 'email';
  email?: string;
  password?: string;
  archive?: string;
  files?: File[];
  isRemember: boolean = false;
}

export function useSyncData(config: SyncModel) {
  let isMailConnected = false;

  async function syncData() {
    const list = await (config.way == 'email' ? analysis : analysisFile)({
      password: config.archive,
      type: config.from,
      files: config.files,
    });
    return list.length;
  }

  async function checkMail() {
    if (!config.email || !config.password) return false;
    if (!isMailConnected)
      isMailConnected = await connectMail({ username: config.email, password: config.password });
    const mail = await analysis({ type: config.from }).catch(console.error);
    if (!mail || !mail.subject.includes({ alipay: '支付宝', wepay: '微信' }[config.from]))
      return false;
    return true;
  }

  let timer: any = 0;
  let resolve: any = null,
    reject: any = null;
  const waitBillMail = new Promise((r, j) => ((resolve = r), (reject = j)));
  if (config.way == 'email') {
    const timeout = 2000;
    const checkTimer = async () => {
      try {
        if (!(await checkMail())) return setTimeout(checkTimer, timeout);
        timer = 0;
        resolve();
      } catch (e) {
        reject(e);
      }
    };
    timer = setTimeout(checkTimer, timeout);
  }

  onUnmounted(() => {
    if (timer) clearTimeout(timer);
    stopMail();
  });

  return {
    waitBillMail,
    syncData,
  };
}
