import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--pc-mute)]">403</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--pc-ink)]">Bạn không có quyền truy cập</h1>
        <p className="mt-3 text-sm text-[var(--pc-body)]">Tài khoản hiện tại không được phép mở màn hình này.</p>
        <Link className="mt-6 inline-flex rounded-[6px] bg-[var(--pc-green-800)] px-4 py-2 text-sm font-semibold text-white" href="/">Về trang chủ</Link>
      </div>
    </main>
  );
}
