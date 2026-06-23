'use client';

import { use, useState } from 'react';
import { Button } from '@/components/playcourt/button';
import { StatusBadge } from '@/components/playcourt/status-badge';

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}


export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id: bookingId } = use(params);
  const [activeTab, setActiveTab] = useState<'overview' | 'payment' | 'history'>('overview');
  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyBookingCode = async () => {
    await navigator.clipboard?.writeText(bookingId);
    setCopied(true);
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 lg:px-8">
      <div className="flex flex-col justify-between gap-5 border-b border-[var(--pc-hairline)] pb-6 sm:flex-row sm:items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--pc-mute)]">Booking detail</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--pc-ink)]">Đơn đặt sân</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-[var(--pc-body)]"><code className="rounded bg-[var(--pc-hairline-soft)] px-2 py-1">{bookingId}</code><button type="button" onClick={copyBookingCode} aria-label="Sao chép mã đơn" className="rounded border border-[var(--pc-hairline)] px-2 py-1 text-xs hover:bg-[var(--pc-hairline-soft)]">{copied ? 'Đã sao chép' : 'Sao chép'}</button></div>
        </div>
        <StatusBadge status="confirmed" className="px-3 py-1 text-sm" />
      </div>

      <div className="mt-6 flex gap-1 border-b border-[var(--pc-hairline)]" role="tablist" aria-label="Thông tin đơn đặt">
        {([['overview', 'Tổng quan'], ['payment', 'Thanh toán'], ['history', 'Lịch sử']] as const).map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)} className={`border-b-2 px-4 py-3 text-sm font-medium ${activeTab === id ? 'border-[var(--pc-green-700)] text-[var(--pc-ink)]' : 'border-transparent text-[var(--pc-mute)]'}`}>{label}</button>)}
      </div>
      <div className="mt-6 rounded-xl border border-[var(--pc-hairline)] bg-white p-5 text-sm text-[var(--pc-body)]">
        {activeTab === 'overview' && <div><h2 className="font-semibold text-[var(--pc-ink)]">Sân cầu lông PlayCourt · Court A</h2><p className="mt-2">24/06/2026 · 18:00 - 19:00</p></div>}
        {activeTab === 'payment' && <div><h2 className="font-semibold text-[var(--pc-ink)]">Thanh toán đã xác nhận</h2><p className="mt-2">180.000đ · Thẻ ngân hàng</p></div>}
        {activeTab === 'history' && <ol className="space-y-3"><li><strong className="text-[var(--pc-ink)]">Đã xác nhận</strong><br />Đơn đặt của bạn đã được tạo.</li><li><strong className="text-[var(--pc-ink)]">Đã thanh toán</strong><br />Thanh toán thành công.</li></ol>}
      </div>
      <Button variant="Danger" type="button" className="mt-6" onClick={() => setCancelDialogOpen(true)}>Hủy đặt sân</Button>

      {isCancelDialogOpen && <div role="dialog" aria-modal="true" aria-label="Xác nhận hủy" className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6"><h2 className="text-lg font-semibold text-[var(--pc-ink)]">Xác nhận hủy đặt sân</h2><p className="mt-3 text-sm leading-6 text-[var(--pc-body)]">Bạn sẽ nhận lại 144.000đ theo chính sách hoàn hủy của sân.</p><div className="mt-6 flex justify-end gap-3"><Button variant="Secondary" type="button" onClick={() => setCancelDialogOpen(false)}>Quay lại</Button><Button variant="Danger" type="button" onClick={() => setCancelDialogOpen(false)}>Xác nhận hủy</Button></div></div></div>}
    </section>
  );
}
