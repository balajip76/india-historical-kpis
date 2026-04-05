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
} from 'recharts';
import { DataPoint, MetricView, Indicator } from '@/types';
import { formatValue } from '@/lib/worldbank';

interface Props {
  data: { year: number; value: number | null }[];
  indicator: Indicator;
  metricView: MetricView;
  height?: number;
}

interface TooltipPayload {
  value: number;
  name: string;
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
const CHART_COLOR_NEG = '#BCB8B1';

export default function KPIChart({ data, indicator, metricView, height = 220 }: Props) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-40 text-[#BCB8B1] text-sm">
      No data available for this period
    </div>
  );

  const hasNegative = data.some((d) => (d.value ?? 0) < 0);
  const chartType = metricView === 'yoy' ? 'bar' : indicator.chartType;

  const commonProps = {
    data,
    margin: { top: 4, right: 8, left: 0, bottom: 0 },
  };

  const xAxis = (
    <XAxis
      dataKey="year"
      tick={{ fill: '#8A817C', fontSize: 11 }}
      tickLine={false}
      axisLine={false}
      interval="preserveStartEnd"
    />
  );

  const yAxis = (
    <YAxis
      tick={{ fill: '#8A817C', fontSize: 11 }}
      tickLine={false}
      axisLine={false}
      width={48}
      tickFormatter={(v) => {
        if (Math.abs(v) >= 1e9) return `${(v / 1e9).toFixed(0)}B`;
        if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
        if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
        return v.toFixed(1);
      }}
    />
  );

  const grid = <CartesianGrid strokeDasharray="3 3" stroke="#BCB8B1" opacity={0.3} />;

  const tooltip = (
    <Tooltip
      content={<CustomTooltip indicator={indicator} metricView={metricView} />}
      cursor={{ stroke: '#BCB8B1', strokeWidth: 1 }}
    />
  );

  if (chartType === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id={`grad-${indicator.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLOR} stopOpacity={0.4} />
              <stop offset="95%" stopColor={CHART_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>
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
          {grid}
          {xAxis}
          {yAxis}
          {tooltip}
          {hasNegative && <ReferenceLine y={0} stroke="#8A817C" />}
          <Bar
            dataKey="value"
            radius={[2, 2, 0, 0]}
            fill={CHART_COLOR}
            // Color negative bars differently
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label={false}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Default: line
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart {...commonProps}>
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
