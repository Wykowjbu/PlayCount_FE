"use client";

import { use, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/playcourt/button";
import { StatusBadge } from "@/components/playcourt/status-badge";
import { api } from "@/lib/api/client";

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

function canCancel(status?: string) {
  const normalized = String(status || "").toLowerCase();
  return normalized === "pending" || normalized === "confirmed";
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id: bookingId } = use(params);
  const queryClient = useQueryClient();
  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [copied, setCopied] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState("");

  const bookingQuery = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: async () => {
      const response = await api.bookings.detail(bookingId);
      if (!response.data) throw new Error(response.message || "Không thể tải booking.");
      return response.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.bookings.cancel(bookingId, cancelReason),
    onSuccess: () => {
      setCancelDialogOpen(false);
      setCancelReason("");
      queryClient.invalidateQueries({ queryKey: ["bookings", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "me"] });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: () =>
      api.reviews.create({
        bookingId: Number(bookingId),
        rating,
        reviewText: reviewText.trim() || null,
        imageUrls: null,
      }),
    onSuccess: () => {
      setReviewText("");
      setReviewMessage("Đã gửi review.");
      queryClient.invalidateQueries({ queryKey: ["reviews", "my"] });
    },
    onError: (err) => {
      setReviewMessage(err instanceof Error ? err.message : "Không thể gửi review.");
    },
  });

  const copyBookingCode = async () => {
    await navigator.clipboard?.writeText(bookingId);
    setCopied(true);
  };

  if (bookingQuery.isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-[var(--pc-mute)]">Đang tải booking...</div>;
  }

  if (bookingQuery.isError) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-[var(--pc-ink)]">Không thể tải booking</h1>
        <p className="mt-3 text-sm text-[var(--pc-mute)]">{bookingQuery.error.message}</p>
        <Button type="button" className="mt-5" onClick={() => bookingQuery.refetch()}>
          Thử lại
        </Button>
      </section>
    );
  }

  const booking = bookingQuery.data;
  if (!booking) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-[var(--pc-mute)]">Không tìm thấy booking.</div>;
  }
  const completed = String(booking.status).toLowerCase() === "completed";

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 lg:px-8">
      <div className="flex flex-col justify-between gap-5 border-b border-[var(--pc-hairline)] pb-6 sm:flex-row sm:items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--pc-mute)]">Booking detail</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--pc-ink)]">Đơn đặt sân</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-[var(--pc-body)]">
            <code className="rounded bg-[var(--pc-hairline-soft)] px-2 py-1">{bookingId}</code>
            <button type="button" onClick={copyBookingCode} aria-label="Sao chép mã đơn" className="rounded border border-[var(--pc-hairline)] px-2 py-1 text-xs hover:bg-[var(--pc-hairline-soft)]">
              {copied ? "Đã sao chép" : "Sao chép"}
            </button>
          </div>
        </div>
        <StatusBadge status={booking.status} className="px-3 py-1 text-sm" />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1fr_320px]">
        <article className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5 text-sm text-[var(--pc-body)]">
          <h2 className="font-semibold text-[var(--pc-ink)]">{booking.courtName} - {booking.venueName}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-[var(--pc-mute)]">Bắt đầu</dt>
              <dd className="mt-1 font-semibold text-[var(--pc-ink)]">{formatDateTime(booking.startAt)}</dd>
            </div>
            <div>
              <dt className="text-[var(--pc-mute)]">Kết thúc</dt>
              <dd className="mt-1 font-semibold text-[var(--pc-ink)]">{formatDateTime(booking.endAt)}</dd>
            </div>
            <div>
              <dt className="text-[var(--pc-mute)]">Người chơi</dt>
              <dd className="mt-1 font-semibold text-[var(--pc-ink)]">{booking.playerName}</dd>
            </div>
            <div>
              <dt className="text-[var(--pc-mute)]">Tổng tiền</dt>
              <dd className="mt-1 font-semibold text-[var(--pc-ink)]">{formatMoney(booking.totalPrice)}</dd>
            </div>
          </dl>
          {booking.note && <p className="mt-4 rounded-[6px] bg-[var(--pc-hairline-soft)] p-3">Ghi chú: {booking.note}</p>}
        </article>

        <aside className="h-fit rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
          <h2 className="font-semibold text-[var(--pc-ink)]">Thao tác</h2>
          <p className="mt-2 text-sm text-[var(--pc-mute)]">Payment API chưa có, nên không hiển thị trạng thái thanh toán.</p>
          {canCancel(booking.status) && (
            <Button variant="Danger" type="button" className="mt-5 w-full" onClick={() => setCancelDialogOpen(true)}>
              Hủy đặt sân
            </Button>
          )}
        </aside>
      </div>

      {completed && (
        <section className="mt-6 rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
          <h2 className="font-semibold text-[var(--pc-ink)]">Review booking</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr]">
            <label className="grid gap-1 text-xs font-semibold text-[var(--pc-body)]">
              Rating
              <input type="number" min={1} max={5} step={0.5} value={rating} onChange={(event) => setRating(Number(event.target.value))} className="h-10 rounded-[6px] border border-[var(--pc-hairline)] px-3 text-sm" />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-[var(--pc-body)]">
              Nội dung
              <textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} className="min-h-24 rounded-[6px] border border-[var(--pc-hairline)] p-3 text-sm" />
            </label>
          </div>
          <Button type="button" className="mt-4" disabled={reviewMutation.isPending} onClick={() => reviewMutation.mutate()}>
            {reviewMutation.isPending ? "Đang gửi..." : "Gửi review"}
          </Button>
          {reviewMessage && <p className="mt-3 text-sm text-[var(--pc-body)]">{reviewMessage}</p>}
        </section>
      )}

      {isCancelDialogOpen && (
        <div role="dialog" aria-modal="true" aria-label="Xác nhận hủy" className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-[8px] bg-white p-6">
            <h2 className="text-lg font-semibold text-[var(--pc-ink)]">Xác nhận hủy đặt sân</h2>
            <label className="mt-4 block text-xs font-semibold text-[var(--pc-body)]">
              Lý do
              <textarea value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} maxLength={500} className="mt-1 min-h-24 w-full rounded-[6px] border border-[var(--pc-hairline)] p-3 text-sm" />
            </label>
            {cancelMutation.isError && <p className="mt-3 text-sm text-red-700">{cancelMutation.error.message}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="Secondary" type="button" onClick={() => setCancelDialogOpen(false)} disabled={cancelMutation.isPending}>
                Quay lại
              </Button>
              <Button variant="Danger" type="button" onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}>
                {cancelMutation.isPending ? "Đang hủy..." : "Xác nhận hủy"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
