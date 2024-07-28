const commonAttr = { ellipsis: true, align: 'center', minWidth: 100, width: 100 };

export const columns = [
  { ...commonAttr, dataIndex: 'from', title: '来源', ellipsis: true, align: 'center', width: 80, minWidth: 80, responsive: ['lg'], },
  { ...commonAttr, dataIndex: 'orderNumber', title: '交易订单号', responsive: ['lg'], },
  { ...commonAttr, dataIndex: 'merchantNumber', title: '商家订单号', responsive: ['lg'], },
  { ...commonAttr, dataIndex: 'type', title: '收/支', width: 100 },
  { ...commonAttr, dataIndex: 'counterparty', title: '交易对方' },
  { ...commonAttr, dataIndex: 'description', title: '交易说明', responsive: ['md'], },
  { ...commonAttr, dataIndex: 'payment', title: '支付方式' },
  { ...commonAttr, dataIndex: 'amount', title: '金额', width: 100 },
  { ...commonAttr, dataIndex: 'status', title: '交易状态', width: 100, responsive: ['md'], },
  { ...commonAttr, dataIndex: 'category', title: '交易分类', width: 100, responsive: ['md'], },
  { ...commonAttr, dataIndex: 'transactionTime', title: '交易时间', width: 170, responsive: ['md'], },
  { ...commonAttr, dataIndex: 'remark', title: '备注', responsive: ['lg'], },
  { ...commonAttr, key: 'action', title: '操作', fixed: 'right', width: 100, responsive: ['md'], },
];
