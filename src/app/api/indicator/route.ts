import { NextRequest, NextResponse } from 'next/server';
import { fetchWBIndicator, computeYoY, computePctGDP, computePerCapita } from '@/lib/worldbank';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get('country') ?? 'IN';
  const wbCode = searchParams.get('code');
  const withGDP = searchParams.get('gdp') === '1';
  const withPop = searchParams.get('pop') === '1';

  if (!wbCode) {
    return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
  }

  try {
    let data = await fetchWBIndicator(country, wbCode);
    data = computeYoY(data);

    if (withGDP) {
      const gdp = await fetchWBIndicator(country, 'NY.GDP.MKTP.CD');
      data = computePctGDP(data, gdp);
    }
    if (withPop) {
      const pop = await fetchWBIndicator(country, 'SP.POP.TOTL');
      data = computePerCapita(data, pop);
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
