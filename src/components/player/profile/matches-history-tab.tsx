'use client';

import { useState } from 'react';
import { usePlayerMatches } from '@/hooks/use-player-profile';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/playcourt/status-badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';

export function MatchesHistoryTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePlayerMatches(page);

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd/MM/yyyy', { locale: vi });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--pc-mute)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data?.matches.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[var(--pc-mute)]">Bạn chưa tham gia match nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.matches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className="block rounded-xl border border-[var(--pc-hairline)] bg-white p-4 transition-shadow hover:shadow-md"
            >
              {match.isCreator && (
                <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Bạn tạo
                </span>
              )}
              <h3 className="font-semibold text-[var(--pc-ink)]">{match.title}</h3>
              <p className="mt-1 text-sm text-[var(--pc-body)]">
                {match.venueName} • {formatDate(match.date)} • {match.startTime}-{match.endTime}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm text-[var(--pc-body)]">
                  {match.currentPlayers}/{match.maxPlayers} người chơi
                </span>
                <StatusBadge status={match.status} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-1">
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-lg text-sm font-medium ${
                  page === p
                    ? 'bg-[var(--pc-ink)] text-white'
                    : 'hover:bg-gray-100 text-[var(--pc-body)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
