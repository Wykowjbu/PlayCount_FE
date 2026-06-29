"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/playcourt/button";
import {
  api,
  getVenueAmenityNames,
  getVenueImage,
  getVenueSportName,
  getStoredUser,
  type Court,
  type CourtSchedule,
  type OpeningHour,
  type PricingRule,
  type Venue,
} from "@/lib/api/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

const dayNames: Record<number, string> = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "Chủ nhật",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

export default function VenueDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [activeCourtId, setActiveCourtId] = useState<string | number | null>(null);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [schedules, setSchedules] = useState<CourtSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [courtLoading, setCourtLoading] = useState(false);
  const [error, setError] = useState("");
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    Promise.all([
      api.venues.detail(id),
      api.venues.openingHours(id).catch(() => ({ data: [] })),
      api.courts.list(id).catch(() => ({ data: [] })),
    ])
      .then(([venueResponse, hoursResponse, courtsResponse]) => {
        if (!alive) return;
        setVenue(venueResponse.data);
        setOpeningHours(hoursResponse.data ?? []);
        setCourts(courtsResponse.data ?? []);
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : "Không thể tải chi tiết sân.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    if (!activeCourtId) return;
    let alive = true;
    setCourtLoading(true);
    Promise.all([
      api.courts.pricingRules(activeCourtId).catch(() => ({ data: [] })),
      api.courts.schedules(activeCourtId).catch(() => ({ data: [] })),
    ])
      .then(([pricingResponse, schedulesResponse]) => {
        if (!alive) return;
        setPricingRules(pricingResponse.data ?? []);
        setSchedules(schedulesResponse.data ?? []);
      })
      .finally(() => {
        if (alive) setCourtLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [activeCourtId]);

  const toggleFavorite = async () => {
    if (!venue) return;
    const user = getStoredUser();
    if (!user) {
      router.push(`/login?next=/venues/${venue.id}`);
      return;
    }
    if (user.role !== "Player") {
      setMessage("Chỉ tài khoản Player mới có thể lưu sân yêu thích.");
      return;
    }
    setFavoriteLoading(true);
    setMessage("");
    try {
      if (venue.isFavorite) {
        await api.venues.unfavorite(venue.id);
        setVenue({ ...venue, isFavorite: false });
      } else {
        await api.venues.favorite(venue.id);
        setVenue({ ...venue, isFavorite: true });
      }
      setMessage(venue.isFavorite ? "Đã bỏ yêu thích." : "Đã thêm vào yêu thích.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Không thể cập nhật yêu thích.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-[var(--pc-mute)]">Đang tải chi tiết sân...</div>;
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-[var(--pc-ink)]">Không thể tải sân</h1>
        <p className="text-sm text-[var(--pc-mute)]">{error}</p>
        <Button variant="Secondary" onClick={() => router.push("/venues")}>Quay lại danh sách</Button>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-[var(--pc-ink)]">Không tìm thấy sân</h1>
        <Button variant="Secondary" onClick={() => router.push("/venues")}>Quay lại danh sách</Button>
      </div>
    );
  }

  const amenities = getVenueAmenityNames(venue);

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 bg-[var(--pc-canvas)] px-6 py-8">
      <div className="overflow-hidden rounded-[12px] border border-[var(--pc-hairline)] bg-white">
        {getVenueImage(venue) ? (
          <img src={getVenueImage(venue)} alt={venue.name} className="h-[320px] w-full object-cover" />
        ) : (
          <div className="grid h-[320px] place-items-center bg-[var(--pc-hairline-soft)] text-sm text-[var(--pc-mute)]">Chưa có ảnh sân</div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_360px]">
        <main className="flex flex-col gap-6">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--pc-mute)]">{getVenueSportName(venue)}</span>
            <h1 className="mt-2 text-3xl font-extrabold text-[var(--pc-ink)]">{venue.name}</h1>
            <p className="mt-2 text-sm text-[var(--pc-body)]">{venue.address || "Chưa cập nhật địa chỉ"}</p>
            {venue.description && <p className="mt-4 text-sm leading-6 text-[var(--pc-body)]">{venue.description}</p>}
          </div>

          <section className="rounded-[12px] border border-[var(--pc-hairline)] bg-white p-5">
            <h2 className="text-lg font-bold text-[var(--pc-ink)]">Giờ mở cửa</h2>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {openingHours.length ? openingHours.map((hour) => (
                <div key={hour.dayOfWeek} className="flex justify-between rounded-[6px] bg-[var(--pc-hairline-soft)] px-3 py-2 text-sm">
                  <span>{dayNames[hour.dayOfWeek] ?? `Ngày ${hour.dayOfWeek}`}</span>
                  <span className="font-semibold">{hour.isClosed ? "Đóng cửa" : `${hour.openTime ?? "--"} - ${hour.closeTime ?? "--"}`}</span>
                </div>
              )) : <p className="text-sm text-[var(--pc-mute)]">Chưa có giờ mở cửa từ API.</p>}
            </div>
          </section>

          <section className="rounded-[12px] border border-[var(--pc-hairline)] bg-white p-5">
            <h2 className="text-lg font-bold text-[var(--pc-ink)]">Tiện ích</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.length ? amenities.map((amenity) => <span key={amenity} className="rounded-[6px] border border-[var(--pc-hairline)] px-3 py-1.5 text-xs font-semibold">{amenity}</span>) : <p className="text-sm text-[var(--pc-mute)]">Chưa có tiện ích.</p>}
            </div>
          </section>

          <section className="rounded-[12px] border border-[var(--pc-hairline)] bg-white p-5">
            <h2 className="text-lg font-bold text-[var(--pc-ink)]">Sân con, bảng giá và lịch khóa</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {courts.map((court) => (
                <Button key={court.id} type="button" variant={activeCourtId === court.id ? "AppPrimary" : "Secondary"} onClick={() => setActiveCourtId(court.id)}>
                  {court.name}
                </Button>
              ))}
              {!courts.length && <p className="text-sm text-[var(--pc-mute)]">Venue này chưa có sân con từ API.</p>}
            </div>
            {activeCourtId && (
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold text-[var(--pc-ink)]">Pricing rules</h3>
                  {courtLoading ? <p className="mt-2 text-sm text-[var(--pc-mute)]">Đang tải...</p> : pricingRules.length ? (
                    <ul className="mt-2 divide-y divide-[var(--pc-hairline)] text-sm">
                      {pricingRules.map((rule) => <li key={rule.id} className="py-2">{dayNames[rule.dayOfWeek]} · {rule.startTime}-{rule.endTime} · <strong>{formatMoney(rule.pricePerHour)}</strong></li>)}
                    </ul>
                  ) : <p className="mt-2 text-sm text-[var(--pc-mute)]">Chưa có bảng giá.</p>}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--pc-ink)]">Schedules</h3>
                  {courtLoading ? <p className="mt-2 text-sm text-[var(--pc-mute)]">Đang tải...</p> : schedules.length ? (
                    <ul className="mt-2 divide-y divide-[var(--pc-hairline)] text-sm">
                      {schedules.map((schedule) => <li key={schedule.id} className="py-2">{new Date(schedule.startAt).toLocaleString("vi-VN")} - {new Date(schedule.endAt).toLocaleString("vi-VN")}<br /><span className="text-[var(--pc-mute)]">{schedule.reason || "Không có lý do"}</span></li>)}
                    </ul>
                  ) : <p className="mt-2 text-sm text-[var(--pc-mute)]">Không có lịch khóa/bảo trì.</p>}
                </div>
              </div>
            )}
          </section>
        </main>

        <aside className="h-fit rounded-[12px] border border-[var(--pc-hairline)] bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--pc-mute)]">Trạng thái venue</p>
          <p className="mt-1 text-lg font-bold text-[var(--pc-ink)]">{venue.status ?? "Approved"}</p>
          <Button type="button" disabled className="mt-5 w-full">Booking chưa có API</Button>
          <Button type="button" variant="Secondary" disabled={favoriteLoading} onClick={toggleFavorite} className="mt-3 w-full">
            {favoriteLoading ? "Đang lưu..." : venue.isFavorite ? "Bỏ yêu thích" : "Lưu yêu thích"}
          </Button>
          {message && <p className="mt-3 rounded-[6px] bg-[var(--pc-hairline-soft)] p-3 text-sm text-[var(--pc-body)]">{message}</p>}
        </aside>
      </div>
    </div>
  );
}
