'use client';
import { CATEGORIES } from '@/lib/indicators';
import { clsx } from 'clsx';

interface Props {
  active: string;
  onChange: (id: string) => void;
}

export default function CategoryNav({ active, onChange }: Props) {
  return (
    <nav className="sticky top-14 z-30 bg-[#F4F3EE]/95 backdrop-blur-sm border-b border-[#BCB8B1]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Fade gradient to hint at horizontal scroll on mobile */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#F4F3EE]/90 to-transparent z-10 sm:hidden" />
        <div
          className="flex items-center gap-1 overflow-x-auto py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap',
                'transition-all duration-200 flex-shrink-0',
                active === cat.id
                  ? 'bg-[#463F3A] text-[#F4F3EE] shadow-sm'
                  : 'text-[#8A817C] hover:bg-[#BCB8B1]/25 hover:text-[#463F3A]'
              )}
            >
              <span className="text-sm leading-none">{cat.icon}</span>
              <span className="hidden xs:inline sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
