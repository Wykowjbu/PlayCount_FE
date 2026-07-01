"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { Suspense, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { List, Map } from "lucide-react";
import { Button } from "@/components/playcourt/button";
import { DatePicker } from "@/components/playcourt/date-picker";
import { Input } from "@/components/playcourt/input";
import { VenueCard } from "@/components/playcourt/venue-card";
import { Select } from "@/components/ui/select";
import { api, fetchVenues, getVenueImage, getVenueSportName, type Sport, type Venue } from "@/lib/api/client";

function VenuesSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("Keyword") ?? "");
  const debouncedKeyword = useDeferredValue(keyword.trim());
  const [sportId, setSportId] = useState(searchParams.get("SportId") ?? "");
  const [date, setDate] = useState<Date | undefined>(() => {
    const value = searchParams.get("date");
    return value ? new Date(value) : undefined;
  });
  const [isOpenNow, setIsOpenNow] = useState(searchParams.get("IsOpenNow") ?? "");
  const [pageIndex, setPageIndex] = useState(Number(searchParams.get("PageIndex") ?? "1") || 1);
  const [pageSize] = useState(12);
  const [sortBy, setSortBy] = useState("best");
  const [sports, setSports] = useState<Sport[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasAvailability, setHasAvailability] = useState(false);
  const [timeFilters, setTimeFilters] = useState<string[]>([]);
  const resultsRef = useRef<HTMLElement>(null);

  // Sync state from URL when it changes (e.g. browser Back/Forward)
  useEffect(() => {
    setKeyword(searchParams.get("Keyword") ?? "");
    setSportId(searchParams.get("SportId") ?? "");
    setDate(searchParams.get("date") ? new Date(searchParams.get("date") as string) : undefined);
    setIsOpenNow(searchParams.get("IsOpenNow") ?? "");
    setPageIndex(Number(searchParams.get("PageIndex") ?? "1") || 1);
  }, [searchParams]);

  useEffect(() => {
    api.sports.list(true).then((response) => setSports(response.data ?? [])).catch(() => setSports([]));
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedKeyword) params.set("Keyword", debouncedKeyword);
    if (sportId) params.set("SportId", sportId);
    if (date) params.set("date", date.toISOString());
    if (isOpenNow) params.set("IsOpenNow", isOpenNow);
    params.set("PageIndex", String(pageIndex));
    params.set("PageSize", String(pageSize));
    return params.toString();
  }, [debouncedKeyword, sportId, date, isOpenNow, pageIndex, pageSize]);

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
    setSportId("");
    setDate(undefined);
    setIsOpenNow("");
    setHasAvailability(false);
    setTimeFilters([]);
    setPageIndex(1);
  };

  const changeFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPageIndex(1);
  };

  const scrollToResults = () => {
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const toggleTimeFilter = (value: string) => {
    setTimeFilters((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const sportOptions = [
    { value: "all", label: "Tất cả" },
    ...sports.map((sport) => ({ value: String(sport.id), label: sport.name })),
  ];
  const sortOptions = [
    { value: "best", label: "Phù hợp nhất" },
    { value: "rating", label: "Đánh giá cao nhất" },
    { value: "near", label: "Gần nhất" },
  ];

  return (
    <div className="-mt-16 min-h-screen bg-[radial-gradient(circle_at_92%_8%,rgba(199,242,39,.22)_0,rgba(220,252,231,.42)_18%,transparent_36%),linear-gradient(135deg,#f7fff4_0%,#eefbea_38%,var(--pc-canvas)_78%)] pt-16">
      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pb-8 pt-12 md:grid-cols-[1.05fr_.95fr] md:pt-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-mono font-bold uppercase tracking-wider text-[var(--pc-green-800)]">Tìm sân thể thao quanh bạn</p>
          <h1 className="text-4xl font-bold leading-tight text-[var(--pc-green-950)] md:text-6xl">
            Chọn sân phù hợp.
            <span className="mt-2 inline-block rounded-[8px] bg-[var(--pc-tennis)]/70 px-2 text-[var(--pc-green-900)]">Chơi đúng cuộc.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-[var(--pc-body)] md:text-base">
            Tìm sân phù hợp theo khu vực, môn thể thao và ngày bạn muốn chơi.
          </p>
        </div>

        <div className="relative min-h-[240px] overflow-hidden rounded-xl border border-[var(--pc-green-100)] bg-[linear-gradient(135deg,#f7fff4_0%,#eefbea_48%,#fff8d8_100%)] shadow-[0_24px_70px_rgba(22,101,52,0.10)]">
          <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(20,83,45,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(20,83,45,0.10)_1px,transparent_1px)] [background-size:52px_52px]" />
          <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-[var(--pc-tennis)]/25" />
          <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-[var(--pc-green-100)] bg-white/85 p-4 shadow-[0_14px_38px_rgba(22,101,52,0.10)] backdrop-blur-md">
            <p className="mb-3 text-sm font-bold text-[var(--pc-ink)]">Gợi ý nhanh hôm nay</p>
            <div className="flex flex-wrap gap-2">
              {["Cầu lông", "Pickleball", "Tennis", "Gần bạn"].map((label) => (
                <span key={label} className="rounded-[6px] bg-[var(--pc-hairline-soft)] px-3 py-1 text-xs font-bold text-[var(--pc-body)]">{label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 lg:px-8">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setPageIndex(1);
            scrollToResults();
          }}
          className="flex w-full flex-col items-end gap-4 rounded-xl border border-[var(--pc-green-100)] bg-white/85 p-4 text-left shadow-[0_24px_70px_rgba(22,101,52,0.14)] backdrop-blur-md md:flex-row md:p-6"
        >
          <div className="w-full flex-grow">
            <label className="mb-1.5 block select-none font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--pc-green-800)]">
              Từ khóa/khu vực
            </label>
            <Input
              placeholder="Tên sân, địa chỉ..."
              value={keyword}
              onChange={(event) => changeFilter(setKeyword, event.target.value)}
              className="h-[38px] w-full border-[var(--pc-green-100)] bg-white text-sm text-[var(--pc-ink)] placeholder:text-[var(--pc-mute)] focus-visible:ring-[var(--pc-green-600)]"
            />
          </div>
          <div className="w-full md:w-52">
            <Select
              value={sportId || "all"}
              onValueChange={(value) => changeFilter(setSportId, value === "all" ? "" : value)}
              options={sportOptions}
              placeholder="Chọn môn"
              label="Môn thể thao"
              disabled={sports.length === 0}
            />
          </div>
          <div className="w-full md:w-56">
            <DatePicker
              selectedDate={date}
              onChange={(value) => {
                setDate(value);
                setPageIndex(1);
              }}
              placeholder="Chọn ngày"
              label="Ngày thi đấu"
              className="[&>button]:h-[38px] [&>button]:border-[var(--pc-green-100)] [&>button]:bg-white [&>button]:text-[var(--pc-ink)] [&>label]:mb-1.5 [&>label]:font-mono [&>label]:text-[10px] [&>label]:font-bold [&>label]:uppercase [&>label]:tracking-wider [&>label]:text-[var(--pc-green-800)]"
            />
          </div>
          <Button
            type="submit"
            variant="AppPrimary"
            className="h-[38px] w-full shrink-0 rounded-[6px] bg-[var(--pc-tennis)]/70 px-8 text-sm font-bold text-[var(--pc-green-950)] shadow-[0_10px_24px_rgba(22,101,52,0.16)] hover:bg-[var(--pc-tennis)] md:w-auto"
          >
            Tìm sân
          </Button>
        </form>
      </section>

      <main ref={resultsRef} className="mx-auto flex w-full max-w-7xl scroll-mt-20 flex-1 flex-col gap-6 px-6 py-14 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--pc-ink)] md:text-2xl">Sân thể thao phù hợp</h2>
            <p className="mt-1 text-xs text-[var(--pc-mute)]">{loading ? "Đang tìm sân..." : `Tìm thấy ${totalCount} sân phù hợp`}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--pc-mute)]">Trang {pageIndex} / {Math.max(totalPages, 1)}</span>
            <div className="flex rounded-[8px] border border-[var(--pc-hairline)] bg-[var(--pc-hairline-soft)] p-1">
              <button type="button" className="inline-flex items-center gap-1.5 rounded-[6px] bg-white px-3 py-1.5 text-xs font-bold text-[var(--pc-ink)] shadow-sm">
                <List className="h-4 w-4" />
                Danh sách
              </button>
              <button type="button" disabled className="inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-bold text-[var(--pc-body)] disabled:cursor-not-allowed disabled:opacity-60">
                <Map className="h-4 w-4" />
                Bản đồ
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="self-start rounded-[12px] bg-white p-5 shadow-[0_18px_50px_rgba(20,36,25,.06)] lg:sticky lg:top-20">
            <div className="mb-8 flex items-center justify-between">
              <strong className="text-sm font-bold text-[var(--pc-ink)]">Bộ lọc</strong>
              <button type="button" onClick={resetFilters} className="text-xs font-bold text-[var(--pc-green-800)] hover:underline">
                Xóa tất cả
              </button>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="mb-3 text-xs font-bold text-[var(--pc-ink)]">Môn thể thao</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm text-[var(--pc-body)]">
                    <input type="checkbox" checked={sportId === ""} onChange={() => changeFilter(setSportId, "")} className="h-3.5 w-3.5 rounded accent-[var(--pc-green-800)]" />
                    Tất cả môn
                  </label>
                  {sports.map((sport) => (
                    <label key={sport.id} className="flex items-center gap-2 text-sm text-[var(--pc-body)]">
                      <input type="checkbox" checked={sportId === String(sport.id)} onChange={() => changeFilter(setSportId, String(sport.id))} className="h-3.5 w-3.5 rounded accent-[var(--pc-green-800)]" />
                      {sport.name}
                    </label>
                  ))}
                </div>
              </section>

              <section className="border-t border-[var(--pc-hairline)] pt-5">
                <h3 className="mb-3 text-xs font-bold text-[var(--pc-ink)]">Trạng thái</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm text-[var(--pc-body)]">
                    <input type="checkbox" checked={isOpenNow === "true"} onChange={(event) => changeFilter(setIsOpenNow, event.target.checked ? "true" : "")} className="h-3.5 w-3.5 rounded accent-[var(--pc-green-800)]" />
                    Đang mở cửa
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[var(--pc-body)]">
                    <input type="checkbox" checked={hasAvailability} onChange={(event) => setHasAvailability(event.target.checked)} className="h-3.5 w-3.5 rounded accent-[var(--pc-green-800)]" />
                    Có lịch trống
                  </label>
                </div>
              </section>

              <section className="border-t border-[var(--pc-hairline)] pt-5">
                <h3 className="mb-3 text-xs font-bold text-[var(--pc-ink)]">Khung giờ</h3>
                <div className="space-y-3">
                  {[
                    ["morning", "Buổi sáng"],
                    ["afternoon", "Buổi chiều"],
                    ["evening", "Buổi tối"],
                  ].map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2 text-sm text-[var(--pc-body)]">
                      <input type="checkbox" checked={timeFilters.includes(value)} onChange={() => toggleTimeFilter(value)} className="h-3.5 w-3.5 rounded accent-[var(--pc-green-800)]" />
                      {label}
                    </label>
                  ))}
                </div>
              </section>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--pc-mute)]">
                {loading ? "Đang tải" : `Tìm thấy ${totalCount} sân`}
              </span>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
                options={sortOptions}
                placeholder="Sắp xếp"
                className="w-44 [&>button]:shadow-sm"
              />
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
                  <VenueCard key={venue.id} name={venue.name} image={getVenueImage(venue)} sport={getVenueSportName(venue)} rating={venue.rating ?? 0} openingHours={venue.openTime && venue.closeTime ? `${venue.openTime} - ${venue.closeTime}` : "Chưa cập nhật giờ hoạt động"} layout="wide" onScheduleClick={() => router.push(`/venues/${venue.id}`)} />
                ))}
              </div>
            ) : (
              <div className="rounded-[12px] border border-dashed border-[var(--pc-hairline)] bg-white py-20 text-center">
                <h3 className="text-lg font-bold text-[var(--pc-ink)]">Không có kết quả phù hợp</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--pc-mute)]">Thử đổi từ khóa hoặc bỏ bớt bộ lọc.</p>
                <Button variant="Secondary" type="button" onClick={resetFilters} className="mt-6">Xóa tất cả bộ lọc</Button>
              </div>
            )}
          </section>
        </div>

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
