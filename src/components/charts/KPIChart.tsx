'use client';
import {
  ResponsiveContainer,
  AreaChart, Area,
  LineChart, Line,
  BarChart,  Bar, Cell,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ReferenceLine, ReferenceArea,
} from 'recharts';
import { MetricView, Indicator } from '@/types';
import { CagrPeriods } from '@/hooks/useIndicatorData';
import { formatValue } from '@/lib/worldbank';

export const CHART_X_DOMAIN: [number, number] = [1960, 2024];

const C_ROSE  = '#E0AFA0';
const C_DARK  = '#463F3A';
const C_STONE = '#8A817C';
const C_ASH   = '#BCB8B1';

// ── Period band definitions ───────────────────────────────────────────────────
const BAND_DEFS = [
  { x1: 1960, x2: 1991, fill: C_STONE,  key: 'p1', label: 'Pre-1991' },
  { x1: 1991, x2: 2014, fill: C_ASH,    key: 'p2', label: '1991–2014' },
  { x1: 2014, x2: 2024, fill: C_ROSE,   key: 'p3', label: '2014+' },
] as const;

// ── CAGR in-band annotation ───────────────────────────────────────────────────
interface AnnotationProps {
  viewBox?: { x: number; y: number; width: number; height: number };
  periodLabel: string;
  cagr: number | null;
  bandFill: string;
}

function PeriodAnnotation({ viewBox, periodLabel, cagr, bandFill }: AnnotationProps) {
  if (!viewBox) return null;
  const { x, y, width } = viewBox;
  if (width < 28) return null;

  const cx = x + width / 2;
  const hasCAGR = cagr !== null;
  const positive = hasCAGR && cagr! >= 0;
  const cagrColor = positive ? '#15803d' : '#b91c1c';
  const arrow = !hasCAGR ? '' : cagr! > 0.05 ? '▲' : cagr! < -0.05 ? '▼' : '→';
  const cagrStr = hasCAGR
    ? `${cagr! >= 0 ? '+' : ''}${cagr!.toFixed(1)}%`
    : null;

  return (
    <g style={{ userSelect: 'none', pointerEvents: 'none' }}>
      {/* Period name */}
      <text
        x={cx} y={y + 13}
        textAnchor="middle"
        fontSize={8} fontWeight={700}
        fill={C_DARK} fillOpacity={0.45}
        letterSpacing={0.3}
      >
        {periodLabel}
      </text>

      {/* "CAGR" label */}
      {hasCAGR && (
        <text
          x={cx} y={y + 24}
          textAnchor="middle"
          fontSize={7} fontWeight={600}
          fill={C_STONE} fillOpacity={0.5}
          letterSpacing={0.5}
        >
          CAGR
        </text>
      )}

      {/* Arrow + value */}
      {hasCAGR && (
        <text
          x={cx} y={y + 35}
          textAnchor="middle"
          fontSize={10} fontWeight={800}
          fill={cagrColor} fillOpacity={0.85}
        >
          {arrow} {cagrStr}
        </text>
      )}
    </g>
  );
}

