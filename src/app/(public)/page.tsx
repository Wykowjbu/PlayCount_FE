"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/playcourt/input";
import { Button } from "@/components/playcourt/button";
import { DatePicker } from "@/components/playcourt/date-picker";
import { VenueCard } from "@/components/playcourt/venue-card";
import { Select } from "@/components/ui/select";
import { api, fetchVenues, getVenueImage, getVenueSportName, type Sport, type Venue } from "@/lib/api/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

const VENUE_TIMEOUT_MS = 15_000;
const MAX_VISIBLE_SPORTS = 6;

export default function HomePage() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [activeSportTab, setActiveSportTab] = useState("");
  const [sports, setSports] = useState<Sport[]>([]);

  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [venuesError, setVenuesError] = useState("");

  const [sportsLoading, setSportsLoading] = useState(true);
  const [sportsError, setSportsError] = useState("");

  const sportsFetchedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Load sports once on mount
  useEffect(() => {
    if (sportsFetchedRef.current) return;
    sportsFetchedRef.current = true;

    async function loadSports() {
      setSportsLoading(true);
      setSportsError("");
      try {
        const response = await api.sports.list(true);
        if (!mountedRef.current) return;
        setSports(response.data ?? []);
      } catch (err) {
        if (!mountedRef.current) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setSportsError("Không thể tải danh sách môn thể thao.");
        setSports([]);
      } finally {
        if (mountedRef.current) setSportsLoading(false);
      }
    }
    loadSports();
  }, []);

  // Load venues with abort + timeout — does NOT set loading state (called from event handlers)
  const venuesFetchRef = useRef<{ sportId: string } | null>(null);

  const doFetchVenues = useCallback(async (sportId: string) => {
    venuesFetchRef.current = { sportId };

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setVenuesError("");

    const timeoutId = setTimeout(() => {
      controller.abort();
      if (mountedRef.current && venuesFetchRef.current?.sportId === sportId) {
        setVenuesLoading(false);
        setVenuesError("Không thể tải danh sách sân. Vui lòng thử lại sau.");
      }
    }, VENUE_TIMEOUT_MS);

    try {
      const response = await fetchVenues(
        {
          SportId: sportId ? Number(sportId) : undefined,
          PageIndex: 1,
          PageSize: 3,
        },
        controller.signal,
      );
      clearTimeout(timeoutId);
      if (!mountedRef.current) return;
      // Only apply if this request is still the latest
      if (venuesFetchRef.current?.sportId !== sportId) return;
      setVenues((response.data ?? []).slice(0, 3));
      setVenuesLoading(false);
    } catch (err) {
      clearTimeout(timeoutId);
      if (!mountedRef.current) return;
      if (venuesFetchRef.current?.sportId !== sportId) return;
      if (err instanceof DOMException && err.name === "AbortError") return;
      setVenuesLoading(false);
      setVenuesError("Không thể tải danh sách sân. Vui lòng thử lại sau.");
    }
  }, []);

  // Trigger initial venues fetch on mount
  const initialVenuesRef = useRef(false);
  useEffect(() => {
    if (initialVenuesRef.current) return;
    initialVenuesRef.current = true;
    setVenuesLoading(true);
    doFetchVenues("");
  }, [doFetchVenues]);

  // Build sport options for Select and chips
  const allSportOptions = [
    { value: "all", label: "Tất cả" },
    ...sports.map((s) => ({ value: String(s.id), label: s.name })),
  ];

  const sportSelectOptions = allSportOptions;

  // For chips: don't show if sports errored or empty
  const showAllChip = !sportsLoading && !sportsError && sports.length > 0;
  const visibleSports = showAllChip ? sports.slice(0, MAX_VISIBLE_SPORTS - 1) : [];
  const extraSports = showAllChip ? sports.slice(MAX_VISIBLE_SPORTS - 1) : [];
  const hasExtraSports = extraSports.length > 0;

  // Active sport name for display when selected from Xem thêm
  const isChipVisible = (sportId: string): boolean => {
    if (!sportId) return true; // Tất cả always visible
    return visibleSports.some((s) => String(s.id) === sportId);
  };
  const activeSportInExtra = activeSportTab && !isChipVisible(activeSportTab);
  const activeExtraSportName = activeSportInExtra
    ? sports.find((s) => String(s.id) === activeSportTab)?.name
    : undefined;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append("Keyword", location);
    if (sport && sport !== "all") params.append("SportId", sport);
    if (date) params.append("date", date.toISOString());

    router.push(`/venues?${params.toString()}`);
  };

  const handleSportTabClick = (sportId: string) => {
    if (sportId === activeSportTab) return; // Already active, skip
    setActiveSportTab(sportId);
    setVenuesLoading(true);
    doFetchVenues(sportId);
  };

  const handleRetry = () => {
    setVenuesLoading(true);
    setVenuesError("");
    doFetchVenues(activeSportTab);
  };

  // Find sport name for venue
  const getVenueSport = (venue: Venue): string => {
    return getVenueSportName(venue);
  };

  const getOpeningHours = (venue: Venue): string => {
    if (venue.openTime && venue.closeTime) {
      return `${venue.openTime} - ${venue.closeTime}`;
    }
    return "Chưa cập nhật giờ hoạt động";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--pc-canvas)]">
      {/* Hero Section */}
      <section className="relative flex min-h-[460px] flex-col items-center justify-center overflow-hidden border-b border-[var(--pc-green-100)] bg-[linear-gradient(135deg,#f7fff4_0%,#eefbea_42%,#fff8d8_100%)] px-6 py-20 text-center md:px-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(20,83,45,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(20,83,45,0.10)_1px,transparent_1px)] [background-size:52px_52px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/70 to-transparent"
        />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--pc-green-950)] font-sans leading-tight">
            Tìm sân đấu.{" "}
            <span className="rounded-[8px] bg-[var(--pc-tennis)]/70 px-2 text-[var(--pc-green-900)]">
              Kết nối đồng đội.
            </span>
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-[var(--pc-body)] font-medium">
            Tìm sân phù hợp theo khu vực, môn thể thao và ngày bạn muốn chơi.
          </p>
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-4xl mt-8 p-4 md:p-6 backdrop-blur-md bg-white/85 border border-[var(--pc-green-100)] shadow-[0_24px_70px_rgba(22,101,52,0.14)] rounded-xl flex flex-col md:flex-row gap-4 items-end text-left"
          >
            <div className="w-full flex-grow">
              <label className="text-[10px] font-mono font-bold tracking-wider text-[var(--pc-green-800)] select-none uppercase block mb-1.5">
                Từ khóa/khu vực
              </label>
              <Input
                placeholder="Tên sân, địa chỉ..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white border-[var(--pc-green-100)] text-[var(--pc-ink)] placeholder:text-[var(--pc-mute)] focus-visible:ring-[var(--pc-green-600)] w-full h-[38px] text-sm"
              />
            </div>
            <div className="w-full md:w-52">
              <Select
                value={sport || "all"}
                onValueChange={(val) => setSport(val === "all" ? "" : val)}
                options={sportSelectOptions}
                placeholder="Chọn môn"
                label="Môn thể thao"
                disabled={sportsLoading || !!sportsError}
              />
            </div>
            <div className="w-full md:w-56">
              <DatePicker
                selectedDate={date}
                onChange={setDate}
                placeholder="Chọn ngày"
                label="Ngày thi đấu"
                className="[&>button]:bg-white [&>button]:border-[var(--pc-green-100)] [&>button]:text-[var(--pc-ink)] [&>button]:h-[38px] [&>label]:text-[var(--pc-green-800)] [&>label]:font-mono [&>label]:font-bold [&>label]:tracking-wider [&>label]:text-[10px] [&>label]:uppercase [&>label]:mb-1.5"
              />
            </div>
            <Button
              type="submit"
              variant="AppPrimary"
              className="w-full md:w-auto h-[38px] px-8 bg-[var(--pc-green-800)] hover:bg-[var(--pc-green-700)] text-white font-bold text-sm shrink-0 rounded-[6px] shadow-[0_10px_24px_rgba(22,101,52,0.22)] cursor-pointer"
            >
              Tìm sân
            </Button>
          </form>
        </div>
      </section>

      {/* Venues Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[var(--pc-ink)] tracking-tight">
                Sân được đề xuất
              </h2>
              <p className="text-xs text-[var(--pc-mute)] mt-1">
                Khám phá các sân đang mở đặt trên PlayCourt.
              </p>
            </div>

            {/* Desktop Sport Chips — show when sports loaded */}
            {showAllChip && (
              <div className="hidden md:flex flex-wrap gap-1 bg-[var(--pc-hairline-soft)] p-1 rounded-[8px] border border-[var(--pc-hairline)] self-start md:self-auto max-w-full">
                {/* Tất cả chip */}
                <button
                  type="button"
                  onClick={() => handleSportTabClick("")}
                  className={`px-3 py-1 text-xs font-bold rounded-[6px] transition-colors cursor-pointer shrink-0 ${
                    activeSportTab === ""
                      ? "bg-[var(--pc-tennis)] text-[var(--pc-green-950)] shadow-sm"
                      : "text-[var(--pc-body)] hover:text-[var(--pc-ink)]"
                  }`}
                  aria-pressed={activeSportTab === ""}
                >
                  Tất cả
                </button>

                {/* Visible sports */}
                {visibleSports.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSportTabClick(String(s.id))}
                    className={`px-3 py-1 text-xs font-bold rounded-[6px] transition-colors cursor-pointer shrink-0 ${
                      activeSportTab === String(s.id)
                        ? "bg-[var(--pc-tennis)] text-[var(--pc-green-950)] shadow-sm"
                        : "text-[var(--pc-body)] hover:text-[var(--pc-ink)]"
                    }`}
                    aria-pressed={activeSportTab === String(s.id)}
                  >
                    {s.name}
                  </button>
                ))}

                {/* Xem thêm dropdown */}
                {hasExtraSports && (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-[6px] transition-colors cursor-pointer text-[var(--pc-green-800)] hover:bg-[var(--pc-green-50)] shrink-0 max-w-[120px] truncate"
                      >
                        <span className="truncate">
                          {activeSportInExtra && activeExtraSportName
                            ? activeExtraSportName
                            : "Xem thêm"}
                        </span>
                        <ChevronDown className="h-3 w-3 shrink-0" aria-hidden="true" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        align="end"
                        sideOffset={6}
                        collisionPadding={12}
                        className="z-50 w-56 max-w-[calc(100vw-24px)] max-h-72 overflow-y-auto rounded-[10px] border border-[var(--pc-hairline)] bg-[var(--pc-surface)] p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] data-[state=open]:animate-[dropdown-in_170ms_ease-out] data-[state=closed]:animate-[dropdown-out_130ms_ease-in]"
                        style={{
                          transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
                        }}
                      >
                        {extraSports.map((s) => {
                          const isActive = activeSportTab === String(s.id);
                          return (
                            <DropdownMenu.Item
                              key={s.id}
                              asChild
                              onSelect={() => handleSportTabClick(String(s.id))}
                            >
                              <button
                                type="button"
                                className={`relative h-10 w-full cursor-pointer select-none rounded-md text-sm outline-none ${
                                  isActive ? "font-semibold" : ""
                                }`}
                              >
                                <span className="flex h-full w-full items-center whitespace-nowrap pl-3 pr-3 text-left text-[var(--pc-body)]">
                                  {isActive && (
                                    <Check className="mr-2 h-4 w-4 shrink-0 text-[var(--pc-green-800)]" aria-hidden="true" />
                                  )}
                                  <span className={`truncate ${isActive ? "" : "ml-6"}`}>
                                    {s.name}
                                  </span>
                                </span>
                              </button>
                            </DropdownMenu.Item>
                          );
                        })}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                )}
              </div>
            )}
          </div>

          {/* Mobile Sport Chips */}
          {showAllChip && (
            <div className="flex md:hidden gap-1 overflow-x-auto flex-nowrap hide-scrollbar -mx-6 px-6 pb-1">
              <button
                type="button"
                onClick={() => handleSportTabClick("")}
                className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-[6px] transition-colors cursor-pointer ${
                  activeSportTab === ""
                    ? "bg-[var(--pc-tennis)] text-[var(--pc-green-950)] shadow-sm"
                    : "bg-[var(--pc-hairline-soft)] text-[var(--pc-body)] hover:text-[var(--pc-ink)] border border-[var(--pc-hairline)]"
                }`}
                aria-pressed={activeSportTab === ""}
              >
                Tất cả
              </button>
              {sports.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSportTabClick(String(s.id))}
                  className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-[6px] transition-colors cursor-pointer ${
                    activeSportTab === String(s.id)
                      ? "bg-[var(--pc-tennis)] text-[var(--pc-green-950)] shadow-sm"
                      : "bg-[var(--pc-hairline-soft)] text-[var(--pc-body)] hover:text-[var(--pc-ink)] border border-[var(--pc-hairline)]"
                  }`}
                  aria-pressed={activeSportTab === String(s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {venuesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-busy="true">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-[12px] border border-[var(--pc-hairline)] bg-white overflow-hidden" aria-hidden="true">
                <div className="aspect-[16/9] bg-[var(--pc-hairline-soft)] animate-pulse" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="h-3 w-16 bg-[var(--pc-hairline-soft)] animate-pulse rounded-[2px]" />
                  <div className="h-5 w-3/4 bg-[var(--pc-hairline-soft)] animate-pulse rounded-[2px]" />
                  <div className="h-3 w-1/2 bg-[var(--pc-hairline-soft)] animate-pulse rounded-[2px]" />
                  <div className="h-8 w-full bg-[var(--pc-hairline-soft)] animate-pulse rounded-[6px] mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : venuesError ? (
          /* Error state */
          <div
            className="rounded-[12px] border border-red-200 bg-red-50 p-8 text-center"
            role="alert"
          >
            <p className="text-sm font-semibold text-red-800">
              {activeSportTab
                ? "Không thể tải sân cho môn đã chọn."
                : "Không thể tải danh sách sân."}
            </p>
            <p className="text-xs text-red-600 mt-1">Vui lòng thử lại sau.</p>
            <Button
              variant="Secondary"
              onClick={handleRetry}
              className="mt-4 text-xs font-semibold"
            >
              Thử lại
            </Button>
          </div>
        ) : venues.length > 0 ? (
          /* Venue grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                name={venue.name}
                image={getVenueImage(venue)}
                sport={getVenueSport(venue)}
                rating={venue.rating ?? 0}
                openingHours={getOpeningHours(venue)}
                onScheduleClick={() => router.push(`/venues/${venue.id}`)}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16 border border-dashed border-[var(--pc-hairline)] rounded-[12px] bg-white">
            <h3 className="text-base font-bold text-[var(--pc-ink)]">
              Chưa tìm thấy sân phù hợp.
            </h3>
            <p className="text-xs text-[var(--pc-mute)] mt-1">
              Thử xóa bộ lọc hoặc chọn môn thể thao khác.
            </p>
            {activeSportTab && (
              <Button
                variant="Secondary"
                onClick={() => handleSportTabClick("")}
                className="mt-4 text-xs font-semibold"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
