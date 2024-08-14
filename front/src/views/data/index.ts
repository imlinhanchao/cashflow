const commonAttr = { ellipsis: true, align: 'center', minWidth: 100, width: 100 };

export const columns = [
  {
    ...commonAttr,
    dataIndex: 'name',
    title: '名称',
    ellipsis: true,
    width: 200,
    minWidth: 100,
    responsive: ['lg'],
  },
  { ...commonAttr, dataIndex: 'description', title: '描述', responsive: ['md'] },
  { ...commonAttr, key: 'fields', title: '字段', responsive: ['lg'] },
  { ...commonAttr, key: 'action', title: '操作', fixed: 'right', width: 100, responsive: ['md'] },
];
