import { Op } from 'sequelize';

export function markQuery(query: Record<string, any>): any {
  const prefixs = {
    between: Op.between,
    gt: Op.gt,
    gte: Op.gte,
    lt: Op.lt,
    lte: Op.lte,
    like: Op.like,
    ne: Op.ne,
    eq: Op.eq,
    in: Op.in,
    notIn: Op.notIn,
  }
  const arrayPrefixs = ['in', 'notIn', 'between'];
  
  Object.keys(query).forEach((key) => {
    const [prefix, field] = key.split('_');
    if (prefixs[prefix] && query[key]) {
      query[field] = {
        [prefixs[prefix]]: query[key]
      }
      if (arrayPrefixs.includes(prefix)) {
        query[field] = {
          [prefixs[prefix]]: query[key].split(',')
        }
      }
      if (prefix == 'like') {
        query[field] = {
          [prefixs[prefix]]: `%${query[key]}%`
        }
      }
      delete query[key];
    }
  })
  return query;
}