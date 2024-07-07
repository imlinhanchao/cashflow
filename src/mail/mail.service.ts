import { Injectable } from '@nestjs/common';
import { Mail } from './mail';
import { MailConfigDto, MailRecvOptions } from './mail.dto';

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

  getUnread (user, count=-1, options: MailRecvOptions = { content: true }) {
    if (!this.mails[user]) {
      throw(new Error('Mail is not connected'));
    }
    return this.mails[user]?.getUnread(count, options);
  }

  stop (user) {
    if (!this.mails[user]) {
      throw(new Error('Mail is not connected'));
    }
    return this.mails[user]?.stop();
  }

  getLatest (user, number, options: MailRecvOptions = {}) {
    if (!this.mails[user]) {
      throw(new Error('Mail is not connected'));
    }
    return this.mails[user]?.getLatest(number, options);
  }

  searchLatest (user, text, number, options: MailRecvOptions = {}) {
    if (!this.mails[user]) {
      throw(new Error('Mail is not connected'));
    }
    return this.mails[user]?.searchLatest(text, number, options);
  }
}
