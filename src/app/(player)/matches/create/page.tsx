import Link from "next/link";

export default function CreateMatchPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 text-center">
      <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Create match</p>
      <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Chưa hỗ trợ tạo trận</h1>
      <p className="mt-3 text-sm text-[var(--pc-body)]">Swagger chưa có API Match, nên form tạo trận không còn fake lưu bản nháp hoặc fake submit.</p>
      <Link className="mt-6 inline-flex rounded-[6px] border border-[var(--pc-hairline)] px-4 py-2 text-sm font-semibold" href="/matches">Quay lại</Link>
    </section>
  );
}
