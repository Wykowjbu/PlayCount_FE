'use client';

import { useState } from 'react';
import { usePlayerBookings } from '@/hooks/use-player-profile';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/playcourt/status-badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

export function BookingsHistoryTab() {
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePlayerBookings(page, status);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

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
      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setStatus(opt.value);
              setPage(1);
            }}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              status === opt.value
                ? 'bg-[var(--pc-ink)] text-white'
                : 'bg-white text-[var(--pc-body)] hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* List */}
      {data?.bookings.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[var(--pc-mute)]">Bạn chưa có booking nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="block rounded-xl border border-[var(--pc-hairline)] bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--pc-ink)]">
                    {booking.courtName} - {booking.venueName}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--pc-body)]">
                    {formatDate(booking.date)} • {booking.startTime} - {booking.endTime}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge status={booking.status} />
                  <p className="mt-2 font-semibold text-[var(--pc-ink)]">
                    {formatCurrency(booking.totalPrice)}
                  </p>
                </div>
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
