"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/playcourt/input";
import { Button } from "@/components/playcourt/button";
import { DatePicker } from "@/components/playcourt/date-picker";
import { VenueCard } from "@/components/playcourt/venue-card";
import { fetchVenues, Venue } from "@/lib/api/client";

export default function HomePage() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [sport, setSport] = useState("Tất cả");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [activeSportTab, setActiveSportTab] = useState("Tất cả");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVenues() {
      setLoading(true);
      try {
        const data = await fetchVenues({
          sport: activeSportTab === "Tất cả" ? undefined : activeSportTab,
        });
        setVenues(data.slice(0, 3)); // show top 3 recommended
      } catch (err) {
        console.error("Error loading venues:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVenues();
  }, [activeSportTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (sport && sport !== "Tất cả") params.append("sport", sport);
    if (date) params.append("date", date.toISOString());

    router.push(`/venues?${params.toString()}`);
  };

  const handlePopularSportClick = (sportName: string) => {
    setActiveSportTab(sportName);
  };

  const sports = ["Tất cả", "Badminton", "Tennis", "Football", "Basketball"];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--pc-canvas)]">
      {/* Hero Section with Vercel Mesh Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-green-950 to-black py-20 px-6 md:px-12 text-center flex flex-col items-center justify-center border-b border-[var(--pc-hairline)] min-h-[460px]">
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--pc-green-500)]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--pc-tennis)]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-[-2.4px] text-white font-sans leading-tight">
            Tìm Sân Đấu. <span className="text-[var(--pc-tennis)]">Kết Nối Đồng Đội.</span>
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-zinc-400 font-medium">
            Hệ thống đặt sân thể thao thông minh, giúp bạn tìm kiếm sân chơi và các trận đấu giao lưu gần nhất chỉ trong vài giây.
          </p>

          {/* Quick Search Form Container - Glassmorphic card */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-4xl mt-8 p-4 md:p-6 backdrop-blur-md bg-white/10 border border-white/15 shadow-2xl rounded-xl flex flex-col md:flex-row gap-4 items-end text-left"
          >
            {/* Location */}
            <div className="w-full flex-grow">
              <label className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 select-none uppercase block mb-1.5">
                Khu vực
              </label>
              <Input
                placeholder="Quận, huyện, thành phố..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-zinc-900/60 border-zinc-700/50 text-white placeholder:text-zinc-500 focus-visible:ring-[var(--pc-green-600)] w-full h-[38px] text-sm"
              />
            </div>

            {/* Sport Select */}
            <div className="w-full md:w-52 flex flex-col">
              <label className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 select-none uppercase block mb-1.5">
                Môn thể thao
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-900/60 border border-zinc-700/50 rounded-[6px] text-white outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-green-600)] focus-visible:border-[var(--pc-green-600)] transition-all cursor-pointer h-[38px]"
              >
                {sports.map((s) => (
                  <option key={s} value={s} className="bg-zinc-950 text-white">
                    {s === "Tất cả" ? "Tất cả môn" : s}
                  </option>
                ))}
              </select>
            </div>

            {/* DatePicker */}
            <div className="w-full md:w-56">
              <DatePicker
                selectedDate={date}
                onChange={setDate}
                placeholder="Chọn ngày"
                label="Ngày thi đấu"
                className="[&>button]:bg-zinc-900/60 [&>button]:border-zinc-700/50 [&>button]:text-white [&>button]:h-[38px] [&>label]:text-zinc-400 [&>label]:font-mono [&>label]:font-bold [&>label]:tracking-wider [&>label]:text-[10px] [&>label]:uppercase [&>label]:mb-1.5"
              />
            </div>

            {/* Search button CTA */}
            <Button
              type="submit"
              variant="AppPrimary"
              className="w-full md:w-auto h-[38px] px-8 bg-[var(--pc-green-800)] hover:bg-[var(--pc-green-700)] text-white font-bold text-sm shrink-0 rounded-[6px] cursor-pointer"
            >
              Tìm sân
            </Button>
          </form>
        </div>
      </section>

      {/* Suggested Venues section */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[var(--pc-ink)] tracking-tight">
              Sân chơi gợi ý gần bạn
            </h2>
            <p className="text-xs text-[var(--pc-mute)] mt-1">
              Những địa điểm thể thao chất lượng và có lịch trống phù hợp nhất.
            </p>
          </div>

          {/* Popular sports Filter Tabs (ToggleGroup style) */}
          <div className="flex flex-wrap gap-1 bg-[var(--pc-hairline-soft)] p-1 rounded-[8px] border border-[var(--pc-hairline)] self-start md:self-auto">
            {sports.map((s) => (
              <button
                key={s}
                onClick={() => handlePopularSportClick(s)}
                className={`px-3 py-1 text-xs font-bold rounded-[6px] transition-all cursor-pointer ${
                  activeSportTab === s
                    ? "bg-white text-[var(--pc-green-800)] shadow-sm"
                    : "text-[var(--pc-body)] hover:text-[var(--pc-ink)]"
                }`}
              >
                {s === "Tất cả" ? "Tất cả" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Venues Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[320px] border border-[var(--pc-hairline)] rounded-[12px] bg-white animate-pulse"
              />
            ))}
          </div>
        ) : venues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                name={venue.name}
                image={venue.image}
                sport={venue.sport}
                rating={venue.rating}
                nearestSlot={venue.nearestSlot}
                onScheduleClick={() => router.push(`/venues?sport=${venue.sport}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[var(--pc-hairline)] rounded-[12px] bg-white">
            <svg
              className="w-12 h-12 text-[var(--pc-mute)] mx-auto mb-4"
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
            <h3 className="text-base font-bold text-[var(--pc-ink)]">Không tìm thấy sân</h3>
            <p className="text-xs text-[var(--pc-mute)] mt-1">
              Thử chọn một môn thể thao khác hoặc nới rộng khoảng cách lọc.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}