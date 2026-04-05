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
    <section id={categoryId} className="pt-6 pb-2 animate-fade-in">
      {/* Section header — single tight row */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base leading-none">{category.icon}</span>
        <h2 className="text-sm font-bold text-[#463F3A] tracking-wide uppercase">
          {category.label}
        </h2>
        <span className="hidden sm:block text-[#BCB8B1] text-xs">·</span>
        <p className="hidden sm:block text-xs text-[#8A817C] flex-1 min-w-0 truncate">
          {category.description}
        </p>
        <span className="ml-auto text-[10px] text-[#BCB8B1] whitespace-nowrap flex-shrink-0">
          {indicators.length} indicator{indicators.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid — 1 col mobile, 2 col sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {indicators.map((indicator, idx) => (
          <div
            key={indicator.id}
            className="animate-fade-in"
            style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
          >
            <KPICard indicator={indicator} countryCode={country.code} />
          </div>
        ))}
      </div>
    </section>
  );
}
