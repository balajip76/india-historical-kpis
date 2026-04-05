'use client';
import { Country } from '@/types';

interface Props {
  country: Country;
}

const ERA_LEGEND = [
  { color: '#463F3A', label: '1960–1991' },
  { color: '#8A817C', label: '1991–2004' },
  { color: '#BCB8B1', label: '2004–2014' },
  { color: '#E0AFA0', label: '2014–2025' },
];

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

          {/* Center description — desktop only */}
          <p className="hidden lg:block text-xs text-[#8A817C] max-w-sm leading-relaxed">
            Historical KPIs across economy, health, education, demographics, infrastructure,
            environment &amp; social equity — sourced from World Bank, IMF, WHO &amp; UN.
          </p>

          {/* Stats */}
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
              <div className="text-xl font-bold text-[#E0AFA0] leading-none">9</div>
              <div className="text-[10px] text-[#BCB8B1] mt-0.5">categories</div>
            </div>
          </div>
        </div>

        {/* Bottom legend row */}
        <div className="mt-3 pt-3 border-t border-[#8A817C]/20 flex flex-wrap items-center gap-x-5 gap-y-2">
          {/* Metric toggles */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {[
              { label: 'Actual',  desc: 'Raw values' },
              { label: 'YoY %',   desc: 'Year-on-year change' },
              { label: '% GDP',   desc: 'GDP share' },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 bg-[#E0AFA0]/20 text-[#E0AFA0] text-[10px] font-semibold rounded">
                  {m.label}
                </span>
                <span className="text-[10px] text-[#8A817C]">{m.desc}</span>
              </div>
            ))}
          </div>

          {/* Vertical divider — desktop */}
          <div className="hidden sm:block w-px h-4 bg-[#8A817C]/30 flex-shrink-0" />

          {/* Era colour legend */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="text-[10px] text-[#8A817C] font-medium uppercase tracking-wider">Eras</span>
            {ERA_LEGEND.map((e) => (
              <div key={e.label} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-sm inline-block flex-shrink-0"
                  style={{ backgroundColor: e.color, opacity: 0.65 }}
                />
                <span className="text-[10px] font-semibold text-[#BCB8B1]">{e.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
