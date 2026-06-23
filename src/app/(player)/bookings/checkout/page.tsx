'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/playcourt/button';
import { Input } from '@/components/playcourt/input';
import { useBookingStore } from '@/stores/booking-store';

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + 'đ';

export default function CheckoutPage() {
  const { draft, updateDraft } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!acceptTerms || isSubmitting) return;
    setIsSubmitting(true);
  };

  const venueName = draft.venueName || 'Sân thể thao PlayCourt';
  const courtName = draft.courtName || 'Court A';
  const date = draft.date || '24/06/2026';
  const slots = draft.timeSlots.length ? draft.timeSlots.join(', ') : '18:00 - 19:00';
  const subtotal = draft.total || 180000;

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-8" aria-label="Thông tin thanh toán">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--pc-mute)]">Booking checkout</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--pc-ink)]">Hoàn tất đặt sân</h1>
        </div>

        <fieldset className="space-y-4 rounded-xl border border-[var(--pc-hairline)] bg-white p-5">
          <legend className="px-1 font-semibold text-[var(--pc-ink)]">Thông tin người đặt</legend>
          <Input label="Họ và tên" value={draft.contactName} onChange={(event) => updateDraft({ contactName: event.target.value })} required />
          <Input label="Số điện thoại" type="tel" value={draft.contactPhone} onChange={(event) => updateDraft({ contactPhone: event.target.value })} required />
          <label className="block text-sm font-medium text-[var(--pc-ink)]">
            Ghi chú cho sân
            <textarea value={draft.note} onChange={(event) => updateDraft({ note: event.target.value })} rows={3} className="mt-2 w-full rounded-md border border-[var(--pc-hairline)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--pc-green-700)] focus:ring-2 focus:ring-[var(--pc-green-100)]" />
          </label>
        </fieldset>

        <fieldset className="space-y-3 rounded-xl border border-[var(--pc-hairline)] bg-white p-5">
          <legend className="px-1 font-semibold text-[var(--pc-ink)]">Phương thức thanh toán</legend>
          {[
            ['card', 'Thẻ ngân hàng'],
            ['wallet', 'Ví điện tử'],
            ['bank-transfer', 'Chuyển khoản'],
          ].map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-3 rounded-md border border-[var(--pc-hairline)] p-3 text-sm text-[var(--pc-ink)]">
              <input type="radio" name="payment-method" value={value} checked={draft.paymentMethod === value} onChange={() => updateDraft({ paymentMethod: value as typeof draft.paymentMethod })} />
              {label}
            </label>
          ))}
        </fieldset>

        <label className="flex items-start gap-3 text-sm text-[var(--pc-body)]">
          <input checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} type="checkbox" className="mt-0.5" />
          Tôi đã đọc và đồng ý với điều khoản đặt sân và chính sách hoàn hủy.
        </label>
        <Button variant="CommitPrimary" type="submit" disabled={!acceptTerms || isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Đang xử lý thanh toán…' : `Thanh toán ${formatCurrency(subtotal)}`}
        </Button>
      </form>

      <aside className="h-fit rounded-xl border border-[var(--pc-hairline)] bg-white p-5 lg:sticky lg:top-24" aria-label="Tóm tắt đơn đặt">
        <h2 className="font-semibold text-[var(--pc-ink)]">Tóm tắt đơn đặt</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-[var(--pc-mute)]">Địa điểm</dt><dd className="text-right font-medium text-[var(--pc-ink)]">{venueName}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-[var(--pc-mute)]">Sân</dt><dd className="text-right text-[var(--pc-ink)]">{courtName}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-[var(--pc-mute)]">Thời gian</dt><dd className="text-right text-[var(--pc-ink)]">{date}<br />{slots}</dd></div>
          <div className="flex justify-between gap-4 border-t border-[var(--pc-hairline)] pt-3"><dt className="font-semibold text-[var(--pc-ink)]">Tổng cộng</dt><dd className="font-semibold text-[var(--pc-ink)]">{formatCurrency(subtotal)}</dd></div>
        </dl>
        <p className="mt-5 rounded-md bg-[var(--pc-green-50)] p-3 text-xs leading-5 text-[var(--pc-green-900)]">Có thể hoàn tiền theo chính sách của sân nếu hủy trước giờ chơi.</p>
      </aside>
    </section>
  );
}
