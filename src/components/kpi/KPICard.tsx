'use client';
import { useState } from 'react';
import { Indicator, MetricView, Source } from '@/types';
import { useIndicatorData } from '@/hooks/useIndicatorData';
import KPIChart from '@/components/charts/KPIChart';
import MetricToggle from '@/components/ui/MetricToggle';
import { formatValue } from '@/lib/worldbank';
import { clsx } from 'clsx';

// ── Source URL → specific data page ──────────────────────────────────────────
function resolveSourceUrl(source: Source, wbCode: string): string {
  const u = source.url;
  if (u === 'https://data.worldbank.org')
    return `https://data.worldbank.org/indicator/${wbCode}`;
  if (u === 'https://www.imf.org/en/Publications/WEO')
    return 'https://www.imf.org/en/Publications/WEO/weo-database/2024/October';
  if (u === 'https://www.who.int/data/gho')
    return 'https://www.who.int/data/gho/data/indicators';
  if (u === 'https://hdr.undp.org')
    return 'https://hdr.undp.org/data-center/documentation-and-downloads';
  if (u === 'https://population.un.org')
    return 'https://population.un.org/dataportal/data/indicators';
  return u;
}

interface Props {
  indicator: Indicator;
  countryCode: string;
  defaultView?: MetricView;
}

export default function KPICard({ indicator, countryCode, defaultView = 'actual' }: Props) {
  const [metricView, setMetricView] = useState<MetricView>(defaultView);

  const { chartData, cagrPeriods, latestPoint, isLoading, rawData } = useIndicatorData(
    indicator, countryCode, metricView
  );

  const latestValue = latestPoint?.value;
  const latestYear  = latestPoint?.year;

  // Trend arrow from last two non-null points
  const tail = rawData.filter((d) => d.value !== null).slice(-2);
  const trend =
    tail.length === 2 && tail[0].value != null && tail[1].value != null
      ? tail[1].value > tail[0].value ? 'up'
        : tail[1].value < tail[0].value ? 'down'
        : 'flat'
      : null;

  const formattedLatest = formatValue(
    latestValue ?? null,
    indicator.format,
    indicator.scale,
    indicator.unitShort
  );

  return (
    <div className={clsx(
      'bg-white/75 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col',
      'border border-[#BCB8B1]/35',
      'shadow-sm hover:shadow-md hover:border-[#E0AFA0]/50',
      'transition-all duration-300'
    )}>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
        {/* Title + description */}
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[#463F3A] leading-snug">{indicator.label}</h3>
          <p className="text-[11px] text-[#8A817C] mt-0.5 leading-relaxed line-clamp-2">
            {indicator.description}
          </p>
        </div>

        {/* Latest value row */}
        <div className="flex items-end justify-between gap-2 flex-wrap">
          <div>
            {isLoading ? (
              <div className="skeleton h-7 w-28 mb-1 rounded-md" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold text-[#463F3A] tracking-tight tabular-nums">
                  {formattedLatest}
                </span>
                {trend && (
                  <span className={clsx(
                    'text-xs font-semibold px-1.5 py-0.5 rounded',
                    trend === 'up'   && 'bg-emerald-50 text-emerald-700',
                    trend === 'down' && 'bg-rose-50 text-rose-700',
                    trend === 'flat' && 'bg-[#BCB8B1]/20 text-[#8A817C]'
                  )}>
                    {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
                  </span>
                )}
              </div>
            )}
            {latestYear && !isLoading && (
              <p className="text-[10px] text-[#BCB8B1] mt-0.5 leading-none">
                {latestYear} · {indicator.unit}
              </p>
            )}
          </div>
          <MetricToggle
            available={indicator.availableViews}
            active={metricView}
            onChange={setMetricView}
          />
        </div>
      </div>

      {/* ── Chart ────────────────────────────────────────────────────── */}
      <div className="px-1 flex-1 min-h-0">
        {isLoading ? (
          <div className="skeleton mx-3 rounded-xl" style={{ height: 270 }} />
        ) : (
          <KPIChart
            data={chartData}
            indicator={indicator}
            metricView={metricView}
            cagrPeriods={cagrPeriods}
            height={270}
          />
        )}
      </div>

      {/* ── Source footer ─────────────────────────────────────────────── */}
      <div className="px-4 sm:px-5 py-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 border-t border-[#BCB8B1]/25 bg-[#F4F3EE]/50">
        <span className="text-[10px] text-[#BCB8B1]">Source</span>
        <span className="text-[10px] text-[#BCB8B1]">·</span>
        {indicator.sources.map((s, i) => (
          <span key={s.name} className="flex items-center gap-1">
            <a
              href={resolveSourceUrl(s, indicator.wbCode)}
              target="_blank"
              rel="noopener noreferrer"
              title={s.description}
              className="text-[10px] text-[#8A817C] hover:text-[#E0AFA0] underline underline-offset-2 transition-colors duration-150"
            >
              {s.name}
            </a>
            {i < indicator.sources.length - 1 && (
              <span className="text-[10px] text-[#BCB8B1]">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
