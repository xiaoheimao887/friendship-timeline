import { format, formatDistanceToNow, differenceInYears, differenceInMonths, parseISO, isValid } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatDate(dateStr: string): string {
  const d = parseISO(dateStr);
  if (!isValid(d)) return dateStr;
  return format(d, 'yyyy年M月d日', { locale: zhCN });
}

export function formatDateShort(dateStr: string): string {
  const d = parseISO(dateStr);
  if (!isValid(d)) return dateStr;
  return format(d, 'yyyy.MM.dd', { locale: zhCN });
}

export function formatRelative(dateStr: string): string {
  const d = parseISO(dateStr);
  if (!isValid(d)) return '';
  return formatDistanceToNow(d, { addSuffix: true, locale: zhCN });
}

export function getDuration(fromDate: string, toDate: string = new Date().toISOString()): string {
  const from = parseISO(fromDate);
  const to = parseISO(toDate);
  if (!isValid(from) || !isValid(to)) return '';
  const years = differenceInYears(to, from);
  const months = differenceInMonths(to, from) % 12;
  if (years > 0) {
    return `${years}年${months > 0 ? `${months}个月` : ''}`;
  }
  return `${months}个月`;
}

export function groupByYear<T extends { met_date: string }>(items: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  items.forEach(item => {
    const year = item.met_date.slice(0, 4);
    if (!groups[year]) groups[year] = [];
    groups[year].push(item);
  });
  return groups;
}

export function groupByMonth<T extends { met_date: string }>(items: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  items.forEach(item => {
    const key = item.met_date.slice(0, 7);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}

export function getYearRange(items: { met_date: string }[]): [number, number] {
  if (!items.length) return [new Date().getFullYear(), new Date().getFullYear()];
  const years = items.map(i => parseInt(i.met_date.slice(0, 4)));
  return [Math.min(...years), Math.max(...years)];
}
