import { ApiProperty } from "@nestjs/swagger";

// Cashflow DTO
export class CashflowDto {
  @ApiProperty({
    name: "username",
    description: "用户名",
    example: "047f9a52-68e4-4300-8748-70f71267413e",
  })
  username: string;

  @ApiProperty({ name: "type", description: "收/支", example: "支出" })
  type: string;

  @ApiProperty({
    name: "counterparty",
    description: "交易对方",
    example: "天虹",
  })
  counterparty: string;

  @ApiProperty({
    name: "description",
    description: "商品说明",
    example: "购买一台电脑",
  })
  description: string;

  @ApiProperty({ name: "payment", description: "支付方式", example: "支付宝" })
  payment: string;

  @ApiProperty({ name: "amount", description: "金额", example: 1000 })
  amount: number;

  @ApiProperty({ name: "status", description: "交易状态", example: "交易成功" })
  status: string;

  @ApiProperty({
    name: "category",
    description: "交易分类",
    example: "日常消费",
  })
  category: string;

  @ApiProperty({
    name: "orderNumber",
    description: "交易订单号",
    example: "2023020422001441591430557105",
  })
  orderNumber: string;

  @ApiProperty({
    name: "merchantNumber",
    description: "商家订单号",
    example: '"mqw034692005701',
  })
  merchantNumber: string;

  @ApiProperty({
    name: "transactionTime",
    description: "交易时间",
    example: "2020-01-01 00:00:00",
  })
  transactionTime: string;

  @ApiProperty({ name: "remark", description: "备注" })
  remark: string;

  @ApiProperty({ name: "from", description: "来源", example: "alipay" })
  from: string;
}

// 分页查询Dto
export class QueryDto {
  @ApiProperty({ name: "page", description: "页码", example: 1 })
  page: number;
  @ApiProperty({ name: "size", description: "每页数量", example: 10 })
  size: number;
  @ApiProperty({
    name: "username",
    description: "用户名",
    example: "047f9a52-68e4-4300-8748-70f71267413e",
  })
  username?: string;
  @ApiProperty({ name: "type", description: "收/支", example: "支出" })
  type?: string;
  @ApiProperty({
    name: "counterparty",
    description: "交易对方",
    example: "天虹",
  })
  counterparty?: string;
  @ApiProperty({
    name: "description",
    description: "商品说明",
    example: "购买一台电脑",
  })
  description?: string;
  @ApiProperty({ name: "payment", description: "支付方式", example: "支付宝" })
  payment?: string;
  @ApiProperty({ name: "amountMin", description: "最小金额", example: 1000 })
  amountMin?: number;
  @ApiProperty({ name: "amountMax", description: "最大金额", example: 1000 })
  amountMax?: number;
  @ApiProperty({ name: "status", description: "交易状态", example: "交易成功" })
  status?: string;
  @ApiProperty({
    name: "category",
    description: "交易分类",
    example: "日常消费",
  })
  category?: string;
  @ApiProperty({
    name: "orderNumber",
    description: "交易订单号",
    example: "2023020422001441591430557105",
  })
  orderNumber?: string;
  @ApiProperty({
    name: "merchantNumber",
    description: "商家订单号",
    example: '"mqw034692005701',
  })
  merchantNumber?: string;
  @ApiProperty({
    name: "transactionTimeStart",
    description: "交易时间开始",
    example: "2020-01-01 00:00:00",
  })
  transactionTimeStart?: string;
  @ApiProperty({
    name: "transactionTimeEnd",
    description: "交易时间结束",
    example: "2020-01-01 00:00:00",
  })
  transactionTimeEnd?: string;
  @ApiProperty({ name: "remark", description: "备注" })
  remark?: string;
}

export class SyncDto {
  @ApiProperty({ name: "type", description: "同步类型", example: "alipay" })
  type: "alipay" | "wepay";
  @ApiProperty({ name: "password", description: "解压密码", example: "123456" })
  password?: string;
}
