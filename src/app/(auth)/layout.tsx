import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng nhập - PlayCourt',
  description: 'Đặt sân thể thao, tạo trận và kết nối người chơi',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full min-h-0 overflow-hidden grid lg:grid-cols-[1.15fr_0.85fr]">
      {/* Visual Panel - Bên trái */}
      <div className="relative hidden lg:flex h-full flex-col border-r border-gray-200 px-12 py-8 overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-green-100/20">
        {/* Decorative circles */}
        <div className="absolute w-[520px] h-[760px] border border-green-900/10 rounded-full -right-48 top-16 rotate-[18deg]" />
        <div className="absolute w-[380px] h-[560px] border border-green-900/10 rounded-full -right-24 top-40 rotate-[18deg]" />

        {/* Gradient orbs */}
        <div className="absolute w-64 h-64 bg-[#c7f227]/25 rounded-full blur-3xl top-20 left-20" />
        <div className="absolute w-48 h-48 bg-green-500/13 rounded-full blur-3xl bottom-32 right-32" />

        {/* Brand - fixed top */}
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg border border-gray-800 bg-gray-900 relative overflow-hidden">
            <div className="absolute w-3 h-3 left-[13px] top-1 bg-[#c7f227] rounded-full" />
            <div className="absolute w-[11px] h-[11px] left-1 top-3.5 bg-white rounded-full" />
          </div>
          <span className="text-lg font-semibold tracking-tight">PlayCourt</span>
        </div>

        {/* Main Copy - centered in remaining space */}
        <div className="relative z-10 flex-1 min-h-0 flex items-center">
          <div className="max-w-[650px] mx-0">
            <div className="font-mono text-sm font-medium text-green-800 mb-3">
              Đặt sân · Tạo trận · Giao lưu
            </div>
            <h1 className="text-5xl font-semibold leading-[48px] tracking-[-2.4px] mb-5 max-w-[620px]">
              Sân tốt. Đồng đội hợp. Trận đấu bắt đầu.
            </h1>
            <p className="text-base leading-6 text-gray-700 max-w-[560px]">
              Đặt sân thể thao trong vài phút, tạo kèo công khai và tìm người chơi cùng trình độ quanh bạn.
            </p>

            {/* Court Art */}
            <div className="w-[min(520px,82%)] aspect-[1.65] mt-9 border border-gray-900/20 rounded-2xl bg-white/40 relative"
                 style={{
                   transform: 'perspective(900px) rotateX(56deg) rotateZ(-8deg)',
                 }}>
              <div className="absolute inset-[12%] border border-green-900/35"
                   style={{
                     background: `
                       linear-gradient(90deg, transparent calc(50% - 0.5px), rgba(22,101,52,0.38) 50%, transparent calc(50% + 0.5px)),
                       linear-gradient(0deg, transparent calc(50% - 0.5px), rgba(22,101,52,0.38) 50%, transparent calc(50% + 0.5px))
                     `
                   }}
              />
            </div>
          </div>
        </div>

        {/* Proof - fixed bottom */}
        <div className="relative z-10 flex gap-2.5 items-center text-gray-700 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#c7f227] shadow-[0_0_0_3px_rgba(199,242,39,0.18)]" />
          <span>
            <b>12.000+</b> người chơi trong cộng đồng PlayCourt.
          </span>
        </div>
      </div>

      {/* Form Panel - Bên phải */}
      <main className="grid h-full min-h-0 place-items-center overflow-y-auto scrollbar-gutter-stable bg-white px-6 py-6">
        {children}
      </main>
    </div>
  )
}
