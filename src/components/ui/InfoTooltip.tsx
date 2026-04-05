'use client';
import { useState, useRef, useCallback } from 'react';

interface Props {
  content: string;
}

export default function InfoTooltip({ content }: Props) {
  const [open, setOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setOpen(true);
  }, []);

  const scheduleHide = useCallback(() => {
    hideTimer.current = setTimeout(() => setOpen(false), 180);
  }, []);

  const toggleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((v) => !v);
  }, []);

  return (
    <span className="relative inline-flex items-center flex-shrink-0">
      <button
        type="button"
        aria-label="Show period summary"
        aria-expanded={open}
        onMouseEnter={show}
        onMouseLeave={scheduleHide}
        onFocus={show}
        onBlur={scheduleHide}
        onClick={toggleClick}
        className={[
          'w-[15px] h-[15px] rounded-full flex items-center justify-center',
          'border transition-colors duration-150',
          'focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E0AFA0]',
          open
            ? 'bg-[#E0AFA0] border-[#E0AFA0] text-[#463F3A]'
            : 'bg-[#BCB8B1]/25 border-[#BCB8B1]/50 text-[#8A817C] hover:bg-[#E0AFA0]/30 hover:border-[#E0AFA0]/60 hover:text-[#463F3A]',
        ].join(' ')}
        style={{ fontSize: '9px', fontWeight: 700, lineHeight: 1 }}
      >
        i
      </button>

      {open && (
        <div
          role="tooltip"
          onMouseEnter={show}
          onMouseLeave={scheduleHide}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                     w-64 bg-[#2E2A27] text-[#F4F3EE] rounded-xl shadow-2xl p-3
                     text-[11px] leading-relaxed pointer-events-auto"
        >
          {/* Caret */}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent"
            style={{ borderTopColor: '#2E2A27' }}
          />
          <p className="text-[10px] font-semibold text-[#E0AFA0] mb-1.5 uppercase tracking-wide">
            Period summary
          </p>
          {content}
        </div>
      )}
    </span>
  );
}
