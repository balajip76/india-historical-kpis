'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  content: string;
}

const TOOLTIP_W = 260;

export default function InfoTooltip({ content }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ btnCenterX: 0, btnTopY: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const readPos = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({ btnCenterX: r.left + r.width / 2, btnTopY: r.top });
  }, []);

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    readPos();
    setOpen(true);
  }, [readPos]);

  const scheduleHide = useCallback(() => {
    hideTimer.current = setTimeout(() => setOpen(false), 180);
  }, []);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open) readPos();
    setOpen((v) => !v);
  }, [open, readPos]);

  // Close on scroll so it doesn't drift
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [open]);

  // Clamp left edge so tooltip stays inside viewport
  const left = Math.max(8, Math.min(pos.btnCenterX - TOOLTIP_W / 2, (typeof window !== 'undefined' ? window.innerWidth : 1200) - TOOLTIP_W - 8));
  // Caret offset inside the box so it always points at the button
  const caretOffset = Math.max(10, Math.min(pos.btnCenterX - left, TOOLTIP_W - 10));

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label="Show period summary"
        aria-expanded={open}
        onMouseEnter={show}
        onMouseLeave={scheduleHide}
        onFocus={show}
        onBlur={scheduleHide}
        onClick={toggle}
        className={[
          'w-[15px] h-[15px] rounded-full flex items-center justify-center flex-shrink-0',
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

      {open && typeof document !== 'undefined' && createPortal(
        <div
          role="tooltip"
          onMouseEnter={show}
          onMouseLeave={scheduleHide}
          style={{
            position: 'fixed',
            top: pos.btnTopY,
            left,
            width: TOOLTIP_W,
            transform: 'translateY(calc(-100% - 8px))',
            zIndex: 9999,
          }}
          className="bg-[#2E2A27] text-[#F4F3EE] rounded-xl shadow-2xl p-3 text-[11px] leading-relaxed"
        >
          {/* Caret arrow points down at the button */}
          <span
            style={{
              position: 'absolute',
              top: '100%',
              left: caretOffset,
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '6px solid #2E2A27',
            }}
          />
          <p className="text-[10px] font-semibold text-[#E0AFA0] mb-1.5 uppercase tracking-wide">
            Period summary
          </p>
          {content}
        </div>,
        document.body
      )}
    </>
  );
}
