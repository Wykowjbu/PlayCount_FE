import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--pc-mute)]">404</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--pc-ink)]">Không tìm thấy trang</h1>
        <p className="mt-3 text-sm text-[var(--pc-body)]">Đường dẫn này không tồn tại trong PlayCourt.</p>
        <Link className="mt-6 inline-flex rounded-[6px] border border-[var(--pc-hairline)] px-4 py-2 text-sm font-semibold" href="/">Về trang chủ</Link>
      </div>
    </main>
  );
}
