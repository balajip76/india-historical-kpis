'use client';
import { Country } from '@/types';

interface Props {
  country: Country;
}

export default function HeroSection({ country }: Props) {
  return (
    <div className="bg-[#463F3A] text-[#F4F3EE] py-4 sm:py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Single compact row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: country identity */}
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl leading-none">{country.flag}</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#F4F3EE] leading-tight">
                {country.name}
              </h2>
              <p className="text-xs text-[#BCB8B1]">{country.region}</p>
            </div>
          </div>

          {/* Center: description — hidden on mobile */}
          <p className="hidden lg:block text-xs text-[#8A817C] max-w-sm leading-relaxed">
            Historical KPIs across economy, health, education, demographics, infrastructure,
            environment &amp; social equity — sourced from World Bank, IMF, WHO &amp; UN.
          </p>

          {/* Right: stats */}
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className="text-xl font-bold text-[#E0AFA0] leading-none">65+</div>
              <div className="text-[10px] text-[#BCB8B1] mt-0.5">years</div>
            </div>
            <div className="w-px h-6 bg-[#8A817C]/30" />
            <div className="text-center">
              <div className="text-xl font-bold text-[#E0AFA0] leading-none">40+</div>
              <div className="text-[10px] text-[#BCB8B1] mt-0.5">indicators</div>
            </div>
            <div className="w-px h-6 bg-[#8A817C]/30" />
            <div className="text-center">
              <div className="text-xl font-bold text-[#E0AFA0] leading-none">8</div>
              <div className="text-[10px] text-[#BCB8B1] mt-0.5">categories</div>
            </div>
          </div>
        </div>

        {/* Metric legend — compact pill row */}
        <div className="mt-3 pt-3 border-t border-[#8A817C]/20 flex flex-wrap gap-x-4 gap-y-1.5">
          {[
            { label: 'Actual', desc: 'Raw values' },
            { label: 'YoY %', desc: 'Year-on-year change' },
            { label: 'CAGR', desc: '3 preset eras' },
            { label: '% GDP', desc: 'GDP share' },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-[#E0AFA0]/20 text-[#E0AFA0] text-[10px] font-semibold rounded">
                {m.label}
              </span>
              <span className="text-[10px] text-[#8A817C]">{m.desc}</span>
            </div>
          ))}
          <div className="flex items-center gap-3 ml-auto">
            {[
              { color: '#8A817C', label: 'Pre-1991' },
              { color: '#BCB8B1', label: '1991–2014' },
              { color: '#E0AFA0', label: '2014+' },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-2.5 rounded-sm inline-block opacity-60"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-[10px] text-[#8A817C]">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
