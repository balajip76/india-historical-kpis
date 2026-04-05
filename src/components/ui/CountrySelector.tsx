'use client';
import { useState, useRef, useEffect } from 'react';
import { COUNTRIES } from '@/lib/countries';
import { Country } from '@/types';
import { clsx } from 'clsx';

interface Props {
  selected: Country;
  onChange: (c: Country) => void;
}

export default function CountrySelector({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, Country[]>>((acc, c) => {
    acc[c.region] = acc[c.region] ? [...acc[c.region], c] : [c];
    return acc;
  }, {});

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#F4F3EE] border border-[#BCB8B1] rounded-xl hover:border-[#8A817C] transition-all duration-200 text-sm font-medium text-[#463F3A]"
      >
        <span className="text-lg">{selected.flag}</span>
        <span className="hidden xs:inline sm:inline flex-1 text-left">{selected.name}</span>
        <svg
          className={clsx('w-4 h-4 text-[#8A817C] transition-transform duration-200', open && 'rotate-180')}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 w-[min(18rem,calc(100vw-2rem))] bg-[#F4F3EE] border border-[#BCB8B1] rounded-xl shadow-lg overflow-hidden animate-fade-in">
          <div className="p-2 border-b border-[#BCB8B1]/50">
            <input
              autoFocus
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#BCB8B1] rounded-lg focus:outline-none focus:border-[#E0AFA0] text-[#463F3A] placeholder:text-[#BCB8B1]"
            />
          </div>
          <div className="overflow-y-auto max-h-64">
            {Object.entries(grouped).map(([region, countries]) => (
              <div key={region}>
                <div className="px-3 py-1.5 text-[10px] font-semibold text-[#BCB8B1] uppercase tracking-wider bg-[#F4F3EE]">
                  {region}
                </div>
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => { onChange(c); setOpen(false); setSearch(''); }}
                    className={clsx(
                      'w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-150',
                      c.code === selected.code
                        ? 'bg-[#E0AFA0]/20 text-[#463F3A] font-medium'
                        : 'text-[#8A817C] hover:bg-[#BCB8B1]/20 hover:text-[#463F3A]'
                    )}
                  >
                    <span className="text-base">{c.flag}</span>
                    <span>{c.name}</span>
                    {c.code === selected.code && (
                      <svg className="ml-auto w-4 h-4 text-[#E0AFA0]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-6 text-center text-sm text-[#BCB8B1]">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
