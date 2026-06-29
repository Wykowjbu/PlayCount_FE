'use client';

import { usePlayerStats } from '@/hooks/use-player-profile';
import { Loader2, Trophy, Clock, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export function StatsTab() {
  const { data: stats, isLoading } = usePlayerStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--pc-mute)]" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-12 text-center">
        <p className="text-[var(--pc-mute)]">Chưa có dữ liệu thống kê</p>
      </div>
    );
  }

  const completionRate =
    stats.totalBookings > 0 ? ((stats.completedBookings / stats.totalBookings) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--pc-hairline)] bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--pc-ink)]">{stats.totalMatches}</p>
              <p className="text-sm text-[var(--pc-mute)]">Trận đấu</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--pc-hairline)] bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-3">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--pc-ink)]">{stats.totalHoursPlayed}</p>
              <p className="text-sm text-[var(--pc-mute)]">Giờ chơi</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--pc-hairline)] bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              {stats.favoriteVenue ? (
                <>
                  <Link
                    href={`/venues/${stats.favoriteVenue.id}`}
                    className="text-lg font-bold text-[var(--pc-ink)] hover:underline"
                  >
                    {stats.favoriteVenue.name}
                  </Link>
                  <p className="text-sm text-[var(--pc-mute)]">Sân yêu thích</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-[var(--pc-ink)]">-</p>
                  <p className="text-sm text-[var(--pc-mute)]">Chưa có sân yêu thích</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Stats */}
      <div className="rounded-xl border border-[var(--pc-hairline)] bg-white p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--pc-ink)]">
          <Calendar className="h-5 w-5" />
          Thống kê booking
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--pc-body)]">Tổng booking</span>
            <span className="font-semibold text-[var(--pc-ink)]">{stats.totalBookings}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--pc-body)]">Hoàn thành</span>
            <span className="font-semibold text-green-600">{stats.completedBookings}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--pc-body)]">Tỷ lệ hoàn thành</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="font-semibold text-[var(--pc-ink)]">{completionRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
