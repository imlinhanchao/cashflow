import * as Imap from 'imap';
import { simpleParser, ParsedMail, MailParser } from 'mailparser';
import { MailConfigDto } from './mail.dto';

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

  async getUnread () {
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
          resolve(await this.fetchResult(results));
        });
      });
    });
  }

  // 搜索最新的n封主题包含text的邮件
  async searchLatest (text: string, n: number) {
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
          resolve(await this.fetchResult(results.slice(-n)));
        });
      });
    });
  }

  // 获取最新n封邮件
  getLatest (n: number) {
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
          resolve(await this.fetchResult(results.slice(-n)));
        });
      });
    });
  }

  private fetchResult (results: number[]) {
    return new Promise((resolve, reject) => {
      if (results.length === 0) return resolve([]);
      const mailsRecv = []
      const f = this.imap.fetch(results, {
        bodies: '',
      });
      f.on('message', (msg) => {
        mailsRecv.push(this.recvMessage(msg));
      });
      f.once('error', (err) => {
        reject(err);
      });
      f.once('end', async () => {
        resolve(await Promise.all(mailsRecv));
      });
    });
  }

  private recvMessage (msg) {
    return new Promise((resolve, reject) => {
      msg.on('body', (stream) => {
        const parser = new MailParser({
        });
        stream.pipe(parser);
        const mail: any = {};
        parser.on('data', (data) => mail.data = data);
        parser.on('headers', (headers) => {
          mail.header = {};
          headers.forEach((value, key) => {
            mail.header[key] = value;
          })
        });
        parser.on('error', reject);
        parser.on('end', () => {
          resolve(mail);
          parser.end();
        });
      });
      msg.on('error', reject);
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