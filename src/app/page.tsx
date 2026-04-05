'use client';
import { useState } from 'react';
import { DEFAULT_COUNTRY } from '@/lib/countries';
import { CATEGORIES } from '@/lib/indicators';
import { Country } from '@/types';
import Header from '@/components/layout/Header';
import CategoryNav from '@/components/layout/CategoryNav';
import HeroSection from '@/components/layout/HeroSection';
import CategorySection from '@/components/kpi/CategorySection';

export default function HomePage() {
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  function handleCategoryChange(id: string) {
    setActiveCategory(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 104; // header (56px) + nav (~48px)
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F3EE]">
      <Header country={country} onCountryChange={setCountry} />
      <HeroSection country={country} />
      <CategoryNav active={activeCategory} onChange={handleCategoryChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {CATEGORIES.map((cat, i) => (
          <div key={cat.id} id={cat.id}>
            <CategorySection categoryId={cat.id} country={country} />
            {i < CATEGORIES.length - 1 && (
              <div className="mt-2 mb-0 border-t border-[#BCB8B1]/20" />
            )}
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-[#463F3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#E0AFA0]/20 rounded-lg flex items-center justify-center">
                <span className="text-[#E0AFA0] text-xs font-bold">K</span>
              </div>
              <div>
                <div className="text-sm font-bold text-[#F4F3EE]">KPI Atlas</div>
                <div className="text-[10px] text-[#8A817C]">Historical Country Data · 1960–Present</div>
              </div>
            </div>
            <p className="text-xs text-[#8A817C] max-w-sm leading-relaxed">
              All data sourced from authoritative international institutions and is
              publicly available for research and educational use.
            </p>
          </div>

          <div className="border-t border-[#8A817C]/20 pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'World Bank', url: 'https://data.worldbank.org', desc: 'Development Indicators' },
              { name: 'IMF',        url: 'https://www.imf.org/en/Publications/WEO', desc: 'World Economic Outlook' },
              { name: 'WHO',        url: 'https://www.who.int/data/gho', desc: 'Global Health Observatory' },
              { name: 'UN',         url: 'https://population.un.org/dataportal', desc: 'Population Division' },
            ].map((src) => (
              <div key={src.name}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#E0AFA0] hover:text-[#F4F3EE] transition-colors"
                >
                  {src.name} ↗
                </a>
                <p className="text-[10px] text-[#8A817C] mt-0.5">{src.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[10px] text-[#8A817C]/60 text-center">
            Data accuracy depends on reporting from national statistical offices and international agencies. Some indicators may have data gaps.
          </p>
        </div>
      </footer>
    </div>
  );
}
