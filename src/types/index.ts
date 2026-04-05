export type MetricView = 'actual' | 'yoy' | 'pct_gdp' | 'per_capita';

export interface Country {
  code: string; // ISO2
  name: string;
  flag: string;
  region: string;
}

export interface IndicatorCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export interface Indicator {
  id: string;
  categoryId: string;
  label: string;
  description: string;
  wbCode: string; // World Bank indicator code
  unit: string;
  unitShort: string;
  format: 'number' | 'percent' | 'currency' | 'index';
  scale?: 'billions' | 'millions' | 'thousands' | 'none';
  availableViews: MetricView[];
  sources: Source[];
  chartType: 'line' | 'area' | 'bar';
  noCAGR?: boolean; // true for indicators that are themselves rates/growth metrics
  notes?: string;
}

export interface Source {
  name: string;
  url: string;
  description: string;
}

export interface DataPoint {
  year: number;
  value: number | null;
  yoy?: number | null;
  pct_gdp?: number | null;
  per_capita?: number | null;
}

export interface IndicatorData {
  indicatorId: string;
  countryCode: string;
  data: DataPoint[];
  lastUpdated: string;
}

export interface WBApiResponse {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  sourceid: string;
  lastupdated: string;
}

export interface WBDataEntry {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export type TimeRange = '1960-2000' | '2000-2010' | '2010-present' | 'all' | 'custom';
