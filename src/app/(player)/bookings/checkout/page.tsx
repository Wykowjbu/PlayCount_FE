"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/playcourt/button";
import { api } from "@/lib/api/client";
import { useBookingStore } from "@/stores/booking-store";

function formatMoney(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

export default function CheckoutPage() {
  const router = useRouter();
  const draft = useBookingStore((state) => state.draft);
  const updateDraft = useBookingStore((state) => state.updateDraft);
  const resetDraft = useBookingStore((state) => state.reset);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submitBooking = async () => {
    if (!draft.courtId || !draft.startAt || !draft.endAt) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await api.bookings.create({
        courtId: draft.courtId,
        startAt: draft.startAt,
        endAt: draft.endAt,
        note: draft.note.trim() || null,
      });
      const booking = response.data;
      if (!booking) throw new Error(response.message || "Không thể tạo booking.");
      resetDraft();
      router.push(`/bookings/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!draft.courtId) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Booking checkout</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Chưa có lựa chọn sân</h1>
        <p className="mt-3 text-sm text-[var(--pc-body)]">Hãy chọn khung giờ từ trang chi tiết venue trước khi tạo booking.</p>
        <Link className="mt-6 inline-flex rounded-[6px] border border-[var(--pc-hairline)] px-4 py-2 text-sm font-semibold" href="/venues">
          Quay lại tìm sân
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Booking checkout</p>
      <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Xác nhận đặt sân</h1>

      <div className="mt-6 rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[var(--pc-mute)]">Venue</dt>
            <dd className="mt-1 font-semibold text-[var(--pc-ink)]">{draft.venueName}</dd>
          </div>
          <div>
            <dt className="text-[var(--pc-mute)]">Sân</dt>
            <dd className="mt-1 font-semibold text-[var(--pc-ink)]">{draft.courtName}</dd>
          </div>
          <div>
            <dt className="text-[var(--pc-mute)]">Bắt đầu</dt>
            <dd className="mt-1 font-semibold text-[var(--pc-ink)]">{formatDateTime(draft.startAt)}</dd>
          </div>
          <div>
            <dt className="text-[var(--pc-mute)]">Kết thúc</dt>
            <dd className="mt-1 font-semibold text-[var(--pc-ink)]">{formatDateTime(draft.endAt)}</dd>
          </div>
          <div>
            <dt className="text-[var(--pc-mute)]">Giá dự kiến</dt>
            <dd className="mt-1 font-semibold text-[var(--pc-ink)]">
              {draft.estimatedPrice == null ? "Backend sẽ tính khi tạo đơn" : formatMoney(draft.estimatedPrice)}
            </dd>
          </div>
        </dl>

        <label className="mt-5 block text-xs font-semibold text-[var(--pc-body)]">
          Ghi chú
          <textarea
            value={draft.note}
            onChange={(event) => updateDraft({ note: event.target.value })}
            maxLength={500}
            className="mt-1 min-h-24 w-full rounded-[6px] border border-[var(--pc-hairline)] p-3 text-sm outline-none focus:border-[var(--pc-green-700)] focus:ring-2 focus:ring-[var(--pc-green-600)]"
          />
        </label>
      </div>

      <div className="mt-6 rounded-[8px] border border-[var(--pc-warning)] bg-[var(--pc-warning-soft)] p-4 text-sm text-[var(--pc-warning-deep)]">
        Payment API chưa có trong backend. Màn hình này chỉ tạo booking thật.
      </div>

      {error && <div className="mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" disabled={isSubmitting} onClick={submitBooking}>
          {isSubmitting ? "Đang tạo..." : "Tạo booking"}
        </Button>
        <Button type="button" variant="Secondary" onClick={() => router.back()} disabled={isSubmitting}>
          Quay lại
        </Button>
      </div>
    </section>
  );
}
