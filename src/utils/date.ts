import * as dayjs from 'dayjs';

export type ConfigType = dayjs.ConfigType;
export const mmt = dayjs;

export const PER_DAY_MS = 24 * 3600 * 1000;
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_FORMAT_TIME = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT_TIME_NO_SEC = 'YYYY-MM-DD HH:mm';

export function formatDate(date: ConfigType, format = DATE_FORMAT): string {
  if (!date) return '';
  return dayjs(date).format(format);
}
export function formatDateTime(date: ConfigType): string {
  return formatDate(date, DATE_FORMAT_TIME);
}
export function formatDateTimeNOSec(date: ConfigType): string {
  return formatDate(date, DATE_FORMAT_TIME_NO_SEC);
}

/** 获取时间戳 */
export function getTime(date: ConfigType): number {
  return dayjs(date).valueOf();
}

/**
 * 设置起始日期，时间为00:00:00
 * @param param 传入日期
 * @returns 带时间00:00:00的日期
 */
export function beginOfDay(param: Date) {
  return new Date(param.getFullYear(), param.getMonth(), param.getDate(), 0, 0, 0, 0);
}


/**
 * 设置结束日期，时间为23:59:59
 * @param param 传入日期
 * @returns 带时间23:59:59的日期
 */
export function endOfDay(param: Date) {
  return new Date(param.getFullYear(), param.getMonth(), param.getDate(), 23, 59, 59, 999);
}

function convertDate(param: Date | string) {
  if (typeof param === 'string') return new Date(param);

  return param;
}

/**
 * 计算两个日期间隔天数
 * @param param1 日期1
 * @param param2 日期2
 */
export function betweenDay(param1: Date, param2: Date) {
  param1 = convertDate(param1);
  param2 = convertDate(param2);
  // 计算差值
  return Math.floor((param2.getTime() - param1.getTime()) / (24 * 3600 * 1000));
}

/**
 * 日期计算
 * @param param1 日期
 * @param param2 添加的时间
 */
export function addTime(param1: Date, param2: number) {
  param1 = convertDate(param1);
  return new Date(param1.getTime() + param2);
}

/**
 * 函数“mondayOfDate”返回给定日期的星期一，如果未提供日期，则返回当前日期。
 * @param d - 参数“d”是“ConfigType”类型的可选参数，表示日期或可以解析为日期的字符串。如果没有为“d”提供值，则默认为当前日期。
 * @returns 表示给定日期的星期一的 Date 对象。
 */
export function mondayOfDate(d: ConfigType = new Date()) {
  const dy = dayjs(d).toDate();
  const d1 = +dy - (dy.getDay() - 1) * PER_DAY_MS;

  return new Date(d1);
}

/**
 * 函数“mondayOfWeek”计算给定年份中给定周数的星期一的日期。
 * @param {number} week - week 参数是一年中的第几周。它用于计算该周第一个星期一的日期。
 * @param d - 参数“d”是一个可选参数，表示您要计算一周中的星期一的日期。如果没有为“d”提供值，则默认为当前日期。
 * @returns 表示指定年份中指定周的星期一的 Date 对象。
 */
export function mondayOfWeek(week: number, d: ConfigType = new Date()) {
  const year = dayjs(d).year();
  const dy = new Date(year, 0, 1);
  const d1 = +dy - (dy.getDay() - 1) * PER_DAY_MS;

  return new Date(d1 + (week - 1) * 7 * PER_DAY_MS);
}

/**
 * 该函数计算给定日期的周数。
 * @param d - 参数“d”是“ConfigType”类型的可选参数，它可以接受“Date”对象或表示日期的字符串。如果没有为“d”提供值，则默认为当前日期。
 * @returns 给定日期的周数。
 */
export function weekOfDate(d: ConfigType = new Date()) {
  const _d = dayjs(d).toDate();
  const d0 = new Date(_d.getFullYear(), 0, 1);
  const d1 = +d0 - (d0.getDay() - _d.getDay()) * PER_DAY_MS;

  return ~~((+_d - d1) / (7 * PER_DAY_MS)) + 1;
}