import { useMemo } from 'react';

interface DatePickerProps {
  value: string;  // ISO date string YYYY-MM-DD
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export function DatePicker({ value, onChange, required, className = '' }: DatePickerProps) {
  const [year, month, day] = value ? value.split('-').map(Number) : [0, 0, 0];

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 51 }, (_, i) => current - i);
  }, []);

  const daysInMonth = useMemo(() => {
    if (!year || !month) return 31;
    return new Date(year, month, 0).getDate();
  }, [year, month]);

  const setYear = (y: number) => {
    const m = month || 1;
    const maxDay = new Date(y, m, 0).getDate();
    const d = Math.min(day || 1, maxDay);
    onChange(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  };

  const setMonth = (m: number) => {
    const y = year || new Date().getFullYear();
    const maxDay = new Date(y, m, 0).getDate();
    const d = Math.min(day || 1, maxDay);
    onChange(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  };

  const setDay = (d: number) => {
    const y = year || new Date().getFullYear();
    const m = month || 1;
    onChange(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        value={year || ''}
        onChange={e => setYear(Number(e.target.value))}
        className={`flex-1 px-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm transition-colors appearance-none cursor-pointer ${!year ? 'text-warm-muted' : 'text-warm-text'}`}
      >
        <option value="" disabled>年</option>
        {years.map(y => (
          <option key={y} value={y}>{y} 年</option>
        ))}
      </select>

      <select
        value={month || ''}
        onChange={e => setMonth(Number(e.target.value))}
        className={`flex-1 px-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm transition-colors appearance-none cursor-pointer ${!month ? 'text-warm-muted' : 'text-warm-text'}`}
      >
        <option value="" disabled>月</option>
        {MONTHS.map((name, i) => (
          <option key={i + 1} value={i + 1}>{name}</option>
        ))}
      </select>

      <select
        value={day || ''}
        onChange={e => setDay(Number(e.target.value))}
        className={`flex-1 px-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm transition-colors appearance-none cursor-pointer ${!day ? 'text-warm-muted' : 'text-warm-text'}`}
      >
        <option value="" disabled>日</option>
        {range(1, daysInMonth).map(d => (
          <option key={d} value={d}>{d} 日</option>
        ))}
      </select>
    </div>
  );
}
