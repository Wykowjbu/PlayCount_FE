"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const NEAR_VENUES_HREF = "/venues?nearMe=true#results";

const quickActions = [
  {
    title: "Tìm sân gần tôi",
    description: "Mở ngay danh sách sân phù hợp quanh khu vực của bạn.",
    href: NEAR_VENUES_HREF,
    icon: MapPin,
  },
  {
    title: "Tìm trận đang chờ",
    description: "Ghép với người chơi cùng môn, cùng lịch, cùng trình độ.",
    href: "/matches",
    icon: Users,
  },
  {
    title: "Đăng sân của bạn",
    description: "Đưa lịch sân lên PlayCourt để người chơi đặt dễ hơn.",
    href: "/owner/onboarding",
    icon: Building2,
  },
];

const steps = [
  ["Chọn khu vực", "Dùng vị trí hiện tại hoặc nhập nơi bạn muốn chơi."],
  ["So sánh sân", "Xem môn thể thao, giờ mở cửa, đánh giá và lịch trống."],
  ["Đặt lịch", "Chốt sân, quản lý booking và rủ thêm người chơi."],
];

const featuredVenues = [
  ["An Phú Sports Center", "Cầu lông", "1,2 km", "Mở đến 22:00"],
  ["Green Field Arena", "Pickleball", "2,8 km", "Còn giờ tối nay"],
  ["Riverside Tennis Club", "Tennis", "4,1 km", "Đánh giá tốt"],
];

const stats = [
  ["120+", "Địa điểm"],
  ["3.500+", "Người chơi"],
  ["8.600+", "Lượt đặt sân"],
  ["96%", "Hài lòng"],
];

type SlideProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
};

