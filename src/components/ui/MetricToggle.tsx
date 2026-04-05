'use client';
import { MetricView } from '@/types';
import { clsx } from 'clsx';

interface Option {
  value: MetricView;
  label: string;
  tooltip: string;
}

const ALL_OPTIONS: Option[] = [
  { value: 'actual',     label: 'Actual',   tooltip: 'Raw values in original units' },
  { value: 'yoy',        label: 'YoY %',    tooltip: 'Year-over-year percentage change' },
  { value: 'pct_gdp',    label: '% GDP',    tooltip: 'As a percentage of GDP' },
  { value: 'per_capita', label: '/capita',  tooltip: 'Value divided by population' },
];

interface Props {
  available: MetricView[];
  active: MetricView;
  onChange: (v: MetricView) => void;
}

export default function MetricToggle({ available, active, onChange }: Props) {
  const options = ALL_OPTIONS.filter((o) => available.includes(o.value));
  if (options.length <= 1) return null;

  return (
    <div className="flex items-center gap-0.5 bg-[#BCB8B1]/20 rounded-lg p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          title={opt.tooltip}
          onClick={() => onChange(opt.value)}
          className={clsx(
            'px-2 py-1 text-[10px] font-medium rounded-md transition-all duration-200 whitespace-nowrap',
            active === opt.value
              ? 'bg-[#463F3A] text-[#F4F3EE] shadow-sm'
              : 'text-[#8A817C] hover:text-[#463F3A] hover:bg-[#BCB8B1]/30'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
