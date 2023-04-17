import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WsService } from 'src/ws/ws.service';
import { Contact, ContactSelf, Message, Wechaty, WechatyBuilder } from 'wechaty';
import { WechatMessage } from './models/message.model';
import { WechatTalk } from './wechat.dto';
import * as fs from 'fs';
import { WechatUser } from './models/user.model';
import { WechatEvent } from './models/event.model';
@Injectable()
export class WechatService {

  wechats: { [key: string]: Wechaty } = {};

  constructor(
    private readonly wsService: WsService,
    @InjectModel(WechatMessage)
    private readonly messageModel: typeof WechatMessage,
    @InjectModel(WechatUser)
    private readonly userModel: typeof WechatUser,
    @InjectModel(WechatEvent)
    private readonly eventModel: typeof WechatEvent,
  ) {
    this.searchCache()
  }

  searchCache() {
    fs.readdirSync('wechat-cache').forEach(async name => {
      if (!name.endsWith('.memory-card.json')) return;
      name = name.replace('.memory-card.json', '');
      await this.create(name);
      await this.login(name);
    });
  }

  create(name: string) {
    const wechat = WechatyBuilder.build({
      name: `wechat-cache/${name}`,
      puppetOptions: {
        uos: true  // 开启uos协议
      },
      puppet: 'wechaty-puppet-wechat',
    });
    if (this.wechats[name]) {
      return { id: this.wechats[name].id}
    }
    this.wechats[name] = wechat;
    const events = [
      'scan', 'login', 'logout', 'message', 'ready', 'friendship', 
      'room-topic', 'room-invite', 'room-join', 'room-leave', 'error'
    ];
    events.forEach(event => {
      wechat.on(event as any, this.eventListener(name, event));
    });
    return { id: wechat.id };
  }

  async login(name: string) {
    if (!this.wechats[name]) {
      return { message: 'create wechat first', data: null }
    }
    if (await this.isLogin(name)) {
      return { message: 'wechat already login', data: { id: this.wechats[name].id } }
    }
    await this.wechats[name].start();
    return { message: 'wechat started', data: { id: this.wechats[name].id } }
  }

  async isLogin(name: string) {
    return this.wechats[name].isLoggedIn;
  }

  async getCurrentUser(name: string) {
    const self = this.wechats[name].currentUser;
    if (self) {
      this.saveSelf(name, self);
    };
    return self;
  }

  async call(name: string, attr: string, method: string, ...args: any[]) {
    return this.wechats[name]?.[attr]?.[method](...args) || null;
  }

  remove(name: string) {
    fs.unlink(`wechat-cache/${name}.memory-card.json`, async () => {
      await this.wechats[name].stop();
      delete this.wechats[name];
    });
  }

  getAllContacts(name: string, query: string) {
    return this.wechats[name].Contact.findAll(query);
  }

  getContact(name: string, id: string) {
    return this.wechats[name].Contact.find({ id });
  }

  getAllRooms(name: string, topic: string) {
    return this.wechats[name].Room.findAll(topic ? { topic }: undefined);
  }

  getRoom(name: string, id: string) {
    return this.wechats[name].Room.find({ id });
  }

  send({ name, to, text }: WechatTalk) {
    return this.wechats[name].Contact.find(to).then(contact => contact.say(text));
  }

  getInstance(name: string) {
    return this.wechats[name];
  }

  eventListener(name, event) {
    return (...args: any[]) => {
      try {
        if (this[`_${event}`] && typeof this[`_${event}`] === 'function') {
          this[`_${event}`](name, ...args);
        }
      } catch (error) {
        console.error(`pre-${event} event error:`, error)
      }
      this.saveEvent(name, event, args);
      this.wsService.channelSend(name, { event, args });
    };
  }

  _login(name, user: ContactSelf) {
    this.saveSelf(name, user);
  }

  _logout(name) {
    setTimeout(() => {
      this.wechats[name].stop().then(() => {
        delete this.wechats[name];
      })
    }, 2000);
  }

  async _message(name, message: Message) {
    try {
      this.messageModel.create({
        user: name,
        sender: message.talker()?.alias() || message.talker()?.name() || 'unknown',
        reciver: message.listener()?.alias() || message.talker()?.name() || 'unknown',
        type: message.type().toString() || '',
        filename: message.type() == this.wechats[name].Message.Type.Attachment ? await message.toFileBox().then(data => data?.name || '').catch(e => '') : '',
        url: message.type() == this.wechats[name].Message.Type.Url ? await message.toUrlLink().then(data => data?.url()  || '').catch(e => '') : '',
        content: message.payload?.text || 'null',
        sent_time: message.payload?.timestamp || 0,
      });
    } catch (error) {
      console.error('message error:', error);
    }
  }

  async saveSelf(name, self: Contact): Promise<WechatUser> {
    const user = await this.userModel.findOne({ where: { uid: name } });
    if (!user) {
      return this.userModel.create({
        uid: name,
        username: self.name(),
        gender: self.gender().toString(),
        region: self.province() + ' ' + self.city(),
      });
    } else {
      user.username = self.name();
      user.gender = self.gender().toString();
      user.region = self.province() + ' ' + self.city();
      return user.save();
    }
  }

  async saveEvent(name, event: string, args: any[]) {
    this.eventModel.create({
      uid: name,
      event,
      args1: JSON.stringify(args[0]),
      args2: JSON.stringify(args[1]),
      args3: JSON.stringify(args[2]),
      args4: JSON.stringify(args[3]),
    });
  }
}
