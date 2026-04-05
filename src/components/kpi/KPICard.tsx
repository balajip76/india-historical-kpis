'use client';
import { useState, useCallback } from 'react';
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

export default function KPICard({ indicator, countryCode, defaultView = 'actual' }: Props) {
  const [metricView, setMetricView] = useState<MetricView>(defaultView);
  const [cagrStart, setCagrStart] = useState<number>(2000);
  const [cagrEnd, setCagrEnd] = useState<number>(2023);
  const [expanded, setExpanded] = useState(false);

  const { chartData, cagr, latestPoint, isLoading, rawData } = useIndicatorData(
    indicator,
    countryCode,
    metricView,
    cagrStart,
    cagrEnd
  );

  const latestValue = latestPoint?.value;
  const latestYear = latestPoint?.year;

  // Compute trend (compare last 2 data points)
  const trendData = rawData.filter((d) => d.value !== null).slice(-2);
  const trend =
    trendData.length === 2 && trendData[0].value && trendData[1].value
      ? trendData[1].value > trendData[0].value
        ? 'up'
        : trendData[1].value < trendData[0].value
        ? 'down'
        : 'flat'
      : null;

  const formattedLatest = formatValue(
    latestValue ?? null,
    indicator.format,
    indicator.scale,
    indicator.unitShort
  );

  return (
    <div
      className={clsx(
        'bg-white/70 backdrop-blur-sm border border-[#BCB8B1]/40 rounded-2xl overflow-hidden',
        'transition-all duration-300 hover:shadow-md hover:border-[#E0AFA0]/60',
        'group'
      )}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[#463F3A] leading-tight">{indicator.label}</h3>
            <p className="text-xs text-[#8A817C] mt-0.5 leading-snug line-clamp-2">{indicator.description}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 p-1.5 rounded-lg text-[#BCB8B1] hover:text-[#8A817C] hover:bg-[#BCB8B1]/20 transition-colors"
            title="Show sources & details"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Latest value */}
        <div className="flex items-end justify-between">
          <div>
            {isLoading ? (
              <div className="skeleton h-7 w-24 mb-1" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#463F3A] tracking-tight">
                  {formattedLatest}
                </span>
                {trend && (
                  <span
                    className={clsx(
                      'text-xs font-medium px-1.5 py-0.5 rounded-md',
                      trend === 'up' ? 'bg-green-50 text-green-700' : '',
                      trend === 'down' ? 'bg-red-50 text-red-600' : '',
                      trend === 'flat' ? 'bg-[#BCB8B1]/20 text-[#8A817C]' : ''
                    )}
                  >
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

        {/* CAGR controls */}
        {metricView === 'cagr' && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-[#BCB8B1]/10 rounded-lg">
            <span className="text-xs text-[#8A817C] font-medium">CAGR</span>
            <input
              type="number"
              value={cagrStart}
              min={1960}
              max={cagrEnd - 1}
              onChange={(e) => setCagrStart(Number(e.target.value))}
              className="w-20 px-2 py-1 text-xs border border-[#BCB8B1] rounded-md bg-white focus:outline-none focus:border-[#E0AFA0] text-[#463F3A]"
            />
            <span className="text-xs text-[#BCB8B1]">→</span>
            <input
              type="number"
              value={cagrEnd}
              min={cagrStart + 1}
              max={2024}
              onChange={(e) => setCagrEnd(Number(e.target.value))}
              className="w-20 px-2 py-1 text-xs border border-[#BCB8B1] rounded-md bg-white focus:outline-none focus:border-[#E0AFA0] text-[#463F3A]"
            />
            {cagr !== null && (
              <span className="ml-auto text-sm font-bold text-[#463F3A]">
                {cagr >= 0 ? '+' : ''}{cagr.toFixed(2)}% p.a.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="px-2 pb-4">
        {isLoading ? (
          <div className="skeleton mx-3 h-48 rounded-xl" />
        ) : (
          <KPIChart
            data={chartData}
            indicator={indicator}
            metricView={metricView}
            height={200}
          />
        )}
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="border-t border-[#BCB8B1]/30 px-5 py-4 bg-[#F4F3EE]/60 animate-fade-in">
          <p className="text-xs font-semibold text-[#8A817C] uppercase tracking-wider mb-2">Sources</p>
          <div className="space-y-1.5">
            {indicator.sources.map((s) => (
              <div key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#E0AFA0] hover:text-[#463F3A] font-medium underline underline-offset-2 transition-colors"
                >
                  {s.name}
                </a>
                <p className="text-xs text-[#BCB8B1] leading-snug">{s.description}</p>
              </div>
            ))}
          </div>
          {indicator.notes && (
            <p className="text-xs text-[#8A817C] mt-3 leading-snug">{indicator.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
