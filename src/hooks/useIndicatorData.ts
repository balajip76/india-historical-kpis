'use client';
import useSWR from 'swr';
import { DataPoint, Indicator, MetricView } from '@/types';
import { computeCAGR } from '@/lib/worldbank';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useIndicatorData(
  indicator: Indicator,
  countryCode: string,
  metricView: MetricView,
  cagrStart?: number,
  cagrEnd?: number
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

  // Derive active series based on metricView
  const chartData = rawData.map((point) => {
    let displayValue: number | null = null;
    switch (metricView) {
      case 'actual':
        displayValue = point.value;
        break;
      case 'yoy':
        displayValue = point.yoy ?? null;
        break;
      case 'pct_gdp':
        displayValue = point.pct_gdp ?? null;
        break;
      case 'per_capita':
        displayValue = point.per_capita ?? null;
        break;
      default:
        displayValue = point.value;
    }
    return { year: point.year, value: displayValue };
  });

  let cagr: number | null = null;
  if (metricView === 'cagr' && rawData.length > 0) {
    const start = cagrStart ?? rawData[0].year;
    const end = cagrEnd ?? rawData[rawData.length - 1].year;
    cagr = computeCAGR(rawData, start, end);
  }

  const latestPoint = rawData.filter((d) => d.value !== null).at(-1);

  return {
    rawData,
    chartData: chartData.filter((d) => d.value !== null),
    cagr,
    latestPoint,
    isLoading,
    error,
  };
}
