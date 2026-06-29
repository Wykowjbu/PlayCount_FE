"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/playcourt/button";
import { ResourceCalendar, type BookingEvent } from "@/components/owner/resource-calendar";
import { api, type BookingStatusCode } from "@/lib/api/client";

function dateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

function dayRange(date: string) {
  const from = new Date(`${date}T00:00:00`);
  const to = new Date(`${date}T23:59:59`);
  return { From: from.toISOString(), To: to.toISOString() };
}

function time(value: string) {
  return new Date(value).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });
}

export default function OwnerCalendarPage() {
  const queryClient = useQueryClient();
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [selectedDate, setSelectedDate] = useState(dateOnly(new Date()));
  const [status, setStatus] = useState<"" | BookingStatusCode>("");
  const [selectedBooking, setSelectedBooking] = useState<BookingEvent | null>(null);
  const [reason, setReason] = useState("");

  const venuesQuery = useQuery({
    queryKey: ["venues", "my"],
    queryFn: () => api.venues.my(),
  });

  const effectiveVenueId = selectedVenueId || String(venuesQuery.data?.data?.[0]?.id ?? "");

  const courtsQuery = useQuery({
    queryKey: ["courts", effectiveVenueId],
    queryFn: () => api.courts.list(effectiveVenueId),
    enabled: !!effectiveVenueId,
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings", "venue", effectiveVenueId, selectedDate, status],
    queryFn: () => api.bookings.venue(effectiveVenueId, { ...dayRange(selectedDate), Status: status || undefined, Page: 1, PageSize: 100 }),
    enabled: !!effectiveVenueId,
  });

  const events = useMemo<BookingEvent[]>(() => {
    return (bookingsQuery.data?.data ?? []).map((booking) => ({
      id: String(booking.id),
      courtId: String(booking.courtId),
      courtName: booking.courtName,
      title: booking.courtName,
      startTime: time(booking.startAt),
      endTime: time(booking.endAt),
      status: booking.status,
      userName: booking.playerName,
      price: booking.totalPrice,
    }));
  }, [bookingsQuery.data]);

  const courts = (courtsQuery.data?.data ?? []).map((court) => ({ id: String(court.id), name: court.name }));

  const invalidateBookings = () => {
    queryClient.invalidateQueries({ queryKey: ["bookings", "venue"] });
    queryClient.invalidateQueries({ queryKey: ["venues", "stats"] });
    setSelectedBooking(null);
    setReason("");
  };

  const confirmMutation = useMutation({ mutationFn: (id: string) => api.bookings.confirm(id, reason), onSuccess: invalidateBookings });
  const rejectMutation = useMutation({ mutationFn: (id: string) => api.bookings.reject(id, reason), onSuccess: invalidateBookings });
  const completeMutation = useMutation({ mutationFn: (id: string) => api.bookings.complete(id, reason), onSuccess: invalidateBookings });

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Owner calendar</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Lịch booking</h1>
        </div>
        <Button type="button" variant="Secondary" onClick={() => bookingsQuery.refetch()} disabled={bookingsQuery.isFetching}>
          {bookingsQuery.isFetching ? "Đang tải..." : "Tải lại"}
        </Button>
      </div>

      <div className="grid gap-3 rounded-[8px] border border-[var(--pc-hairline)] bg-white p-4 md:grid-cols-3">
        <label className="grid gap-1 text-xs font-semibold text-[var(--pc-body)]">
          Venue
          <select value={effectiveVenueId} onChange={(event) => setSelectedVenueId(event.target.value)} className="h-10 rounded-[6px] border border-[var(--pc-hairline)] bg-white px-3 text-sm">
            {(venuesQuery.data?.data ?? []).map((venue) => <option key={venue.id} value={venue.id}>{venue.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold text-[var(--pc-body)]">
          Ngày
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="h-10 rounded-[6px] border border-[var(--pc-hairline)] px-3 text-sm" />
        </label>
        <label className="grid gap-1 text-xs font-semibold text-[var(--pc-body)]">
          Trạng thái
          <select value={status} onChange={(event) => setStatus(event.target.value === "" ? "" : Number(event.target.value) as BookingStatusCode)} className="h-10 rounded-[6px] border border-[var(--pc-hairline)] bg-white px-3 text-sm">
            <option value="">Tất cả</option>
            <option value={0}>Pending</option>
            <option value={1}>Confirmed</option>
            <option value={2}>Completed</option>
            <option value={3}>Cancelled</option>
            <option value={4}>Rejected</option>
          </select>
        </label>
      </div>

      {bookingsQuery.isError && <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-800">{bookingsQuery.error.message}</div>}
      {!effectiveVenueId && <p className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-6 text-sm text-[var(--pc-mute)]">Chưa có venue.</p>}
      {effectiveVenueId && courts.length === 0 && !courtsQuery.isLoading && <p className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-6 text-sm text-[var(--pc-mute)]">Venue chưa có court.</p>}
      {courts.length > 0 && <ResourceCalendar courts={courts} bookings={events} selectedDate={new Date(selectedDate)} onEventClick={setSelectedBooking} />}

      {selectedBooking && (
        <div role="dialog" aria-modal="true" aria-label="Cập nhật booking" className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-[8px] bg-white p-6">
            <h2 className="text-lg font-semibold text-[var(--pc-ink)]">{selectedBooking.title}</h2>
            <p className="mt-2 text-sm text-[var(--pc-body)]">{selectedBooking.userName} · {selectedBooking.startTime} - {selectedBooking.endTime}</p>
            <label className="mt-4 grid gap-1 text-xs font-semibold text-[var(--pc-body)]">
              Ghi chú/lý do
              <textarea value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} className="min-h-24 rounded-[6px] border border-[var(--pc-hairline)] p-3 text-sm" />
            </label>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button type="button" variant="Secondary" onClick={() => setSelectedBooking(null)}>Đóng</Button>
              <Button type="button" onClick={() => window.confirm("Xác nhận booking này?") && confirmMutation.mutate(selectedBooking.id)} disabled={confirmMutation.isPending}>Confirm</Button>
              <Button type="button" variant="Secondary" onClick={() => window.confirm("Hoàn thành booking này?") && completeMutation.mutate(selectedBooking.id)} disabled={completeMutation.isPending}>Complete</Button>
              <Button type="button" variant="Danger" onClick={() => window.confirm("Từ chối booking này?") && rejectMutation.mutate(selectedBooking.id)} disabled={rejectMutation.isPending}>Reject</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
