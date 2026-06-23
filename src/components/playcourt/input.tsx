import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    const inputClasses = [
      'px-3 py-2 text-sm bg-white border rounded-[6px] outline-none transition-all placeholder:text-[var(--pc-faint)]',
      error
        ? 'border-[var(--pc-error)] focus-visible:ring-[var(--pc-error)] focus-visible:border-[var(--pc-error)]'
        : 'border-[var(--pc-hairline)] focus-visible:ring-[var(--pc-green-600)] focus-visible:border-[var(--pc-green-600)]',
      'focus-visible:ring-2',
      className
    ].join(' ');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[var(--pc-body)] select-none">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={inputClasses}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {error && (
          <span id={errorId} className="text-xs text-[var(--pc-error)] font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

