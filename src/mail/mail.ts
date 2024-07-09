import * as Imap from 'imap';
import { simpleParser, ParsedMail, MailParser } from 'mailparser';
import { MailConfigDto, MailRecvOptions } from './mail.dto';

export class Mail {
  private imap: Imap;
  constructor(private config?: MailConfigDto) {

  }

  async connect (config: MailConfigDto) {
    return new Promise((resolve, reject) => {
      try {
        this.config = config;
        this.imap = new Imap({
          user: this.config.username,
          password: this.config.password,
          host: 'imap.qq.com',
          port: 993,
          tls: true,
          tlsOptions: { rejectUnauthorized: false }
        });
        this.imap.once('ready', () => {
          resolve(true);
        })
        this.imap.once('error', (err) => {
          reject(err);
        })
        this.imap.connect();
      } catch (error) {
        reject(error);
      }
    });
  }

  stop () {
    return this.imap.end();
  }

  async getUnread (n: number=-1, options: MailRecvOptions = { }) {
    return new Promise((resolve, reject) => {
      if (!this.imap) {
        return reject('Mail is not connected');
      }
      this.imap.openBox('INBOX', false, (err) => {
        if (err) {
          reject(err);
        }

        this.imap.search(['UNSEEN'], async (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(await this.fetchResult(n < 0 ? results : results.slice(-n), options).catch(reject));
        });
      });
    });
  }

  // 搜索最新的n封主题包含text的邮件
  async searchLatest (text: string, n: number, options: MailRecvOptions = {}) {
    return new Promise((resolve, reject) => {
      if (!this.imap) {
        return reject('Mail is not connected');
      }
      this.imap.openBox('INBOX', false, (err) => {
        if (err) {
          reject(err);
        }
        this.imap.search([['HEADER', 'SUBJECT', text]], async (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(await this.fetchResult(results.slice(-n), options).catch(reject));
        });
      });
    });
  }

  // 获取最新n封邮件
  getLatest (n: number, options: MailRecvOptions = {}) {
    return new Promise((resolve, reject) => {
      if (!this.imap) {
        return reject('Mail is not connected');
      }
      this.imap.openBox('INBOX', false, (err) => {
        if (err) {
          reject(err);
        }
        this.imap.search(['ALL'], async (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(await this.fetchResult(results.slice(-n), options).catch(reject));
        });
      });
    });
  }

  getMail (id: number, options: MailRecvOptions = {}) {
    return new Promise((resolve, reject) => {
      const f = this.imap.fetch([id], {
        bodies: '',
        markSeen: options.markSeen,
      });
      f.on('message', (msg) => {
        this.recvMessage(msg, options).then(resolve).catch(reject);
      });
      f.once('error', (err) => {
        reject(err);
      });
    });
  }

  private fetchResult (results: number[], options: MailRecvOptions = {}) {
    return new Promise((resolve, reject) => {
      if (results.length === 0) return resolve([]);
      const mailsRecv = [];
      const f = this.imap.fetch(results, {
        bodies: '',
        markSeen: options.markSeen,
      });
      f.on('message', (msg) => {
        mailsRecv.push(this.recvMessage(msg, options).then((mail) => {
          return mail;
        }).catch((err) => {
          console.error(err);
        }));
      });
      f.once('error', (err) => {
        reject(err);
      });
      f.once('end', async () => {
        const mails = await Promise.all(
          mailsRecv
        ).catch(reject);
        resolve(mails);
      });
    });
  }

  private recvMessage (msg: Imap.ImapMessage, options: MailRecvOptions = {}) {
    return new Promise((resolve, reject) => {
      const mail: any = {};
      msg.once('attributes', (attrs) => {
        mail.id = attrs.uid;
      });
      msg.on('body', (stream) => {
        const parser = new MailParser({
        });
        stream.pipe(parser);
        options.content && parser.on('data', async (data) => {
          if (data.type === 'text') {
            mail.data = data.html;
          }
          if (options.attachments && data.type === 'attachment') {
            mail.attachments = await options.saveAttachments?.(mail.headers, data);
          }
          if (mail.headers) parser.destroy();
        });
        parser.on('headers', (headers) => {
          mail.headers = {};
          headers.forEach((value, key) => {
            mail.headers[key] = value;
          });
          if (mail.data || !options.content && !options.attachments) parser.destroy();
        });
        parser.on('error', reject);
        parser.once('end', () => {
          resolve(mail);
        });
        parser.once('close', () => {
          resolve(mail);
          stream.resume();
        });
      });
    })
  }

  private parserMail (buffer: string) {
    return new Promise((resolve, reject) => {
      simpleParser(buffer, (err, parsed: ParsedMail) => {
        if (err) {
          reject(err);
        }
        resolve(parsed);
      })
    });
  }
}