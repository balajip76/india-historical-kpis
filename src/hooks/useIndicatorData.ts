'use client';
import useSWR from 'swr';
import { DataPoint, Indicator, MetricView } from '@/types';
import { computeCAGR } from '@/lib/worldbank';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export interface CagrPeriods {
  p1: number | null; // 1960–1991  pre-liberalisation
  p2: number | null; // 1991–2014  post-liberalisation
  p3: number | null; // 2014–latest  recent era
  latestYear: number;
}

export function useIndicatorData(
  indicator: Indicator,
  countryCode: string,
  metricView: MetricView
) {
  const withGDP = metricView === 'pct_gdp' && indicator.availableViews.includes('pct_gdp');
  const withPop = metricView === 'per_capita' && indicator.availableViews.includes('per_capita');

  const url =
    `/api/indicator?country=${countryCode}&code=${indicator.wbCode}` +
    `${withGDP ? '&gdp=1' : ''}` +
    `${withPop ? '&pop=1' : ''}`;

  const { data, error, isLoading } = useSWR<{ data: DataPoint[] }>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300_000,
  });

  const rawData = data?.data ?? [];

  // For CAGR mode we still show actual values on the chart; stats shown separately
  const chartData = rawData.map((point) => {
    let displayValue: number | null = null;
    switch (metricView) {
      case 'yoy':
        displayValue = point.yoy ?? null;
        break;
      case 'pct_gdp':
        displayValue = point.pct_gdp ?? null;
        break;
      case 'per_capita':
        displayValue = point.per_capita ?? null;
        break;
      // 'cagr' shows the actual series; stats shown in separate panel
      default:
        displayValue = point.value;
    }
    return { year: point.year, value: displayValue };
  });

  // Three preset CAGR periods (always computed from actual values)
  const validData = rawData.filter((d) => d.value !== null);
  const latestYear = validData.at(-1)?.year ?? 2024;

  const cagrPeriods: CagrPeriods = {
    p1: computeCAGR(rawData, 1960, 1991),
    p2: computeCAGR(rawData, 1991, 2014),
    p3: computeCAGR(rawData, 2014, latestYear),
    latestYear,
  };

  const latestPoint = validData.at(-1);

  return {
    rawData,
    chartData: chartData.filter((d) => d.value !== null),
    cagrPeriods,
    latestPoint,
    isLoading,
    error,
  };
}
