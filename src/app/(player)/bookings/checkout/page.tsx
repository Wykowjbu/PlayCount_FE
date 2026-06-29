import Link from "next/link";

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 text-center">
      <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Booking checkout</p>
      <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Booking chưa có API</h1>
      <p className="mt-3 text-sm text-[var(--pc-body)]">Swagger hiện chưa có Booking hoặc Payment endpoint, nên checkout được chuyển sang trạng thái khóa thay vì giả lập thanh toán.</p>
      <Link className="mt-6 inline-flex rounded-[6px] border border-[var(--pc-hairline)] px-4 py-2 text-sm font-semibold" href="/venues">Quay lại tìm sân</Link>
    </section>
  );
}
