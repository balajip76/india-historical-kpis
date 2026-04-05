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
    <section id={categoryId} className="pt-8 pb-2 animate-fade-in">
      {/* Section header */}
      <div
        className="flex items-start gap-4 mb-5 pl-4 border-l-4"
        style={{ borderColor: category.color }}
      >
        {/* Icon box */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
          style={{ backgroundColor: `${category.color}18` }}
        >
          {category.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-[#463F3A] leading-tight">
              {category.label}
            </h2>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {indicators.length} indicator{indicators.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-[#8A817C] mt-0.5 leading-relaxed">
            {category.description}
          </p>
        </div>
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
