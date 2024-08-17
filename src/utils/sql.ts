import { FindAttributeOptions, Op, Order, col, fn } from "sequelize";
import {
  DataFieldDto,
  DataOrderDto,
  SQLFn,
  SQLWhereDto,
  SQLWhereItem,
} from "src/core/Dto/common.dto";

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
  };
  const arrayPrefixs = ["in", "notIn", "between"];

  Object.keys(query).forEach((key) => {
    const [prefix, ...fields] = key.split("_");
    const field = fields.join("_");
    if (prefixs[prefix] && query[key]) {
      query[field] = {
        [prefixs[prefix]]: query[key],
      };
      if (arrayPrefixs.includes(prefix)) {
        query[field] = {
          [prefixs[prefix]]: query[key].split(","),
        };
      }
      if (prefix == "like") {
        query[field] = {
          [prefixs[prefix]]: `%${query[key]}%`,
        };
      }
      delete query[key];
    }
  });
  return query;
}

export function markWhere(where?: SQLWhereDto) {
  if (!where) return {};
  const op = where.relational == "and" ? Op.and : Op.or;
  return {
    [op]: where.items.map((item) => {
      if ((item as SQLWhereDto).relational) {
        return markWhere(item as SQLWhereDto);
      } else {
        return markQuery(item as SQLWhereItem);
      }
    }),
  };
}

export function markFields(fields: DataFieldDto[]): FindAttributeOptions {
  return fields.map((field) => {
    if (field.fun) {
      return [markFnField(field.fun), field.label];
    } else {
      return [field.field, field.label];
    }
  });
}

export function markOrder(fields: DataOrderDto[]): Order {
  return fields.map((field) => {
    if (field.fun) {
      return [markFnField(field.fun), field.order];
    } else {
      return [field.field, field.order];
    }
  });
}

export function markFnField(field: SQLFn) {
  return fn(
    field.name,
    ...field.params.map((param) => {
      if (param.type == "value") {
        return param.value;
      } else if (param.type == "col") {
        return col(param.value as string);
      } else {
        return markFnField(param.value as SQLFn);
      }
    })
  );
}
