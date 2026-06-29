'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'MarketingPrimary' | 'AppPrimary' | 'CommitPrimary' | 'Secondary' | 'Danger';
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function Button({ variant = 'AppPrimary', children, onClick, className = '', ...props }: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const rippleIdRef = React.useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (variant !== 'CommitPrimary') return;
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.5;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: ++rippleIdRef.current,
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);
  };

  const handleRippleComplete = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  let variantClasses = '';
  switch (variant) {
    case 'MarketingPrimary':
      variantClasses = 'rounded-full bg-[var(--pc-ink)] text-white hover:bg-neutral-800 active:scale-[0.98] transition-all';
      break;
    case 'AppPrimary':
      variantClasses = 'rounded-[6px] bg-[var(--pc-green-800)] text-white hover:bg-[var(--pc-green-700)] active:scale-[0.98] transition-all';
      break;
    case 'CommitPrimary':
      variantClasses = 'rounded-[6px] bg-[var(--pc-green-800)] text-white hover:bg-[var(--pc-green-700)] relative overflow-hidden active:scale-[0.98] transition-all';
      break;
    case 'Secondary':
      variantClasses = 'rounded-[6px] border border-[var(--pc-hairline)] bg-transparent text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] active:scale-[0.98] transition-all';
      break;
    case 'Danger':
      variantClasses = 'rounded-[6px] bg-[var(--pc-error)] text-white hover:bg-[var(--pc-error-deep)] active:scale-[0.98] transition-all';
      break;
  }

  const baseClasses = 'px-4 py-2 text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-green-600)] focus-visible:ring-offset-2';

  return (
    <button
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      <span className="relative z-10 select-none pointer-events-none">{children}</span>
      {variant === 'CommitPrimary' && (
        <span className="absolute inset-0 overflow-hidden pointer-events-none">
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              onAnimationComplete={() => handleRippleComplete(ripple.id)}
              style={{
                position: 'absolute',
                top: ripple.y,
                left: ripple.x,
                width: ripple.size,
                height: ripple.size,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />
          ))}
        </span>
      )}
    </button>
  );
}