// ponytail: local Animate UI-style Slide primitive; replace with registry files if the app adopts shadcn.
function Slide({ children, className = "", delay = 0, direction = "up" }: SlideProps) {
  const offset = 34;
  const initial = {
    opacity: 0,
    x: direction === "left" ? -offset : direction === "right" ? offset : 0,
    y: direction === "up" ? offset : direction === "down" ? -offset : 0,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ShineLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative isolate inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-[6px] border border-[#e4d55a] bg-[var(--pc-tennis)] px-5 text-sm font-bold text-[var(--pc-green-950)] shadow-[0_10px_24px_rgba(22,101,52,0.14)] transition-all hover:bg-[var(--pc-tennis)] active:scale-[0.98] ${className}`}
    >
      <span className="absolute inset-y-[-40%] left-[-60%] w-10 rotate-12 bg-white/55 blur-sm transition-transform duration-700 ease-out group-hover:translate-x-[520%]" />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </Link>
  );
}

function SectionLabel({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "dark";
}) {
  return (
    <p
      className={`mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider ${
        tone === "dark" ? "text-[var(--pc-tennis)]" : "text-[var(--pc-green-800)]"
      }`}
    >
      <span className="h-px w-7 bg-[var(--pc-tennis)]" aria-hidden="true" />
      {children}
    </p>
  );
}

export default function HomePage() {
  return (
    <div className="-mt-16 min-h-screen overflow-hidden bg-[var(--pc-canvas)] text-[var(--pc-body)]">
      <section className="relative overflow-hidden border-b border-[var(--pc-green-100)] bg-[linear-gradient(135deg,#f7fff4_0%,#eefbea_48%,#fff8d8_100%)] px-6 pb-16 pt-32 md:pt-36 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(20,83,45,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(20,83,45,0.10)_1px,transparent_1px)] [background-size:52px_52px]"
        />

        <div className="relative mx-auto grid min-h-[620px] w-full max-w-7xl items-center gap-12 md:grid-cols-[1.02fr_.98fr]">
          <Slide className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-[6px] border border-[var(--pc-green-100)] bg-white/75 px-3 py-1.5 text-xs font-bold text-[var(--pc-green-900)] shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              PlayCourt cho mọi buổi ra sân
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight text-[var(--pc-green-950)] md:text-7xl">
              Tìm sân nhanh.
              <span className="mt-2 block">
                Chơi đúng{" "}
                <span className="rounded-[8px] bg-[var(--pc-tennis)]/75 px-2 text-[var(--pc-green-900)]">
                  cuộc hẹn.
                </span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base font-medium leading-8 text-[var(--pc-body)]">
              PlayCourt giúp người chơi tìm sân, đặt lịch và ghép trận mà không
              phải nhắn hỏi từng nơi một.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ShineLink href={NEAR_VENUES_HREF}>
                <MapPin className="h-4 w-4" />
                Tìm sân gần tôi
              </ShineLink>
              <Link
                href="/matches"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] border border-[var(--pc-green-100)] bg-white/80 px-5 text-sm font-bold text-[var(--pc-green-900)] shadow-sm backdrop-blur transition-all hover:bg-[var(--pc-green-50)] active:scale-[0.98]"
              >
                Tìm trận
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-[var(--pc-mute)]">
              {["Lọc theo môn", "Xem giờ trống", "Quản lý booking"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--pc-green-800)]" />
                  {item}
                </span>
              ))}
            </div>
          </Slide>

          <Slide direction="right" delay={0.1} className="relative min-h-[430px] md:min-h-[540px]">
            <div className="absolute inset-4 overflow-hidden rounded-[12px] border border-white/80 bg-white/70 shadow-[0_24px_70px_rgba(22,101,52,0.14)] backdrop-blur">
              <img
                src="/images/venue-placeholder.svg"
                alt=""
                className="h-full w-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.62),rgba(240,253,244,.24))]" />
              <div className="absolute left-8 right-8 top-1/2 h-0.5 -translate-y-1/2 bg-white/60" />
              <div className="absolute bottom-10 left-10 right-10 top-10 rounded-[8px] border border-white/70" />
            </div>

            <div className="absolute left-0 top-12 rounded-[12px] border border-[var(--pc-hairline)] bg-white p-4 shadow-[0_18px_50px_rgba(20,36,25,.08)]">
              <p className="text-xs font-bold text-[var(--pc-ink)]">Giờ đẹp hôm nay</p>
              <p className="mt-1 text-xs text-[var(--pc-green-800)]">19:00 - 21:00 còn sân</p>
            </div>

            <div className="absolute right-0 top-44 flex items-center gap-3 rounded-[12px] border border-[var(--pc-hairline)] bg-white p-4 shadow-[0_18px_50px_rgba(20,36,25,.08)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[var(--pc-tennis)] text-[var(--pc-green-950)]">
                <Search className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-[var(--pc-ink)]">12 sân phù hợp</p>
                <p className="text-xs text-[var(--pc-mute)]">Trong bán kính 5 km</p>
              </div>
            </div>

            <div className="absolute bottom-8 left-10 right-4 rounded-[12px] border border-[var(--pc-hairline)] bg-white p-4 shadow-[0_18px_50px_rgba(20,36,25,.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--pc-mute)]">
                    Cầu lông · Đang mở
                  </p>
                  <h2 className="mt-1 text-base font-bold text-[var(--pc-ink)]">
                    An Phú Sports Center
                  </h2>
                </div>
                <span className="rounded-[6px] bg-[var(--pc-green-50)] px-2 py-1 text-xs font-bold text-[var(--pc-green-800)]">
                  1,2 km
                </span>
              </div>
            </div>
          </Slide>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 grid w-full max-w-7xl gap-4 px-6 md:grid-cols-3 lg:px-8">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Slide key={action.title} delay={index * 0.06}>
              <Link
                href={action.href}
                className="group flex min-h-44 flex-col justify-between rounded-[12px] border border-[var(--pc-hairline)] bg-white p-5 shadow-[0_18px_50px_rgba(20,36,25,.06)] transition-all hover:-translate-y-1 hover:border-[var(--pc-green-200)] hover:shadow-[0_24px_70px_rgba(22,101,52,0.10)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[var(--pc-tennis)]/75 text-[var(--pc-green-950)] transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-lg font-bold text-[var(--pc-ink)]">
                    {action.title}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-[var(--pc-mute)]">
                    {action.description}
                  </span>
                </span>
              </Link>
            </Slide>
          );
        })}
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-[.95fr_1.05fr]">
          <Slide direction="left" className="relative min-h-[420px]">
            <div className="absolute inset-0 rounded-[12px] border border-[var(--pc-hairline)] bg-[linear-gradient(180deg,#74d899,#3fae66)] shadow-[0_24px_70px_rgba(22,101,52,0.12)]">
              <div className="absolute inset-8 rounded-[8px] border-2 border-white/65" />
              <div className="absolute left-1/2 top-8 bottom-8 w-0.5 -translate-x-1/2 bg-white/55" />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/55" />
            </div>
            <div className="absolute right-4 top-8 rounded-[12px] border border-[var(--pc-hairline)] bg-white p-4 shadow-[0_18px_50px_rgba(20,36,25,.08)]">
              <CalendarCheck className="h-5 w-5 text-[var(--pc-green-800)]" />
              <p className="mt-3 text-sm font-bold text-[var(--pc-ink)]">Đặt sân thành công</p>
              <p className="text-xs text-[var(--pc-mute)]">Thứ Bảy · 19:00</p>
            </div>
            <div className="absolute bottom-8 left-4 rounded-[12px] border border-[var(--pc-hairline)] bg-white p-4 shadow-[0_18px_50px_rgba(20,36,25,.08)]">
              <ShieldCheck className="h-5 w-5 text-[var(--pc-green-800)]" />
              <p className="mt-3 text-sm font-bold text-[var(--pc-ink)]">Lịch rõ ràng</p>
              <p className="text-xs text-[var(--pc-mute)]">Theo dõi trong hồ sơ</p>
            </div>
          </Slide>

          <Slide direction="right">
            <SectionLabel>Một nền tảng cho mọi trận</SectionLabel>
            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[var(--pc-ink)] md:text-5xl">
              Từ ý định chơi đến lúc ra sân, mọi thứ nằm trong một luồng gọn.
            </h2>
            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-[var(--pc-body)] md:text-base">
              PlayCourt đưa người chơi đến đúng hành động: tìm sân, tham gia
              trận, hoặc quản lý lịch sau khi đặt.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                ["Tìm đúng sân", "Lọc theo khu vực, môn chơi và trạng thái mở cửa."],
                ["Xem lịch đặt", "Biết lịch của mình thay vì giữ thông tin rời rạc."],
                ["Kết nối người chơi", "Tạo trận hoặc tham gia trận còn thiếu người."],
              ].map(([title, copy]) => (
                <div key={title} className="flex gap-4 rounded-[12px] border border-[var(--pc-hairline)] bg-white p-4">
                  <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-[var(--pc-tennis)]" />
                  <div>
                    <h3 className="font-bold text-[var(--pc-ink)]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--pc-mute)]">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </Slide>
        </div>
      </section>

      <section className="border-y border-[var(--pc-hairline)] bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <Slide>
            <SectionLabel>Cách hoạt động</SectionLabel>
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[var(--pc-ink)] md:text-5xl">
                Ba bước là đủ để bắt đầu một buổi chơi.
              </h2>
              <Link href="/venues#results" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--pc-green-800)] hover:underline">
                Xem trang tìm sân
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Slide>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map(([title, copy], index) => (
              <Slide key={title} delay={index * 0.06}>
                <article className="min-h-48 rounded-[12px] border border-[var(--pc-hairline)] bg-[var(--pc-canvas)] p-5">
                  <span className="font-mono text-[11px] font-bold text-[var(--pc-green-800)]">
                    0{index + 1}
                  </span>
                  <h3 className="mt-10 text-lg font-bold text-[var(--pc-ink)]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--pc-mute)]">{copy}</p>
                </article>
              </Slide>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <Slide>
            <SectionLabel>Địa điểm nổi bật</SectionLabel>
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[var(--pc-ink)] md:text-5xl">
                Một vài sân đáng chú ý để bạn bắt đầu.
              </h2>
              <ShineLink href="/venues#results" className="shadow-none">
                Xem tất cả sân
                <ArrowRight className="h-4 w-4" />
              </ShineLink>
            </div>
          </Slide>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredVenues.map(([name, sport, distance, status], index) => (
              <Slide key={name} delay={index * 0.06}>
                <article className="overflow-hidden rounded-[12px] border border-[var(--pc-hairline)] bg-white shadow-sm transition-colors hover:border-[var(--pc-faint)]">
                  <div className="relative aspect-[16/9] border-b border-[var(--pc-hairline)] bg-neutral-50">
                    <img src="/images/venue-placeholder.svg" alt="" className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-[6px] bg-white/90 px-2 py-1 text-xs font-bold text-[var(--pc-green-900)]">
                      {distance}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--pc-mute)]">
                      {sport}
                    </p>
                    <h3 className="mt-2 font-bold text-[var(--pc-ink)]">{name}</h3>
                    <div className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold text-[var(--pc-mute)]">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {status}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[var(--pc-ink)]">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        4.8
                      </span>
                    </div>
                  </div>
                </article>
              </Slide>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--pc-green-950)] px-6 py-20 text-white lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[.95fr_1.05fr]">
          <Slide direction="left">
            <SectionLabel tone="dark">Tìm người chơi cùng</SectionLabel>
            <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Không có đội vẫn có thể bắt đầu một trận.
            </h2>
            <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-white/70 md:text-base">
              Tạo trận theo môn chơi, khung giờ, trình độ hoặc tham gia trận
              đang chờ người.
            </p>
            <Link
              href="/matches"
              className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] border border-white/15 bg-white px-5 text-sm font-bold text-[var(--pc-green-950)] transition-all hover:bg-[var(--pc-tennis)] active:scale-[0.98]"
            >
              Tìm trận ngay
              <Trophy className="h-4 w-4" />
            </Link>
          </Slide>

          <Slide direction="right" className="grid gap-4 sm:grid-cols-2">
            {["Minh Hoàng", "Ngọc Trâm"].map((name, index) => (
              <article key={name} className="rounded-[12px] border border-white/10 bg-white/8 p-5 shadow-[0_18px_50px_rgba(0,0,0,.12)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--pc-tennis)] text-sm font-bold text-[var(--pc-green-950)]">
                  {name.split(" ").map((part) => part[0]).join("")}
                </div>
                <h3 className="mt-5 font-bold">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {index === 0
                    ? "Đang tìm thêm 1 người chơi cầu lông tối thứ Bảy."
                    : "Muốn tham gia trận gần khu vực Hải Châu cuối tuần."}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Trung bình", index === 0 ? "19:00" : "Gần bạn"].map((chip) => (
                    <span key={chip} className="rounded-[6px] border border-white/10 px-2 py-1 text-xs font-bold text-white/75">
                      {chip}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </Slide>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-4">
          {stats.map(([value, label], index) => (
            <Slide key={label} delay={index * 0.04}>
              <div className="rounded-[12px] border border-[var(--pc-hairline)] bg-white p-5 text-center">
                <p className="text-3xl font-bold text-[var(--pc-ink)]">{value}</p>
                <p className="mt-1 text-xs font-semibold text-[var(--pc-mute)]">{label}</p>
              </div>
            </Slide>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-8">
        <Slide>
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 rounded-[12px] border border-[var(--pc-green-100)] bg-[linear-gradient(135deg,#f7fff4_0%,#eefbea_52%,#fff8d8_100%)] p-6 shadow-[0_24px_70px_rgba(22,101,52,0.10)] md:flex-row md:items-center md:p-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--pc-ink)] md:text-4xl">
                Sẵn sàng ra sân?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--pc-body)]">
                Chuyển thẳng đến trang tìm sân và xem kết quả phù hợp ngay.
              </p>
            </div>
            <ShineLink href={NEAR_VENUES_HREF}>
              <MapPin className="h-4 w-4" />
              Tìm sân gần tôi
            </ShineLink>
          </div>
        </Slide>
      </section>
    </div>
  );
}
