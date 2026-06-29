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
  status: StatusType | string | number;
  className?: string;
}

function normalizeStatus(status: StatusBadgeProps['status']): StatusType {
  const raw = typeof status === 'number' ? String(status) : status;
  const value = String(raw).trim().toLowerCase();
  // Map number codes to strings
  if (['0', 'pending', 'pendingapproval', 'requested'].includes(value)) return 'pending';
  if (['1', 'approved', 'active', 'confirmed', 'open'].includes(value)) return 'confirmed';
  if (['2', 'rejected', 'declined', 'failed', 'conflict'].includes(value)) return 'rejected';
  if (['3', 'cancelled', 'canceled', 'cancelledbyplayer', 'cancelledbyowner'].includes(value)) return 'cancelled';
  if (['paid', 'accepted'].includes(value)) return 'paid';
  if (['verified'].includes(value)) return 'verified';
  if (['needs action', 'needsaction'].includes(value)) return 'needs action';
  if (['draft'].includes(value)) return 'draft';
  if (['completed', 'complete', 'closed'].includes(value)) return 'completed';
  return 'draft';
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  let badgeClasses = '';
  const normalized = normalizeStatus(status);

  switch (normalized) {
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
