const toString = Object.prototype.toString;

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined';
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val);
}

export function isObject(val: any): boolean {
  return val !== null && is(val, 'Object');
}

export function isEmpty(val: any): boolean{
  if (isArray(val) || isString(val)) {
    return val.length === 0;
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0;
  }

  return false;
}

export function isDate(val: unknown): boolean {
  return is(val, 'Date');
}

export function isNull(val: unknown): boolean {
  return val === null;
}

export function isNullAndUnDef(val: unknown): boolean {
  return isUnDef(val) && isNull(val);
}

export function isNullOrUnDef(val: unknown): boolean {
  return isUnDef(val) || isNull(val);
}

export function isNumber(val: unknown): boolean {
  return is(val, 'Number');
}

export function isString(val: unknown): boolean {
  return is(val, 'String');
}

export function isFunction(val: unknown): boolean {
  return typeof val === 'function';
}

export function isBoolean(val: unknown): boolean {
  return is(val, 'Boolean');
}

export function isRegExp(val: unknown): boolean {
  return is(val, 'RegExp');
}

export function isArray(val: any): boolean {
  return val && Array.isArray(val);
}

export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map');
}

export const isServer = typeof window === 'undefined';

export const isClient = !isServer;

export function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}

export function isHttpUrl(path: string): boolean {
  const reg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
  return reg.test(path);
}
