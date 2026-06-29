import Link from "next/link";

export default function MatchesPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 text-center">
      <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Matchmaking</p>
      <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Tìm trận đấu</h1>
      <p className="mt-3 text-sm text-[var(--pc-body)]">Backend hiện chưa có API Match, participant hoặc invitation, nên luồng này đã được khóa thay vì giả lập dữ liệu.</p>
      <Link className="mt-6 inline-flex rounded-[6px] border border-[var(--pc-hairline)] px-4 py-2 text-sm font-semibold" href="/venues">Tìm sân public</Link>
    </section>
  );
}
