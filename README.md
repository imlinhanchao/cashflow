<p align="center">
  <a href="https://s.hancel.org">
    <img width="200" src="./front/src/assets/icons/logo.svg">
  </a>
</p>

<h1 align="center">Cashflow 钱哪儿去了</h1>

个人消费交易记录管理分析网站应用，通过同步微信与支付宝对账单，管理个人消费交易数据。

[🌐 API 文档](https://cashflow.apifox.cn/) | [🤩 在线体验](https://s.hancel.org)

## ✨ 功能

- [x] 🔁 对账单数据同步；
- [x] 🔎 多维度数据查询；
- [x] 📄 对账单数据导出；
- [x] 📈 自定义图表统计分析；

## 🐞 开发调试

``` bash
# 安装后端依赖
npm install

# 安装前端依赖
cd front && npm install

# 运行前端
npm run dev

```

vscode 按下 F5 运行调试后端或运行 `npm run start`


## 🔨 编译发布

1. 编译生成  
``` bash
# 安装后端依赖
npm install

# 安装前端依赖
cd front && npm install

# 回到后端目录
cd ..

# 编译生成运行文件，输出到 dist 目录
npm run build

```

2. 发布部署  
  将 `package.json` 和  `dist` 目录发布到服务器，运行 `npm install` 安装依赖，运行 `node dist/main.js` 启动服务。  
  启动服务后，访问 `http://localhost:7894` 即可。可以通过环境变量 `PORT` 修改端口。

3. 配置服务  
  首次访问需配置服务，包含数据库信息，安全配置和管理员密码。  
  ![](./assets/config.webp)

可以通过 PM2 以守护进程方式启动：
  
``` bash
npm install pm2 -g
pm2 start -n cashflow node -- dist/main.js
```

## 👀 界面

![](./assets/preview.webp)
