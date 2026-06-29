"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/playcourt/button";
import { Input } from "@/components/playcourt/input";
import { VenueCard } from "@/components/playcourt/venue-card";
import { api, fetchVenues, getVenueImage, getVenueSportName, type Sport, type Venue } from "@/lib/api/client";

function VenuesSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("Keyword") ?? "");
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const [sportId, setSportId] = useState(searchParams.get("SportId") ?? "");
  const [isOpenNow, setIsOpenNow] = useState(searchParams.get("IsOpenNow") ?? "");
  const [pageIndex, setPageIndex] = useState(Number(searchParams.get("PageIndex") ?? "1") || 1);
  const [pageSize] = useState(12);
  const [sports, setSports] = useState<Sport[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedKeyword(keyword.trim()), 350);
    return () => window.clearTimeout(id);
  }, [keyword]);

  useEffect(() => {
    api.sports.list(true).then((response) => setSports(response.data ?? [])).catch(() => setSports([]));
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedKeyword) params.set("Keyword", debouncedKeyword);
    if (sportId) params.set("SportId", sportId);
    if (isOpenNow) params.set("IsOpenNow", isOpenNow);
    params.set("PageIndex", String(pageIndex));
    params.set("PageSize", String(pageSize));
    return params.toString();
  }, [debouncedKeyword, sportId, isOpenNow, pageIndex, pageSize]);

  useEffect(() => {
    router.replace(`/venues?${queryString}`, { scroll: false });
  }, [queryString, router]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetchVenues({
      Keyword: debouncedKeyword || undefined,
      SportId: sportId ? Number(sportId) : undefined,
      IsOpenNow: isOpenNow ? isOpenNow === "true" : undefined,
      PageIndex: pageIndex,
      PageSize: pageSize,
    })
      .then((response) => {
        setVenues(response.data ?? []);
        setTotalPages(response.totalPages ?? 0);
        setTotalCount(response.totalCount ?? 0);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Không thể tải danh sách sân.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [debouncedKeyword, sportId, isOpenNow, pageIndex, pageSize]);

  const resetFilters = () => {
    setKeyword("");
    setDebouncedKeyword("");
    setSportId("");
    setIsOpenNow("");
    setPageIndex(1);
  };

  const changeFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPageIndex(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--pc-canvas)]">
      <div className="sticky top-14 z-20 bg-white border-b border-[var(--pc-hairline)] px-6 py-4">
        <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-[1fr_220px_180px_auto] md:items-end">
          <Input label="Tìm sân" placeholder="Tên sân hoặc địa chỉ..." value={keyword} onChange={(e) => changeFilter(setKeyword, e.target.value)} />
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[var(--pc-body)]">
            Môn thể thao
            <select value={sportId} onChange={(e) => changeFilter(setSportId, e.target.value)} className="h-[38px] rounded-[6px] border border-[var(--pc-hairline)] bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-green-600)]">
              <option value="">Tất cả môn</option>
              {sports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[var(--pc-body)]">
            Trạng thái
            <select value={isOpenNow} onChange={(e) => changeFilter(setIsOpenNow, e.target.value)} className="h-[38px] rounded-[6px] border border-[var(--pc-hairline)] bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-green-600)]">
              <option value="">Tất cả</option>
              <option value="true">Đang mở</option>
              <option value="false">Không lọc mở cửa</option>
            </select>
          </label>
          <Button type="button" variant="Secondary" onClick={resetFilters} className="h-[38px]">Xóa lọc</Button>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-between border-b border-[var(--pc-hairline)] pb-3">
          <span className="text-xs font-mono font-bold text-[var(--pc-mute)] uppercase tracking-wider">
            {loading ? "Đang tìm sân..." : `Tìm thấy ${totalCount} sân phù hợp`}
          </span>
          <span className="text-xs text-[var(--pc-mute)]">Trang {pageIndex} / {Math.max(totalPages, 1)}</span>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">{[1, 2, 3].map((i) => <div key={i} className="h-[180px] rounded-[12px] border border-[var(--pc-hairline)] bg-white animate-pulse" />)}</div>
        ) : error ? (
          <div className="rounded-[12px] border border-red-200 bg-red-50 p-6 text-sm text-red-800">
            <p>{error}</p>
            <Button type="button" className="mt-4" onClick={() => setPageIndex((value) => value)}>Thử lại</Button>
          </div>
        ) : venues.length > 0 ? (
          <div className="flex flex-col gap-4">
            {venues.map((venue) => (
              <VenueCard key={venue.id} name={venue.name} image={getVenueImage(venue)} sport={getVenueSportName(venue)} rating={venue.rating ?? 0} nearestSlot={venue.openTime && venue.closeTime ? `${venue.openTime} - ${venue.closeTime}` : "Xem chi tiết"} layout="wide" onScheduleClick={() => router.push(`/venues/${venue.id}`)} />
            ))}
          </div>
        ) : (
          <div className="rounded-[12px] border border-dashed border-[var(--pc-hairline)] bg-white py-20 text-center">
            <h3 className="text-lg font-bold text-[var(--pc-ink)]">Không có kết quả phù hợp</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--pc-mute)]">Thử đổi từ khóa hoặc bỏ bớt bộ lọc.</p>
            <Button variant="Secondary" type="button" onClick={resetFilters} className="mt-6">Xóa tất cả bộ lọc</Button>
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <Button variant="Secondary" type="button" disabled={pageIndex <= 1 || loading} onClick={() => setPageIndex((value) => Math.max(1, value - 1))}>Trước</Button>
          <Button variant="Secondary" type="button" disabled={pageIndex >= totalPages || totalPages === 0 || loading} onClick={() => setPageIndex((value) => value + 1)}>Sau</Button>
        </div>
      </main>
    </div>
  );
}

export default function VenuesPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[400px] items-center justify-center text-sm text-[var(--pc-mute)]">Đang tải trang tìm kiếm sân...</div>}>
      <VenuesSearchContent />
    </Suspense>
  );
}
