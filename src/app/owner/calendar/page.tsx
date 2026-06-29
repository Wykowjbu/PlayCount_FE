import Link from "next/link";

export default function OwnerCalendarPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 text-center">
      <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Owner calendar</p>
      <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Lịch booking chưa hỗ trợ</h1>
      <p className="mt-3 text-sm text-[var(--pc-body)]">Backend chưa có Booking API. Lịch khóa/bảo trì court hiện nằm trong tab Schedules của màn hình Venue của tôi.</p>
      <Link className="mt-6 inline-flex rounded-[6px] border border-[var(--pc-hairline)] px-4 py-2 text-sm font-semibold" href="/owner/venues">Mở Venue của tôi</Link>
    </section>
  );
}
