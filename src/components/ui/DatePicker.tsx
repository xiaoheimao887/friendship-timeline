import { useMemo, useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

interface SelectMenuProps {
  value: number | '';
  options: { value: number; label: string }[];
  placeholder: string;
  onChange: (v: number) => void;
}

function SelectMenu({ value, options, placeholder, onChange }: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full px-3 py-2 rounded-btn border border-warm-border bg-white text-sm transition-colors cursor-pointer text-left flex items-center justify-between gap-1
          ${!selected ? 'text-warm-muted' : 'text-warm-text'}
          ${open ? 'ring-2 ring-warm-primary/30 border-warm-primary' : ''}`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <svg className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-warm-border rounded-card-sm shadow-card max-h-[168px] overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-warm-bg
                ${opt.value === value ? 'bg-warm-primaryLight/40 text-warm-primary font-medium' : 'text-warm-text'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DatePicker({ value, onChange, className = '' }: DatePickerProps) {
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
      <SelectMenu
        value={year || ''}
        placeholder="年"
        options={years.map(y => ({ value: y, label: `${y} 年` }))}
        onChange={setYear}
      />
      <SelectMenu
        value={month || ''}
        placeholder="月"
        options={[1,2,3,4,5,6,7,8,9,10,11,12].map(m => ({ value: m, label: `${m} 月` }))}
        onChange={setMonth}
      />
      <SelectMenu
        value={day || ''}
        placeholder="日"
        options={Array.from({ length: daysInMonth }, (_, i) => ({ value: i + 1, label: `${i + 1} 日` }))}
        onChange={setDay}
      />
    </div>
  );
}
