export class SyncModel {
  from: 'alipay' | 'wepay' = 'alipay';
  way: 'email' | 'file' = 'email';
  email?: string;
  password?: string;
  archive?: string;
  file?: File;
  isRemember: boolean = false;
}