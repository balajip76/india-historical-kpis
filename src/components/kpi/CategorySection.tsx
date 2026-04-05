'use client';
import { CATEGORIES, getIndicatorsByCategory } from '@/lib/indicators';
import KPICard from './KPICard';
import { Country } from '@/types';
import { clsx } from 'clsx';

interface Props {
  categoryId: string;
  country: Country;
}

export default function CategorySection({ categoryId, country }: Props) {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const indicators = getIndicatorsByCategory(categoryId);

  if (!category) return null;

  return (
    <section id={categoryId} className="py-8 animate-fade-in">
      {/* Section header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">{category.icon}</span>
          <h2 className="text-xl font-bold text-[#463F3A]">{category.label}</h2>
        </div>
        <p className="text-sm text-[#8A817C] ml-9">{category.description}</p>
        <div className="ml-9 mt-2 flex items-center gap-2 text-xs text-[#BCB8B1]">
          <span>{country.flag} {country.name}</span>
          <span>·</span>
          <span>{indicators.length} indicators</span>
          <span>·</span>
          <span>Data from 1960–present</span>
        </div>
      </div>

      {/* KPI grid — 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {indicators.map((indicator, idx) => (
          <div
            key={indicator.id}
            className="animate-fade-in"
            style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}
          >
            <KPICard
              indicator={indicator}
              countryCode={country.code}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
