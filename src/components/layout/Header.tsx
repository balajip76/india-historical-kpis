'use client';
import CountrySelector from '@/components/ui/CountrySelector';
import { Country } from '@/types';

interface Props {
  country: Country;
  onCountryChange: (c: Country) => void;
}

export default function Header({ country, onCountryChange }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-[#F4F3EE]/92 backdrop-blur-md border-b border-[#BCB8B1]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 bg-[#463F3A] rounded-lg flex items-center justify-center">
            <span className="text-[#E0AFA0] text-xs font-bold">K</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-[#463F3A] leading-none">KPI Atlas</h1>
            <p className="text-[10px] text-[#BCB8B1] leading-none mt-0.5">1960–Present</p>
          </div>
          <h1 className="sm:hidden text-sm font-bold text-[#463F3A]">KPI Atlas</h1>
        </div>

        {/* Center tagline — desktop only */}
        <div className="hidden lg:flex flex-col items-center min-w-0">
          <p className="text-xs text-[#8A817C] truncate">
            {country.flag} Tracking{' '}
            <span className="font-semibold text-[#463F3A]">{country.name}</span>{' '}
            across 40+ indicators
          </p>
        </div>

        {/* Country Selector */}
        <CountrySelector selected={country} onChange={onCountryChange} />
      </div>
    </header>
  );
}
