const commonAttr = { ellipsis: true, align: 'center', minWidth: 100 };

export const columns = [
  { ...commonAttr, dataIndex: 'orderNumber', title: '交易订单号' },
  { ...commonAttr, dataIndex: 'merchantNumber', title: '商家订单号' },
  { ...commonAttr, dataIndex: 'type', title: '收/支', width: 100 },
  { ...commonAttr, dataIndex: 'counterparty', title: '交易对方' },
  { ...commonAttr, dataIndex: 'description', title: '交易说明' },
  { ...commonAttr, dataIndex: 'payment', title: '支付方式' },
  { ...commonAttr, dataIndex: 'amount', title: '金额', width: 100 },
  { ...commonAttr, dataIndex: 'status', title: '交易状态', width: 100 },
  { ...commonAttr, dataIndex: 'category', title: '交易分类', width: 100 },
  { ...commonAttr, dataIndex: 'transactionTime', title: '交易时间', width: 170 },
  { ...commonAttr, dataIndex: 'remark', title: '备注' },
  { ...commonAttr, dataIndex: 'from', title: '来源', ellipsis: true, align: 'center', width: 80, minWidth: 80 },
  { ...commonAttr, key: 'action', title: '操作' },
];