// ── Period bands renderer ─────────────────────────────────────────────────────
function periodBands(cagrPeriods?: CagrPeriods) {
  const cagrMap: Record<string, number | null> = {
    p1: cagrPeriods?.p1 ?? null,
    p2: cagrPeriods?.p2 ?? null,
    p3: cagrPeriods?.p3 ?? null,
  };

  return BAND_DEFS.map((b) => (
    <ReferenceArea
      key={b.label}
      x1={b.x1}
      x2={b.x2}
      fill={b.fill}
      fillOpacity={0.07}
      stroke={b.fill}
      strokeOpacity={0.2}
      strokeWidth={1}
      label={
        <PeriodAnnotation
          periodLabel={b.label}
          cagr={cagrMap[b.key]}
          bandFill={b.fill}
        />
      }
    />
  ));
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function CustomTooltip({
  active, payload, label, indicator, metricView,
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
  if      (metricView === 'yoy')        formatted = `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  else if (metricView === 'pct_gdp')    formatted = `${value.toFixed(2)}% of GDP`;
  else if (metricView === 'per_capita') formatted = formatValue(value, indicator.format, 'none', indicator.unitShort);
  else                                  formatted = formatValue(value, indicator.format, indicator.scale, indicator.unitShort);

  return (
    <div className="bg-[#463F3A] text-[#F4F3EE] px-3 py-2 rounded-lg shadow-xl text-sm">
      <div className="font-semibold text-[#E0AFA0] mb-0.5 text-xs">{label}</div>
      <div className="font-medium">{formatted}</div>
    </div>
  );
}

// ── Shared axes ───────────────────────────────────────────────────────────────
function XAxis_() {
  return (
    <XAxis
      dataKey="year"
      type="number"
      domain={CHART_X_DOMAIN}
      allowDataOverflow={false}
      tickCount={7}
      tick={{ fill: C_STONE, fontSize: 10 }}
      tickLine={false}
      axisLine={false}
      tickFormatter={(v) => String(v)}
    />
  );
}

function YAxis_() {
  return (
    <YAxis
      tick={{ fill: C_STONE, fontSize: 10 }}
      tickLine={false}
      axisLine={false}
      width={44}
      tickFormatter={(v) => {
        const a = Math.abs(v);
        if (a >= 1e12) return `${(v / 1e12).toFixed(1)}T`;
        if (a >= 1e9)  return `${(v / 1e9).toFixed(1)}B`;
        if (a >= 1e6)  return `${(v / 1e6).toFixed(1)}M`;
        if (a >= 1e3)  return `${(v / 1e3).toFixed(1)}K`;
        return Number(v.toFixed(1)).toString();
      }}
    />
  );
}

const GRID = <CartesianGrid strokeDasharray="3 3" stroke={C_ASH} opacity={0.22} />;
const MARGIN = { top: 42, right: 6, left: 0, bottom: 0 };

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  data: { year: number; value: number | null }[];
  indicator: Indicator;
  metricView: MetricView;
  cagrPeriods?: CagrPeriods;
  height?: number;
}

export default function KPIChart({ data, indicator, metricView, cagrPeriods, height = 270 }: Props) {
  if (!data.length) {
    return (
      <div style={{ height }} className="flex flex-col items-center justify-center gap-2 text-[#BCB8B1]">
        <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="text-xs">No data available</span>
      </div>
    );
  }

  const hasNegative = data.some((d) => (d.value ?? 0) < 0);
  // YoY always renders as bar; otherwise use indicator's preferred type
  const chartType = metricView === 'yoy' ? 'bar' : indicator.chartType;

  const tooltip = (
    <Tooltip
      content={<CustomTooltip indicator={indicator} metricView={metricView} />}
      cursor={{ stroke: C_ASH, strokeWidth: 1 }}
    />
  );

  const bands = periodBands(cagrPeriods);
  const commonProps = { data, margin: MARGIN };

  // ── Area ────────────────────────────────────────────────────────────────────
  if (chartType === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id={`g-${indicator.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={C_ROSE} stopOpacity={0.45} />
              <stop offset="95%" stopColor={C_ROSE} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {bands}
          {GRID}
          <XAxis_ />
          <YAxis_ />
          {tooltip}
          {hasNegative && <ReferenceLine y={0} stroke={C_ASH} strokeDasharray="3 3" />}
          <Area
            type="monotone"
            dataKey="value"
            stroke={C_ROSE}
            strokeWidth={2}
            fill={`url(#g-${indicator.id})`}
            dot={false}
            activeDot={{ r: 4, fill: C_ROSE, stroke: '#F4F3EE', strokeWidth: 2 }}
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // ── Bar (incl. YoY) ─────────────────────────────────────────────────────────
  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart {...commonProps}>
          {bands}
          {GRID}
          <XAxis_ />
          <YAxis_ />
          {tooltip}
          {hasNegative && <ReferenceLine y={0} stroke={C_STONE} />}
          <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={10}>
            {data.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={(entry.value ?? 0) >= 0 ? C_ROSE : '#b25f5f'}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // ── Line ────────────────────────────────────────────────────────────────────
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart {...commonProps}>
        {bands}
        {GRID}
        <XAxis_ />
        <YAxis_ />
        {tooltip}
        {hasNegative && <ReferenceLine y={0} stroke={C_ASH} strokeDasharray="3 3" />}
        <Line
          type="monotone"
          dataKey="value"
          stroke={C_DARK}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: C_DARK, stroke: '#F4F3EE', strokeWidth: 2 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
