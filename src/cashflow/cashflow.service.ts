import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryRspDto } from 'src/core/Dto/common.dto';
import { CashflowDto, SyncDto } from './cashflow.dto';
import { Cashflow } from './models/cashflow.model';
import { MailService } from 'src/mail/mail.service';
import { downloadByUrl, extractZip } from './utils';
import { decode } from 'iconv-lite';

@Injectable()
export class CashflowService {

  constructor(
    private readonly mailService: MailService,
    @InjectModel(Cashflow)
    private readonly cashflowModel: typeof Cashflow,
  ) {}

  async create(cashflows: CashflowDto[]): Promise<Cashflow[]> {
    return await this.cashflowModel.bulkCreate(cashflows as any[]);
  }

  async update(id: string, cashflow: CashflowDto): Promise<Cashflow> {
    const cashflowToUpdate = await this.cashflowModel.findByPk(id);
    if (!cashflowToUpdate) {
      throw new Error('Cashflow not found');
    }
    const updateField = ['amount', 'remark', 'counterparty', 'description', 'category', 'status'];
    updateField.forEach((field) => {
      if (cashflow[field]) {
        cashflowToUpdate[field] = cashflow[field];
      }
    });

    return await cashflowToUpdate.save();
  }

  async remove(id: string): Promise<Cashflow> {
    const cashflowToRemove = await this.cashflowModel.findByPk(id);
    if (!cashflowToRemove) {
      throw new Error('Cashflow not found');
    }
    await cashflowToRemove.destroy();
    return cashflowToRemove;
  }

  async findOne(id: string): Promise<Cashflow> {
    const cashflow = await this.cashflowModel.findByPk(id);
    if (!cashflow) {
      throw new Error('Cashflow not found');
    }
    return cashflow;
  }

  async query(data): Promise<QueryRspDto<Cashflow>> {
    // 分页查询，按照交易时间倒序
    const { page, size, ...query } = data;
    if (query.transactionTimeStart || query.transactionTimeEnd) {
      query.transactionTime = {
        $gte: query.transactionTimeStart,
        $lte: query.transactionTimeEnd,
      };
    }
    if (query.amountMin || query.amountMax) {
      query.amount = {
        $gte: query.amountMin,
        $lte: query.amountMax,
      };
    }
    if (query.remark) {
      query.remark = {
        $like: `%${query.remark}%`,
      };
    }
    if (query.counterparty) {
      query.counterparty = {
        $like: `%${query.counterparty}%`,
      };
    }
    if (query.description) {
      query.description = {
        $like: `%${query.description}%`,
      };
    }

    const total = await this.cashflowModel.count({
      where: query,
    });

    return {
      data: await this.cashflowModel.findAll({
        where: query,
        offset: (page - 1) * size,
        limit: size,
        order: [['transactionTime', 'DESC']],
      }),
      total,
    }
  }

  async analysis(username, sync: SyncDto) {
    let mails =  await this.mailService.getUnread(username, 10);
    if (sync.type == 'alipay' && Array.isArray(mails)) {
      let mail = mails.find((mail) => mail.headers.subject.includes('支付宝交易流水'));
      if (!mail) return [];
      if (!sync.password) return mail;
      mails =  await this.mailService.getUnread(username, 10, {
        content: true,
        attachments: true,
        saveAttachments: (headers, data) => {
          return new Promise((resolve, reject) => {
            if (headers.subject.includes('支付宝交易流水')) {
              let savePath = path.join(__dirname, 'alipay');
              fs.mkdirSync(savePath, { recursive: true });
              savePath = path.join(savePath, data.filename);
              data.content.pipe(fs.createWriteStream(savePath));
              data.content.on('end', () => {
                data.release()
                resolve({
                  filename: data.filename,
                  savePath,
                });
              });
            }
          });
        },
      });
      if (!Array.isArray(mails)) return [];
      mail = mails.find((mail) => mail.headers.subject.includes('支付宝交易流水'));
      if (mail.attachments.length == 0) throw new Error('未找到附件');
      const files = await extractZip(mail.attachments.savePath, sync.password, path.join(__dirname, 'alipay'));
      if (files.length == 0) throw new Error('解压失败');
      let isStart = false;
      const orderList: CashflowDto[] = []
      decode(fs.readFileSync(files[0]), 'gb2312').split('\n').forEach((line) => {
        if (line.startsWith('交易时间')) return isStart = true;
        if (!isStart || !line) return;
        const [transactionTime, category, counterparty, _, description, type, amount, payment, status, orderNumber, merchantNumber, remark] = line.split(',');
        orderList.push({
          username,
          type,
          counterparty,
          description,
          payment,
          amount: amount && parseFloat(amount) || 0,
          status,
          category,
          orderNumber,
          merchantNumber,
          transactionTime,
          remark,
          from: 'alipay',
        });
      });
      this.mailService.getMail(username, mail.id, { markSeen: true });
      fs.unlink(files[0], console.log);
      fs.unlink(mail.attachments.savePath, console.log);
      return await this.create(orderList);
    } else if (sync.type == 'wepay' && Array.isArray(mails)) {
      let mail = mails.find((mail) => mail.headers.subject.includes('微信支付-账单流水'));
      if (!mail) return [];
      if (!sync.password) return mail;
      mails =  await this.mailService.getUnread(username, 10, {
        content: true,
      });
      if (!Array.isArray(mails)) return [];
      mail = mails.find((mail) => mail.headers.subject.includes('微信支付-账单流水'));
      let mat = mail.data.match(/"(https:\/\/download.bill.weixin.qq.com[^"]*?)"/);
      if (!mat) throw new Error('未找到下载链接');
      const url = mat[1];
      const savePath = await downloadByUrl(url, path.join(__dirname, 'wepay'));
      const files = await extractZip(savePath, sync.password, path.join(__dirname, 'wepay'));
      if (files.length == 0) throw new Error('解压失败');
      let isStart = false;
      const orderList: CashflowDto[] = []
      fs.readFileSync(files[0]).toString().split('\n').forEach((line) => {
        if (line.startsWith('交易时间')) return isStart = true;
        if (!isStart || !line) return;
        const [transactionTime, category, counterparty, description, type, amount, payment, status, orderNumber, merchantNumber, remark] = line.split(',');
        orderList.push({
          username,
          type,
          counterparty,
          description,
          payment,
          amount: amount && parseFloat(amount) || 0,
          status,
          category,
          orderNumber,
          merchantNumber,
          transactionTime,
          remark,
          from: 'wepay',
        });
      });
      this.mailService.getMail(username, mail.id, { markSeen: true });
      fs.unlink(files[0], console.log);
      fs.unlink(savePath, console.log);
      return await this.create(orderList);

    }
    return [];
  }


}
