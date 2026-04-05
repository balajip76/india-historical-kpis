'use client';
import { CATEGORIES, getIndicatorsByCategory } from '@/lib/indicators';
import KPICard from './KPICard';
import { Country } from '@/types';

interface Props {
  categoryId: string;
  country: Country;
}

export default function CategorySection({ categoryId, country }: Props) {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const indicators = getIndicatorsByCategory(categoryId);

  if (!category) return null;

  return (
    <section id={categoryId} className="py-5 animate-fade-in">
      {/* Compact inline section header */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">{category.icon}</span>
          <h2 className="text-base font-bold text-[#463F3A]">{category.label}</h2>
        </div>
        <span className="text-[#BCB8B1] text-sm hidden sm:inline">·</span>
        <p className="text-xs text-[#8A817C] hidden sm:block">{category.description}</p>
        <span className="ml-auto text-[10px] text-[#BCB8B1] whitespace-nowrap">
          {country.flag} {country.name} · {indicators.length} indicators
        </span>
      </div>

      {/* KPI grid — 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {indicators.map((indicator, idx) => (
          <div
            key={indicator.id}
            className="animate-fade-in"
            style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
          >
            <KPICard indicator={indicator} countryCode={country.code} />
          </div>
        ))}
      </div>
    </section>
  );
}
