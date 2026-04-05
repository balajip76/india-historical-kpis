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
      const offset = 128; // header + nav height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F3EE]">
      <Header country={country} onCountryChange={setCountry} />
      <HeroSection country={country} />
      <CategoryNav active={activeCategory} onChange={handleCategoryChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} id={cat.id}>
            <CategorySection categoryId={cat.id} country={country} />
            {cat.id !== CATEGORIES[CATEGORIES.length - 1].id && (
              <div className="border-t border-[#BCB8B1]/30" />
            )}
          </div>
        ))}
      </main>

      <footer className="bg-[#463F3A] text-[#8A817C] text-xs text-center py-6 px-4">
        <p className="mb-1">
          Data sourced from{' '}
          <a href="https://data.worldbank.org" target="_blank" rel="noopener noreferrer" className="text-[#E0AFA0] hover:text-[#F4F3EE] underline">
            World Bank
          </a>
          ,{' '}
          <a href="https://www.imf.org" target="_blank" rel="noopener noreferrer" className="text-[#E0AFA0] hover:text-[#F4F3EE] underline">
            IMF
          </a>
          ,{' '}
          <a href="https://www.who.int/data/gho" target="_blank" rel="noopener noreferrer" className="text-[#E0AFA0] hover:text-[#F4F3EE] underline">
            WHO
          </a>
          , and other authoritative institutions.
        </p>
        <p>All data is publicly available for research and educational use.</p>
      </footer>
    </div>
  );
}
