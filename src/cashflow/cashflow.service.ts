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

  async analysisFile(file: string, username: string, from: string): Promise<Cashflow[]> {
    if (from == 'alipay') {
      return await this.readAndSave(decode(fs.readFileSync(file), 'gb2312').split('\n'), username, from);
    } else {
      return await this.readAndSave(fs.readFileSync(file).toString().split('\n'), username, from);
    }
  }
  async readAndSave(fileLines: string[], username: string, from: string): Promise<Cashflow[]> {
    const orderList: CashflowDto[] = []
    let isStart = false;
    if (from == 'alipay') {
      fileLines.forEach((line) => {
        if (line.startsWith('交易时间')) return isStart = true;
        if (!isStart || !line) return;
        const [transactionTime, category, counterparty, _, description, type, amount, payment, status, orderNumber, merchantNumber, remark] = line.split(',');
        orderList.push({
          username,
          type: type.trim(),
          counterparty: counterparty.trim(),
          description: description.trim(),
          payment: payment.trim(),
          amount: amount && parseFloat(amount) || 0,
          status: status.trim(),
          category: category.trim(),
          orderNumber: orderNumber.trim(),
          merchantNumber: merchantNumber.trim(),
          transactionTime: transactionTime.trim(),
          remark: remark.trim(),
          from: 'alipay',
        });
      });
    } else if (from == 'wepay'){
      fileLines.forEach((line) => {
        if (line.startsWith('交易时间')) return isStart = true;
        if (!isStart || !line) return;
        const [transactionTime, category, counterparty, description, type, amount, payment, status, orderNumber, merchantNumber, remark] = line.split(',');
        orderList.push({
          username,
          type: type.trim(),
          counterparty: counterparty.trim(),
          description: description.trim(),
          payment: payment.trim(),
          amount: amount && parseFloat(amount) || 0,
          status: status.trim(),
          category: category.trim(),
          orderNumber: orderNumber.trim(),
          merchantNumber: merchantNumber.trim(),
          transactionTime: transactionTime.trim(),
          remark: remark.trim(),
          from: 'wepay',
        });
      });
    }

    return await this.create(orderList);
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
              let savePath = path.join(__dirname, sync.type);
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

      const files = await extractZip(mail.attachments.savePath, sync.password, path.join(__dirname, sync.type));
      if (files.length == 0) throw new Error('解压失败');
      const cashflows = await this.analysisFile(files[0], username, sync.type);

      this.mailService.getMail(username, mail.id, { markSeen: true });

      fs.unlink(files[0], console.log);
      fs.unlink(mail.attachments.savePath, console.log);

      return cashflows;
    } else if (sync.type == 'wepay' && Array.isArray(mails)) {
      let mail = mails.find((mail) => mail.headers.subject.includes('微信支付-账单流水'));
      if (!mail) return [];
      if (!sync.password) return mail;
      mails =  await this.mailService.getUnread(username, 10, {
        content: true,
      });
      if (!Array.isArray(mails)) return [];

      mail = mails.find((mail) => mail.headers.subject.includes('微信支付-账单流水'));
      const mat = mail.data.match(/"(https:\/\/download.bill.weixin.qq.com[^"]*?)"/);
      if (!mat) throw new Error('未找到下载链接');
      const url = mat[1];
      const savePath = await downloadByUrl(url, path.join(__dirname, sync.type));

      const files = await extractZip(savePath, sync.password, path.join(__dirname, sync.type));
      if (files.length == 0) throw new Error('解压失败');
      const cashflows = await this.analysisFile(files[0], username, sync.type);

      this.mailService.getMail(username, mail.id, { markSeen: true });

      fs.unlink(files[0], console.log);
      fs.unlink(savePath, console.log);
      return cashflows;

    }
    return [];
  }


}
