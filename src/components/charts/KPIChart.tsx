'use client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { MetricView, Indicator, Source } from '@/types';
import { formatValue } from '@/lib/worldbank';

// Shared global x-axis domain across all charts for visual consistency
export const CHART_X_DOMAIN: [number, number] = [1960, 2024];

// Three historical periods — always rendered as subtle bands
const PERIODS = [
  { x1: 1960, x2: 1991, fill: '#463F3A', label: 'Pre-1991' },
  { x1: 1991, x2: 2014, fill: '#8A817C', label: '1991–2014' },
  { x1: 2014, x2: 2024, fill: '#E0AFA0', label: '2014+' },
];

interface Props {
  data: { year: number; value: number | null }[];
  indicator: Indicator;
  metricView: MetricView;
  height?: number;
}

function CustomTooltip({
  active,
  payload,
  label,
  indicator,
  metricView,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  indicator: Indicator;
  metricView: MetricView;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  let formatted = '';
  if (metricView === 'yoy') {
    formatted = `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  } else if (metricView === 'pct_gdp') {
    formatted = `${value.toFixed(2)}% of GDP`;
  } else if (metricView === 'per_capita') {
    formatted = formatValue(value, indicator.format, 'none', indicator.unitShort);
  } else {
    formatted = formatValue(value, indicator.format, indicator.scale, indicator.unitShort);
  }

  return (
    <div className="bg-[#463F3A] text-[#F4F3EE] px-3 py-2 rounded-lg shadow-xl text-sm border border-[#8A817C]/20">
      <div className="font-semibold text-[#E0AFA0] mb-0.5">{label}</div>
      <div>{formatted}</div>
    </div>
  );
}

const CHART_COLOR = '#E0AFA0';
const CHART_COLOR_DARK = '#463F3A';

// Subtle period bands — rendered below the data series
function periodBands() {
  return PERIODS.map((p) => (
    <ReferenceArea
      key={p.label}
      x1={p.x1}
      x2={p.x2}
      fill={p.fill}
      fillOpacity={0.055}
      stroke={p.fill}
      strokeOpacity={0.15}
      strokeWidth={1}
      label={{
        value: p.label,
        position: 'insideTopLeft',
        fontSize: 9,
        fill: p.fill,
        fillOpacity: 0.55,
        dy: 4,
        dx: 4,
      }}
    />
  ));
}

export default function KPIChart({ data, indicator, metricView, height = 260 }: Props) {
  const hasNegative = data.some((d) => (d.value ?? 0) < 0);
  const chartType = metricView === 'yoy' ? 'bar' : indicator.chartType;

  const commonProps = {
    data,
    margin: { top: 16, right: 8, left: 0, bottom: 0 },
  };

  const xAxis = (
    <XAxis
      dataKey="year"
      type="number"
      domain={CHART_X_DOMAIN}
      allowDataOverflow={false}
      tickCount={7}
      tick={{ fill: '#8A817C', fontSize: 10 }}
      tickLine={false}
      axisLine={false}
      tickFormatter={(v) => String(v)}
    />
  );

  const yAxis = (
    <YAxis
      tick={{ fill: '#8A817C', fontSize: 10 }}
      tickLine={false}
      axisLine={false}
      width={50}
      tickFormatter={(v) => {
        const abs = Math.abs(v);
        if (abs >= 1e12) return `${(v / 1e12).toFixed(1)}T`;
        if (abs >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
        if (abs >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
        if (abs >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
        return Number(v.toFixed(1)).toString();
      }}
    />
  );

  const grid = <CartesianGrid strokeDasharray="3 3" stroke="#BCB8B1" opacity={0.25} />;

  const tooltip = (
    <Tooltip
      content={<CustomTooltip indicator={indicator} metricView={metricView} />}
      cursor={{ stroke: '#BCB8B1', strokeWidth: 1 }}
    />
  );

  if (!data.length) {
    return (
      <div style={{ height }} className="flex items-center justify-center text-[#BCB8B1] text-sm">
        No data available
      </div>
    );
  }

  if (chartType === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id={`grad-${indicator.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLOR} stopOpacity={0.45} />
              <stop offset="95%" stopColor={CHART_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {periodBands()}
          {grid}
          {xAxis}
          {yAxis}
          {tooltip}
          {hasNegative && <ReferenceLine y={0} stroke="#BCB8B1" strokeDasharray="3 3" />}
          <Area
            type="monotone"
            dataKey="value"
            stroke={CHART_COLOR}
            strokeWidth={2}
            fill={`url(#grad-${indicator.id})`}
            dot={false}
            activeDot={{ r: 4, fill: CHART_COLOR, stroke: '#F4F3EE', strokeWidth: 2 }}
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart {...commonProps}>
          {periodBands()}
          {grid}
          {xAxis}
          {yAxis}
          {tooltip}
          {hasNegative && <ReferenceLine y={0} stroke="#8A817C" />}
          <Bar
            dataKey="value"
            radius={[2, 2, 0, 0]}
            fill={CHART_COLOR}
            maxBarSize={10}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Default: line
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart {...commonProps}>
        {periodBands()}
        {grid}
        {xAxis}
        {yAxis}
        {tooltip}
        {hasNegative && <ReferenceLine y={0} stroke="#BCB8B1" strokeDasharray="3 3" />}
        <Line
          type="monotone"
          dataKey="value"
          stroke={CHART_COLOR_DARK}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: CHART_COLOR_DARK, stroke: '#F4F3EE', strokeWidth: 2 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
