import { analysis, analysisFile, connectMail } from '@/api/cashflow';

export class SyncModel {
  from: 'alipay' | 'wepay' = 'alipay';
  way: 'email' | 'file' = 'email';
  email?: string;
  password?: string;
  archive?: string;
  file?: File;
  isRemember: boolean = false;
}

export function useSyncData(config: SyncModel) {
  let isMailConnected = false;

  async function syncData() {
    const list = await (config.way == 'email' ? analysis : analysisFile)({ password: config.archive, type: config.from, file: config.file });
    return list.length;
  }

  async function checkMail() {
    if (!config.email || !config.password) return false;
    if (!isMailConnected)
      isMailConnected = await connectMail({ username: config.email, password: config.password });
    const mail = await analysis({ type: config.from });
    if (!mail || !mail.subject.includes({ alipay: '支付宝', wepay: '微信' }[config.from])) return false;
    return true;
  }

  let timer: any =  0;
  let resolve: any = null;
  const waitBillMail = new Promise((r) => resolve = r);
  if (config.way == 'email') {
    const timeout = 2000;
    const checkTimer = async () => {
      if (!(await checkMail())) return setTimeout(checkTimer, timeout);
      timer = 0;
      resolve();
    };
    timer = setTimeout(checkTimer, timeout)
  }

  onUnmounted(() => {
    if (timer) clearTimeout(timer);
  })

  return {
    waitBillMail,
    syncData,
  }
}
