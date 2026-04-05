import { DataPoint, Indicator } from '@/types';
import { CagrPeriods } from '@/hooks/useIndicatorData';

// ── helpers ───────────────────────────────────────────────────────────────────

function periodAvg(data: DataPoint[], start: number, end: number): number | null {
  const pts = data.filter((d) => d.value !== null && d.year >= start && d.year <= end);
  if (pts.length < 2) return null;
  return pts.reduce((s, d) => s + (d.value ?? 0), 0) / pts.length;
}

function fmtCagr(v: number): string {
  return `${v >= 0 ? '+' : ''}${v.toFixed(1)}%/yr`;
}

function fmtLevel(v: number, format: string, unitShort: string): string {
  if (format === 'percent') return `${v.toFixed(1)}%`;
  if (format === 'currency') {
    if (Math.abs(v) >= 1e12) return `$${(v / 1e12).toFixed(1)}T`;
    if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
    if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    return `$${v.toFixed(0)}`;
  }
  return `${v.toFixed(1)} ${unitShort}`;
}

/** How growth rate changed between two CAGR values */
function describeRateShift(prev: number | null, curr: number): string {
  if (prev === null) return 'grew';
  const diff = curr - prev;
  if (Math.abs(diff) < 0.5) return 'held steady';
  if (diff > 5) return 'surged';
  if (diff > 1.5) return 'accelerated';
  if (diff < -5) return 'slowed sharply';
  if (diff < -1.5) return 'moderated';
  return curr >= 0 ? 'continued growing' : 'contracted further';
}

/** How a level / average changed between two values */
function describeLevelShift(prev: number | null, curr: number): string {
  if (prev === null) return 'averaged';
  const pctChg = prev !== 0 ? ((curr - prev) / Math.abs(prev)) * 100 : 0;
  if (Math.abs(pctChg) < 4) return 'remained near';
  if (pctChg > 35) return 'jumped to';
  if (pctChg > 8) return 'rose to';
  if (pctChg < -35) return 'dropped sharply to';
  if (pctChg < -8) return 'fell to';
  return curr > prev ? 'edged up to' : 'edged down to';
}

// ── main export ───────────────────────────────────────────────────────────────

export function generateNarrative(
  indicator: Indicator,
  rawData: DataPoint[],
  cagrPeriods: CagrPeriods
): string {
  const { p2, p3, p4, latestYear } = cagrPeriods;

  // ── % / rate indicators — describe period averages ──────────────────────────
  if (indicator.noCAGR) {
    const avg2 = periodAvg(rawData, 1991, 2004);
    const avg3 = periodAvg(rawData, 2004, 2014);
    const avg4 = periodAvg(rawData, 2014, latestYear);

    if (avg2 === null && avg3 === null && avg4 === null) {
      return 'Insufficient data to generate a period summary.';
    }

    const sentences: string[] = [];

    if (avg2 !== null) {
      sentences.push(
        `${indicator.label} averaged ${fmtLevel(avg2, indicator.format, indicator.unitShort)} during early reforms (1991–2004).`
      );
    }

    if (avg3 !== null) {
      const verb = describeLevelShift(avg2, avg3);
      if (avg2 !== null) {
        sentences.push(
          `It ${verb} ${fmtLevel(avg3, indicator.format, indicator.unitShort)} in the high-growth decade (2004–2014).`
        );
      } else {
        sentences.push(
          `${indicator.label} averaged ${fmtLevel(avg3, indicator.format, indicator.unitShort)} in the high-growth decade (2004–2014).`
        );
      }
    }

    if (avg4 !== null) {
      const prev = avg3 ?? avg2;
      const verb = describeLevelShift(prev, avg4);
      const base = sentences.length > 0 ? 'It' : indicator.label;
      sentences.push(
        `${base} ${verb} ${fmtLevel(avg4, indicator.format, indicator.unitShort)} on average since 2014.`
      );
    }

    return sentences.join(' ');
  }

  // ── absolute indicators — describe CAGR trajectory ─────────────────────────
  if (p2 === null && p3 === null && p4 === null) {
    return 'Insufficient data to generate a period summary.';
  }

  const sentences: string[] = [];

  if (p2 !== null) {
    sentences.push(
      `${indicator.label} grew at ${fmtCagr(p2)} during early reforms (1991–2004).`
    );
  }

  if (p3 !== null) {
    const verb = describeRateShift(p2, p3);
    if (p2 !== null) {
      sentences.push(
        `Growth ${verb} to ${fmtCagr(p3)} in the high-growth decade (2004–2014).`
      );
    } else {
      sentences.push(
        `${indicator.label} grew at ${fmtCagr(p3)} in the high-growth decade (2004–2014).`
      );
    }
  }

  if (p4 !== null) {
    const prev = p3 ?? p2;
    const verb = describeRateShift(prev, p4);
    const intro = sentences.length > 0 ? 'Since 2014' : `Since 2014, ${indicator.label}`;
    sentences.push(
      `${intro}, growth ${verb} to ${fmtCagr(p4)}.`
    );
  }

  return sentences.join(' ');
}
