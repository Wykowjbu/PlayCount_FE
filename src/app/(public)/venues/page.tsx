"use client";

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/static-components */

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/playcourt/input";
import { Button } from "@/components/playcourt/button";
import { DatePicker } from "@/components/playcourt/date-picker";
import { VenueCard } from "@/components/playcourt/venue-card";
import { fetchVenues, Venue } from "@/lib/api/client";
import * as Tooltip from "@radix-ui/react-tooltip";

function VenuesSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialLocation = searchParams.get("location") || "";
  const initialSport = searchParams.get("sport") || "Tất cả";
  const initialDateParam = searchParams.get("date");
  const initialDate = initialDateParam ? new Date(initialDateParam) : undefined;

  const [location, setLocation] = useState(initialLocation);
  const [sport, setSport] = useState(initialSport);
  const [date, setDate] = useState<Date | undefined>(initialDate);

  const [selectedSport, setSelectedSport] = useState(initialSport);
  const [maxDistance, setMaxDistance] = useState<number>(5);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    setLocation(searchParams.get("location") || "");
    const qSport = searchParams.get("sport") || "Tất cả";
    setSport(qSport);
    setSelectedSport(qSport);
    const qDate = searchParams.get("date");
    setDate(qDate ? new Date(qDate) : undefined);
  }, [searchParams]);

  const loadVenues = async () => {
    setLoading(true);
    try {
      const filters = {
        location: location || undefined,
        sport: selectedSport === "Tất cả" ? undefined : selectedSport,
        date: date ? date.toISOString() : undefined,
        distance: maxDistance || undefined,
        priceMin: priceMin ? parseInt(priceMin) : undefined,
        priceMax: priceMax ? parseInt(priceMax) : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      };
      const data = await fetchVenues(filters);
      setVenues(data);
    } catch (err) {
      console.error("Error loading venues:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, [selectedSport, maxDistance, priceMin, priceMax, selectedAmenities, searchParams]);

  const handleTopBarSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (sport && sport !== "Tất cả") params.append("sport", sport);
    if (date) params.append("date", date.toISOString());
    router.push(`/venues?${params.toString()}`);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setSelectedSport("Tất cả");
    setMaxDistance(5);
    setPriceMin("");
    setPriceMax("");
    setSelectedAmenities([]);
    setLocation("");
    setSport("Tất cả");
    setDate(undefined);
    router.push("/venues");
  };

  const sports = ["Tất cả", "Badminton", "Tennis", "Football", "Basketball"];
  const amenitiesList = ["Wifi", "Parking", "Shower", "Drinks"];

  const FilterFormElements = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono font-bold text-[var(--pc-ink)] tracking-wider uppercase">Môn thể thao</span>
        <div className="flex flex-col gap-1.5">
          {sports.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm text-[var(--pc-body)] cursor-pointer select-none">
              <input
                type="radio"
                name="sportFilter"
                checked={selectedSport === s}
                onChange={() => {
                  setSelectedSport(s);
                  setSport(s);
                }}
                className="accent-[var(--pc-green-800)] h-4 w-4 cursor-pointer"
              />
              <span>{s === "Tất cả" ? "Tất cả môn" : s}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-[var(--pc-hairline)]" />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-mono font-bold text-[var(--pc-ink)] uppercase tracking-wider">
          <span>Khoảng cách tối đa</span>
          <span className="text-[var(--pc-green-800)] font-extrabold">{maxDistance} km</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={maxDistance}
          onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
          className="accent-[var(--pc-green-800)] w-full h-1 bg-[var(--pc-hairline)] rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[var(--pc-mute)]">
          <span>1 km</span>
          <span>10 km</span>
        </div>
      </div>

      <hr className="border-[var(--pc-hairline)]" />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono font-bold text-[var(--pc-ink)] tracking-wider uppercase">Khoảng giá (VND/giờ)</span>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Từ"
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="text-xs py-1.5 px-2 bg-white border border-[var(--pc-hairline)] rounded-[6px]"
          />
          <span className="text-[var(--pc-mute)] text-xs">—</span>
          <Input
            placeholder="Đến"
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="text-xs py-1.5 px-2 bg-white border border-[var(--pc-hairline)] rounded-[6px]"
          />
        </div>
      </div>

      <hr className="border-[var(--pc-hairline)]" />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono font-bold text-[var(--pc-ink)] tracking-wider uppercase">Tiện ích</span>
        <div className="grid grid-cols-2 gap-2">
          {amenitiesList.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 text-sm text-[var(--pc-body)] cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="accent-[var(--pc-green-800)] h-4 w-4 rounded border-[var(--pc-hairline)] cursor-pointer"
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        variant="Secondary"
        onClick={() => {
          handleResetFilters();
          setIsFilterDrawerOpen(false);
        }}
        className="w-full mt-2 py-2 text-xs font-bold border-[var(--pc-hairline)] text-[var(--pc-body)] hover:bg-[var(--pc-hairline-soft)] cursor-pointer"
      >
        Xóa bộ lọc
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[var(--pc-canvas)]">
      <div className="sticky top-14 z-20 bg-white border-b border-[var(--pc-hairline)] shadow-xs px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <form onSubmit={handleTopBarSearch} className="w-full flex flex-col md:flex-row gap-3 items-stretch md:items-end flex-grow">
            <div className="flex-grow">
              <Input
                placeholder="Nhập địa điểm chơi..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white border-[var(--pc-hairline)] h-[38px] text-xs py-1 w-full"
              />
            </div>

            <div className="w-full md:w-44">
              <select
                value={sport}
                onChange={(e) => {
                  setSport(e.target.value);
                  setSelectedSport(e.target.value);
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-[var(--pc-hairline)] rounded-[6px] text-[var(--pc-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-green-600)] focus-visible:border-[var(--pc-green-600)] transition-all cursor-pointer h-[38px]"
              >
                {sports.map((s) => (
                  <option key={s} value={s}>
                    {s === "Tất cả" ? "Tất cả môn" : s}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-48">
              <DatePicker
                selectedDate={date}
                onChange={setDate}
                placeholder="Chọn ngày chơi"
                className="[&>button]:bg-white [&>button]:border-[var(--pc-hairline)] [&>button]:h-[38px] [&>button]:text-xs [&>button]:py-1"
              />
            </div>

            <Button
              type="submit"
              variant="AppPrimary"
              className="h-[38px] px-6 bg-[var(--pc-green-800)] hover:bg-[var(--pc-green-700)] text-white font-bold text-xs rounded-[6px] shrink-0 cursor-pointer"
            >
              Cập nhật
            </Button>
          </form>

          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="md:hidden flex items-center justify-center gap-1.5 w-full py-2 border border-[var(--pc-hairline)] rounded-[6px] text-xs font-bold text-[var(--pc-body)] bg-white hover:bg-[var(--pc-hairline-soft)] cursor-pointer"
          >
            <svg className="w-4 h-4 text-[var(--pc-mute)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ lọc kết quả
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 w-full flex flex-col md:flex-row gap-8 flex-grow">
        <aside className="hidden md:block w-64 shrink-0 bg-white border border-[var(--pc-hairline)] rounded-[12px] p-6 h-fit shadow-xs">
          <FilterFormElements />
        </aside>

        <main className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-[var(--pc-hairline)] pb-3">
            <span className="text-xs font-mono font-bold text-[var(--pc-mute)] uppercase tracking-wider">
              {loading ? "Đang tìm sân..." : `Tìm thấy ${venues.length} sân phù hợp`}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[180px] border border-[var(--pc-hairline)] rounded-[12px] bg-white animate-pulse"
                />
              ))}
            </div>
          ) : venues.length > 0 ? (
            <div className="flex flex-col gap-4">
              {venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  name={venue.name}
                  image={venue.image}
                  sport={venue.sport}
                  rating={venue.rating}
                  nearestSlot={venue.nearestSlot}
                  layout="wide"
                  onScheduleClick={() => router.push(`/venues/${venue.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-[var(--pc-hairline)] rounded-[12px] bg-white">
              <svg
                className="w-16 h-16 text-[var(--pc-mute)] mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-bold text-[var(--pc-ink)]">Không có kết quả phù hợp</h3>
              <p className="text-sm text-[var(--pc-mute)] mt-1 max-w-sm mx-auto">
                Hãy thử thay đổi từ khóa tìm kiếm, giảm bớt tiện ích lọc hoặc tăng khoảng cách tìm kiếm.
              </p>
              <Button
                variant="Secondary"
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2 text-xs font-semibold border-[var(--pc-hairline)] cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </Button>
            </div>
          )}
        </main>
      </div>

      {isFilterDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex justify-end flex-col animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsFilterDrawerOpen(false)} />
          <div className="relative bg-white rounded-t-[16px] p-6 max-h-[85vh] overflow-y-auto flex flex-col gap-4 shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)] border-t border-[var(--pc-hairline)] z-50 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center border-b border-[var(--pc-hairline)] pb-3">
              <span className="text-sm font-extrabold text-[var(--pc-ink)]">Bộ lọc nâng cao</span>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => setIsFilterDrawerOpen(false)}
                      aria-label="Đóng bộ lọc"
                      className="p-1 rounded-full hover:bg-[var(--pc-hairline-soft)] text-[var(--pc-mute)] cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      align="center"
                      sideOffset={4}
                      className="z-50 rounded-md bg-[var(--pc-ink)] px-2.5 py-1.5 text-xs font-mono text-[var(--pc-canvas)] shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-150"
                    >
                      Đóng
                      <Tooltip.Arrow className="fill-[var(--pc-ink)]" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>

            <div className="py-2">
              <FilterFormElements />
            </div>

            <Button
              variant="AppPrimary"
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-full bg-[var(--pc-green-800)] hover:bg-[var(--pc-green-700)] text-white font-bold py-2.5 rounded-[6px] text-xs mt-2 cursor-pointer"
            >
              Áp dụng bộ lọc
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VenuesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center min-h-[400px] bg-[var(--pc-canvas)] font-semibold text-sm text-[var(--pc-mute)]">
        Đang tải trang tìm kiếm sân...
      </div>
    }>
      <VenuesSearchContent />
    </Suspense>
  );
}
