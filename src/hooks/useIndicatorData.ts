'use client';
import useSWR from 'swr';
import { DataPoint, Indicator, MetricView } from '@/types';
import { computeCAGR } from '@/lib/worldbank';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export interface CagrPeriods {
  p1: number | null; // 1960–1991  pre-liberalisation
  p2: number | null; // 1991–2004  early reforms / coalition era
  p3: number | null; // 2004–2014  UPA high-growth decade
  p4: number | null; // 2014–latest NDA / Modi era
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

  const chartData = rawData.map((point) => {
    let displayValue: number | null = null;
    switch (metricView) {
      case 'yoy':        displayValue = point.yoy       ?? null; break;
      case 'pct_gdp':    displayValue = point.pct_gdp   ?? null; break;
      case 'per_capita': displayValue = point.per_capita ?? null; break;
      default:           displayValue = point.value;
    }
    return { year: point.year, value: displayValue };
  });

  const validData = rawData.filter((d) => d.value !== null);
  const latestYear = validData.at(-1)?.year ?? 2024;

  // Four political-era periods — computed from actual values and rendered on chart bands
  const cagrPeriods: CagrPeriods = {
    p1: computeCAGR(rawData, 1960, 1991),
    p2: computeCAGR(rawData, 1991, 2004),
    p3: computeCAGR(rawData, 2004, 2014),
    p4: computeCAGR(rawData, 2014, latestYear),
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
