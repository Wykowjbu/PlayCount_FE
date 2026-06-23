import React from 'react';
import { StatusBadge, StatusType } from './status-badge';

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

export interface MatchCardProps {
  title: string;
  sport: string;
  dateTime: string;
  participants: Participant[];
  status: StatusType;
  maxParticipants?: number;
  onJoinClick?: () => void;
}

export function AvatarGroup({
  participants,
  max = 4,
}: {
  participants: Participant[];
  max?: number;
}) {
  const visibleParticipants = participants.slice(0, max);
  const extraCount = participants.length > max ? participants.length - max : 0;

  return (
    <div className="flex -space-x-1.5 overflow-hidden">
      {visibleParticipants.map((p, idx) => (
        <div
          key={p.id || idx}
          className="relative inline-block h-7 w-7 rounded-full ring-2 ring-white overflow-hidden bg-[var(--pc-hairline-soft)] select-none shrink-0"
          title={p.name}
        >
          {p.avatar ? (
            <img
              className="h-full w-full object-cover"
              src={p.avatar}
              alt={p.name}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[var(--pc-body)]">
              {p.name ? p.name.charAt(0).toUpperCase() : '?'}
            </span>
          )}
        </div>
      ))}
      {extraCount > 0 && (
        <div className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--pc-hairline)] ring-2 ring-white shrink-0 select-none">
          <span className="text-[9px] font-bold text-[var(--pc-ink)]">
            +{extraCount}
          </span>
        </div>
      )}
    </div>
  );
}

export function MatchCard({
  title,
  sport,
  dateTime,
  participants,
  status,
  maxParticipants,
  onJoinClick,
}: MatchCardProps) {
  const totalCount = participants.length;
  const countLabel = maxParticipants ? `${totalCount}/${maxParticipants}` : `${totalCount} người`;

  return (
    <div className="border border-[var(--pc-hairline)] rounded-[12px] bg-white p-4 flex flex-col justify-between gap-4 shadow-sm hover:border-[var(--pc-faint)] transition-all duration-300 min-h-[160px]">
      {/* Header: Sport & Status */}
      <div className="flex justify-between items-center gap-2">
        <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--pc-mute)] font-semibold">
          {sport}
        </span>
        <StatusBadge status={status} />
      </div>

      {/* Main Info: Title & DateTime */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-bold text-[var(--pc-ink)] line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-[var(--pc-body)] font-medium">
          <svg
            className="w-3.5 h-3.5 text-[var(--pc-mute)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{dateTime}</span>
        </div>
      </div>

      {/* Footer: Participant AvatarGroup & Total Count */}
      <div className="flex items-center justify-between border-t border-[var(--pc-hairline-soft)] pt-3 mt-1 gap-2">
        <div className="flex items-center gap-2">
          <AvatarGroup participants={participants} />
          <span className="text-[11px] font-semibold text-[var(--pc-body)]">
            {countLabel}
          </span>
        </div>
        
        {onJoinClick && (
          <button
            onClick={onJoinClick}
            className="text-xs font-semibold text-[var(--pc-green-800)] hover:text-[var(--pc-green-700)] transition-colors cursor-pointer select-none"
          >
            Tham gia
          </button>
        )}
      </div>
    </div>
  );
}

