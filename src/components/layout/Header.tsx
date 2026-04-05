'use client';
import CountrySelector from '@/components/ui/CountrySelector';
import { Country } from '@/types';

interface Props {
  country: Country;
  onCountryChange: (c: Country) => void;
}

export default function Header({ country, onCountryChange }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-[#F4F3EE]/90 backdrop-blur-md border-b border-[#BCB8B1]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#463F3A] rounded-lg flex items-center justify-center">
            <span className="text-[#E0AFA0] text-sm font-bold">K</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#463F3A] leading-none">KPI Atlas</h1>
            <p className="text-xs text-[#BCB8B1] leading-none mt-0.5">Historical Country Data · 1960–Present</p>
          </div>
        </div>

        {/* Center tagline (hidden on small screens) */}
        <div className="hidden md:flex flex-col items-center">
          <p className="text-xs text-[#8A817C]">
            {country.flag} Tracking <span className="font-semibold text-[#463F3A]">{country.name}</span> across 30+ indicators
          </p>
        </div>

        {/* Country Selector */}
        <div className="flex items-center gap-3">
          <CountrySelector selected={country} onChange={onCountryChange} />
        </div>
      </div>
    </header>
  );
}
