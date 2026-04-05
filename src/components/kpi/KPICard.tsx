'use client';
import { useState } from 'react';
import { Indicator, MetricView } from '@/types';
import { useIndicatorData } from '@/hooks/useIndicatorData';
import KPIChart from '@/components/charts/KPIChart';
import MetricToggle from '@/components/ui/MetricToggle';
import { formatValue } from '@/lib/worldbank';
import { clsx } from 'clsx';

interface Props {
  indicator: Indicator;
  countryCode: string;
  defaultView?: MetricView;
}

function CagrBadge({ label, value }: { label: string; value: number | null }) {
  if (value === null) return (
    <div className="flex-1 px-2 py-2 bg-[#BCB8B1]/10 rounded-lg text-center">
      <div className="text-[10px] text-[#BCB8B1] leading-none mb-1">{label}</div>
      <div className="text-xs text-[#BCB8B1]">—</div>
    </div>
  );
  const positive = value >= 0;
  return (
    <div className={clsx(
      'flex-1 px-2 py-2 rounded-lg text-center',
      positive ? 'bg-green-50' : 'bg-red-50'
    )}>
      <div className="text-[10px] text-[#8A817C] leading-none mb-1">{label}</div>
      <div className={clsx('text-sm font-bold', positive ? 'text-green-700' : 'text-red-600')}>
        {positive ? '+' : ''}{value.toFixed(1)}%
      </div>
      <div className="text-[9px] text-[#BCB8B1] mt-0.5">p.a.</div>
    </div>
  );
}

export default function KPICard({ indicator, countryCode, defaultView = 'actual' }: Props) {
  const [metricView, setMetricView] = useState<MetricView>(defaultView);

  const { chartData, cagrPeriods, latestPoint, isLoading, rawData } = useIndicatorData(
    indicator,
    countryCode,
    metricView
  );

  const latestValue = latestPoint?.value;
  const latestYear = latestPoint?.year;

  // Trend: compare last 2 non-null data points
  const trendData = rawData.filter((d) => d.value !== null).slice(-2);
  const trend =
    trendData.length === 2 && trendData[0].value && trendData[1].value
      ? trendData[1].value > trendData[0].value ? 'up'
        : trendData[1].value < trendData[0].value ? 'down'
        : 'flat'
      : null;

  const formattedLatest = formatValue(
    latestValue ?? null,
    indicator.format,
    indicator.scale,
    indicator.unitShort
  );

  const primarySource = indicator.sources[0];

  return (
    <div className={clsx(
      'bg-white/70 backdrop-blur-sm border border-[#BCB8B1]/40 rounded-2xl overflow-hidden flex flex-col',
      'transition-all duration-300 hover:shadow-md hover:border-[#E0AFA0]/60'
    )}>
      {/* ── Header ─────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[#463F3A] leading-tight">{indicator.label}</h3>
            <p className="text-xs text-[#8A817C] mt-0.5 leading-snug line-clamp-2">{indicator.description}</p>
          </div>
        </div>

        {/* Latest value + trend */}
        <div className="flex items-end justify-between gap-2 flex-wrap">
          <div>
            {isLoading ? (
              <div className="skeleton h-7 w-24 mb-1" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#463F3A] tracking-tight">
                  {formattedLatest}
                </span>
                {trend && (
                  <span className={clsx(
                    'text-xs font-medium px-1.5 py-0.5 rounded-md',
                    trend === 'up' && 'bg-green-50 text-green-700',
                    trend === 'down' && 'bg-red-50 text-red-600',
                    trend === 'flat' && 'bg-[#BCB8B1]/20 text-[#8A817C]'
                  )}>
                    {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                  </span>
                )}
              </div>
            )}
            {latestYear && (
              <span className="text-xs text-[#BCB8B1]">{latestYear} · {indicator.unit}</span>
            )}
          </div>
          <MetricToggle
            available={indicator.availableViews}
            active={metricView}
            onChange={setMetricView}
          />
        </div>

        {/* CAGR panel — shown when CAGR view is selected */}
        {metricView === 'cagr' && (
          <div className="mt-3 flex gap-2">
            <CagrBadge label="1960–1991" value={cagrPeriods.p1} />
            <CagrBadge label="1991–2014" value={cagrPeriods.p2} />
            <CagrBadge label={`2014–${cagrPeriods.latestYear}`} value={cagrPeriods.p3} />
          </div>
        )}
      </div>

      {/* ── Chart ──────────────────────────────────────── */}
      <div className="px-2 flex-1">
        {isLoading ? (
          <div className="skeleton mx-3 h-[260px] rounded-xl" />
        ) : (
          <KPIChart
            data={chartData}
            indicator={indicator}
            metricView={metricView}
            height={260}
          />
        )}
      </div>

      {/* ── Source citation ─────────────────────────────── */}
      <div className="px-5 py-2 flex items-center gap-1.5 border-t border-[#BCB8B1]/20 bg-[#F4F3EE]/40">
        <svg className="w-3 h-3 text-[#BCB8B1] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span className="text-[10px] text-[#BCB8B1]">Source:</span>
        {indicator.sources.map((s, i) => (
          <span key={s.name} className="flex items-center gap-1">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#8A817C] hover:text-[#E0AFA0] underline underline-offset-2 transition-colors"
              title={s.description}
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
