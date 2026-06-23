import React from 'react';

export type StatusType =
  | 'confirmed'
  | 'paid'
  | 'verified'
  | 'pending'
  | 'needs action'
  | 'failed'
  | 'rejected'
  | 'cancelled'
  | 'draft'
  | 'completed';

export interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  let badgeClasses = '';

  switch (status) {
    case 'confirmed':
    case 'paid':
    case 'verified':
      badgeClasses = 'bg-[var(--pc-green-100)] text-[var(--pc-green-900)]';
      break;
    case 'pending':
    case 'needs action':
      badgeClasses = 'bg-[var(--pc-warning-soft)] text-[var(--pc-warning-deep)]';
      break;
    case 'failed':
    case 'rejected':
    case 'cancelled':
      badgeClasses = 'bg-[#fee2e2] text-[var(--pc-error-deep)]';
      break;
    case 'draft':
    case 'completed':
      badgeClasses = 'bg-[var(--pc-hairline-soft)] text-[var(--pc-body)]';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${badgeClasses} ${className}`}
    >
      {status}
    </span>
  );
}

