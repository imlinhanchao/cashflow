import { Injectable } from '@nestjs/common';
import { Mail } from './mail';
import { MailConfigDto } from './mail.dto';

@Injectable()
export class MailService {
  private mails: { [key: string]: Mail } = {};

  constructor() {
    //
  }

  connect (user, account: MailConfigDto) {
    this.mails[user] = new Mail();
    return this.mails[user].connect(account)
  }

  getUnread (user) {
    if (!this.mails[user]) {
      return 'Mail is not connected';
    }
    return this.mails[user]?.getUnread();
  }

  stop (user) {
    if (!this.mails[user]) {
      return 'Mail is not connected';
    }
    return this.mails[user]?.stop();
  }

  getLatest (user, number) {
    if (!this.mails[user]) {
      return 'Mail is not connected';
    }
    return this.mails[user]?.getLatest(number);
  }

  searchLatest (user, text, number) {
    if (!this.mails[user]) {
      return 'Mail is not connected';
    }
    return this.mails[user]?.searchLatest(text, number);
  }
}
