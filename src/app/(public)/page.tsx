"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/playcourt/input";
import { Button } from "@/components/playcourt/button";
import { DatePicker } from "@/components/playcourt/date-picker";
import { VenueCard } from "@/components/playcourt/venue-card";
import { api, fetchVenues, getVenueImage, getVenueSportName, type Sport, type Venue } from "@/lib/api/client";

export default function HomePage() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [activeSportTab, setActiveSportTab] = useState("");
  const [sports, setSports] = useState<Sport[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVenues() {
      setLoading(true);
      setError("");
      try {
        const [venuesResponse, sportsResponse] = await Promise.all([
          fetchVenues({
            SportId: activeSportTab ? Number(activeSportTab) : undefined,
            PageIndex: 1,
            PageSize: 3,
          }),
          api.sports.list(true),
        ]);
        setVenues((venuesResponse.data ?? []).slice(0, 3));
        setSports(sportsResponse.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải danh sách sân.");
      } finally {
        setLoading(false);
      }
    }
    loadVenues();
  }, [activeSportTab]);

  useEffect(() => {
    async function loadSportsOnly() {
      try {
        const sportsResponse = await api.sports.list(true);
        setSports(sportsResponse.data ?? []);
      } catch {
        setSports([]);
      }
    }
    loadSportsOnly();
  }, []);

  const sportOptions = [{ id: "", name: "Tất cả" }, ...sports.map((item) => ({ id: String(item.id), name: item.name }))];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append("Keyword", location);
    if (sport) params.append("SportId", sport);
    if (date) params.append("date", date.toISOString());

    router.push(`/venues?${params.toString()}`);
  };

  const handlePopularSportClick = (sportId: string) => {
    setActiveSportTab(sportId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--pc-canvas)]">
      <section className="relative flex min-h-[460px] flex-col items-center justify-center overflow-hidden border-b border-[var(--pc-green-100)] bg-[linear-gradient(135deg,#f7fff4_0%,#eefbea_42%,#fff8d8_100%)] px-6 py-20 text-center md:px-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(20,83,45,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(20,83,45,0.10)_1px,transparent_1px)] [background-size:52px_52px]"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/70 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--pc-green-950)] font-sans leading-tight">
            Tìm sân đấu. <span className="rounded-[8px] bg-[var(--pc-tennis)]/70 px-2 text-[var(--pc-green-900)]">Kết nối đồng đội.</span>
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-[var(--pc-body)] font-medium">
            Tìm kiếm sân thể thao bằng dữ liệu thật từ PlayCourt Backend.
          </p>
          <form onSubmit={handleSearchSubmit} className="w-full max-w-4xl mt-8 p-4 md:p-6 backdrop-blur-md bg-white/85 border border-[var(--pc-green-100)] shadow-[0_24px_70px_rgba(22,101,52,0.14)] rounded-xl flex flex-col md:flex-row gap-4 items-end text-left">
            <div className="w-full flex-grow">
              <label className="text-[10px] font-mono font-bold tracking-wider text-[var(--pc-green-800)] select-none uppercase block mb-1.5">Từ khóa/khu vực</label>
              <Input placeholder="Tên sân, địa chỉ..." value={location} onChange={(e) => setLocation(e.target.value)} className="bg-white border-[var(--pc-green-100)] text-[var(--pc-ink)] placeholder:text-[var(--pc-mute)] focus-visible:ring-[var(--pc-green-600)] w-full h-[38px] text-sm" />
            </div>
            <div className="w-full md:w-52 flex flex-col">
              <label className="text-[10px] font-mono font-bold tracking-wider text-[var(--pc-green-800)] select-none uppercase block mb-1.5">Môn thể thao</label>
              <select value={sport} onChange={(e) => setSport(e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[var(--pc-green-100)] rounded-[6px] text-[var(--pc-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-green-600)] transition-all cursor-pointer h-[38px]">
                {sportOptions.map((s) => <option key={s.id || "all"} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="w-full md:w-56">
              <DatePicker selectedDate={date} onChange={setDate} placeholder="Chọn ngày" label="Ngày thi đấu" className="[&>button]:bg-white [&>button]:border-[var(--pc-green-100)] [&>button]:text-[var(--pc-ink)] [&>button]:h-[38px] [&>label]:text-[var(--pc-green-800)] [&>label]:font-mono [&>label]:font-bold [&>label]:tracking-wider [&>label]:text-[10px] [&>label]:uppercase [&>label]:mb-1.5" />
            </div>
            <Button type="submit" variant="AppPrimary" className="w-full md:w-auto h-[38px] px-8 bg-[var(--pc-green-800)] hover:bg-[var(--pc-green-700)] text-white font-bold text-sm shrink-0 rounded-[6px] shadow-[0_10px_24px_rgba(22,101,52,0.22)] cursor-pointer">Tìm sân</Button>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[var(--pc-ink)] tracking-tight">Sân chơi gợi ý gần bạn</h2>
            <p className="text-xs text-[var(--pc-mute)] mt-1">Danh sách public từ `GET /api/Venues`.</p>
          </div>
          <div className="flex flex-wrap gap-1 bg-[var(--pc-hairline-soft)] p-1 rounded-[8px] border border-[var(--pc-hairline)] self-start md:self-auto">
            {sportOptions.map((s) => (
              <button key={s.id || "all"} onClick={() => handlePopularSportClick(s.id)} className={`px-3 py-1 text-xs font-bold rounded-[6px] transition-all cursor-pointer ${activeSportTab === s.id ? "bg-[var(--pc-tennis)] text-[var(--pc-green-950)] shadow-sm" : "text-[var(--pc-body)] hover:text-[var(--pc-ink)]"}`}>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">{[1, 2, 3].map((i) => <div key={i} className="h-[320px] border border-[var(--pc-hairline)] rounded-[12px] bg-white animate-pulse" />)}</div>
        ) : error ? (
          <div className="rounded-[12px] border border-red-200 bg-red-50 p-6 text-sm text-red-800">{error}</div>
        ) : venues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} name={venue.name} image={getVenueImage(venue)} sport={getVenueSportName(venue)} rating={venue.rating ?? 0} nearestSlot={venue.openTime && venue.closeTime ? `${venue.openTime} - ${venue.closeTime}` : "Xem chi tiết"} onScheduleClick={() => router.push(`/venues/${venue.id}`)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[var(--pc-hairline)] rounded-[12px] bg-white">
            <h3 className="text-base font-bold text-[var(--pc-ink)]">Không tìm thấy sân</h3>
            <p className="text-xs text-[var(--pc-mute)] mt-1">Backend hiện trả danh sách rỗng cho bộ lọc này.</p>
          </div>
        )}
      </section>
    </div>
  );
}
