import { DataPoint, WBApiResponse, WBDataEntry } from '@/types';

const WB_BASE = 'https://api.worldbank.org/v2';

export async function fetchWBIndicator(
  countryCode: string,
  wbCode: string,
  startYear = 1960,
  endYear = 2024
): Promise<DataPoint[]> {
  const url = `${WB_BASE}/country/${countryCode}/indicator/${wbCode}?format=json&date=${startYear}:${endYear}&per_page=100&mrv=70`;

  const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h
  if (!res.ok) throw new Error(`WB API error: ${res.status}`);

  const json: [WBApiResponse, WBDataEntry[]] = await res.json();
  const entries = json[1] ?? [];

  // Sort ascending by year
  const sorted = entries
    .filter((e) => e.value !== null)
    .sort((a, b) => Number(a.date) - Number(b.date));

  return sorted.map((e) => ({
    year: Number(e.date),
    value: e.value,
  }));
}

export function computeYoY(data: DataPoint[]): DataPoint[] {
  return data.map((point, i) => {
    if (i === 0 || point.value === null) return { ...point, yoy: null };
    const prev = data[i - 1];
    if (prev.value === null || prev.value === 0) return { ...point, yoy: null };
    const yoy = ((point.value - prev.value) / Math.abs(prev.value)) * 100;
    return { ...point, yoy: Number(yoy.toFixed(2)) };
  });
}

export function computeCAGR(data: DataPoint[], startYear: number, endYear: number): number | null {
  const start = data.find((d) => d.year === startYear);
  const end = data.find((d) => d.year === endYear);
  if (!start?.value || !end?.value || start.value <= 0) return null;
  const years = endYear - startYear;
  if (years <= 0) return null;
  return (Math.pow(end.value / start.value, 1 / years) - 1) * 100;
}

export function computePctGDP(
  data: DataPoint[],
  gdpData: DataPoint[]
): DataPoint[] {
  return data.map((point) => {
    const gdp = gdpData.find((g) => g.year === point.year);
    if (!gdp?.value || !point.value) return { ...point, pct_gdp: null };
    return { ...point, pct_gdp: Number(((point.value / gdp.value) * 100).toFixed(4)) };
  });
}

export function computePerCapita(
  data: DataPoint[],
  popData: DataPoint[]
): DataPoint[] {
  return data.map((point) => {
    const pop = popData.find((p) => p.year === point.year);
    if (!pop?.value || !point.value) return { ...point, per_capita: null };
    return { ...point, per_capita: Number((point.value / pop.value).toFixed(2)) };
  });
}

// ── Formatting helpers ──────────────────────────────────────────────────────

export function formatValue(
  value: number | null | undefined,
  format: string,
  scale?: string,
  unitShort?: string
): string {
  if (value === null || value === undefined) return '—';

  switch (format) {
    case 'currency':
      return formatCurrency(value, scale);
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'number':
      return formatNumber(value, scale, unitShort);
    case 'index':
      return value.toFixed(1);
    default:
      return value.toLocaleString();
  }
}

function formatCurrency(value: number, scale?: string): string {
  if (scale === 'billions') {
    const b = value / 1e9;
    if (b >= 1000) return `$${(b / 1000).toFixed(1)}T`;
    if (b >= 1) return `$${b.toFixed(1)}B`;
    return `$${(value / 1e6).toFixed(0)}M`;
  }
  if (scale === 'millions') {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatNumber(value: number, scale?: string, unit?: string): string {
  const suffix = unit ? ` ${unit}` : '';
  if (scale === 'billions') {
    const b = value / 1e9;
    return `${b.toFixed(2)}B${suffix}`;
  }
  if (scale === 'millions') {
    const m = value / 1e6;
    if (m >= 1000) return `${(m / 1000).toFixed(2)}B${suffix}`;
    return `${m.toFixed(1)}M${suffix}`;
  }
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B${suffix}`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M${suffix}`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K${suffix}`;
  return `${value.toFixed(2)}${suffix}`;
}
