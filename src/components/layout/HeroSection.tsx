'use client';
import { Country } from '@/types';

interface Props {
  country: Country;
}

export default function HeroSection({ country }: Props) {
  return (
    <div className="bg-[#463F3A] text-[#F4F3EE] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{country.flag}</span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F3EE] leading-tight">
                  {country.name}
                </h2>
                <p className="text-sm text-[#BCB8B1]">{country.region}</p>
              </div>
            </div>
            <p className="text-sm text-[#8A817C] max-w-xl leading-relaxed mt-3">
              Comprehensive historical KPIs tracking {country.name}&rsquo;s development across economy,
              health, education, demographics, infrastructure, environment, and social equity.
              All data sourced from World Bank, IMF, WHO, UN, and other authoritative institutions.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div className="text-xs text-[#8A817C] uppercase tracking-wider">Coverage</div>
            <div className="text-2xl font-bold text-[#E0AFA0]">65+</div>
            <div className="text-xs text-[#BCB8B1]">years of data (1960–present)</div>
            <div className="text-2xl font-bold text-[#E0AFA0] mt-1">30+</div>
            <div className="text-xs text-[#BCB8B1]">indicators across 7 categories</div>
          </div>
        </div>

        {/* Metric view legend */}
        <div className="mt-6 pt-6 border-t border-[#8A817C]/20 flex flex-wrap gap-4">
          {[
            { label: 'Actual', desc: 'Raw values in original units' },
            { label: 'YoY %', desc: 'Year-over-year growth rate' },
            { label: 'CAGR', desc: 'Compound annual growth rate' },
            { label: '% GDP', desc: 'As share of gross domestic product' },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#E0AFA0]/20 text-[#E0AFA0] text-xs font-semibold rounded-md">
                {m.label}
              </span>
              <span className="text-xs text-[#8A817C]">{m.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
