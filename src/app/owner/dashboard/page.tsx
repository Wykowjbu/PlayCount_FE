"use client";

import React from "react";
import { 
  TrendingUp, 
  CreditCard, 
  Users, 
  CalendarDays, 
  ArrowUpRight, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { StatusBadge } from "@/components/playcourt/status-badge";
import { Button } from "@/components/playcourt/button";

// Mock revenue data for the last 7 days
const weeklyRevenue = [
  { day: "Thứ 4", amount: 3200000 },
  { day: "Thứ 5", amount: 2800000 },
  { day: "Thứ 6", amount: 4500000 },
  { day: "Thứ 7", amount: 6200000 },
  { day: "Chủ Nhật", amount: 7800000 },
  { day: "Thứ 2", amount: 3500000 },
  { day: "Thứ 3", amount: 4850000 }, // Hôm nay
];

const pendingTasks = [
  {
    id: "booking-1084",
    user: "Nguyễn Văn A",
    phone: "0901 234 567",
    court: "Sân Tennis Đất Nện 1",
    time: "18:00 - 20:00 (Hôm nay)",
    price: "360,000 ₫",
    status: "pending",
    type: "Chờ xác nhận chuyển khoản",
  },
  {
    id: "booking-1072",
    user: "Trần Thị B",
    phone: "0987 654 321",
    court: "Sân Tennis Cứng 2",
    time: "15:00 - 17:00 (Ngày mai)",
    price: "300,000 ₫",
    status: "needs action",
    type: "Yêu cầu hoàn tiền (Hủy đặt)",
  },
  {
    id: "booking-1090",
    user: "Lê Văn C",
    phone: "0912 345 678",
    court: "Sân Tennis Đất Nện 1",
    time: "20:00 - 22:00 (Hôm nay)",
    price: "360,000 ₫",
    status: "pending",
    type: "Chờ duyệt booking thủ công",
  },
];

export default function OwnerDashboard() {
  // SVG Chart settings
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 30;
  const graphHeight = chartHeight - padding * 2;
  const graphWidth = chartWidth - padding * 2;

  const maxAmount = Math.max(...weeklyRevenue.map(d => d.amount));
  
  // Calculate points for the line graph
  const points = weeklyRevenue.map((d, index) => {
    const x = padding + (index * (graphWidth / (weeklyRevenue.length - 1)));
    const y = chartHeight - padding - ((d.amount / maxAmount) * graphHeight);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Upper Title Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--pc-mute)] font-semibold">
            PlayCourt Pro &gt; Tổng quan
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--pc-ink)] tracking-tight">
            Bảng điều khiển
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-[var(--pc-mute)] font-medium">
            Quản lý dữ liệu hôm nay
          </span>
          <div className="h-2 w-2 rounded-full bg-[var(--pc-green-500)] animate-pulse" />
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh thu */}
        <div className="border border-[var(--pc-hairline)] bg-[var(--pc-surface)] rounded-[12px] p-5 shadow-xs flex flex-col justify-between hover:border-[var(--pc-faint)] transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[var(--pc-mute)] uppercase tracking-wider font-mono">
              Doanh thu (Tháng này)
            </span>
            <div className="h-8 w-8 rounded-lg bg-[var(--pc-green-50)] text-[var(--pc-green-800)] flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-[var(--pc-ink)] tracking-tight">
              44,850,000 ₫
            </h3>
            <p className="text-[11px] text-[var(--pc-green-800)] font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12.4% so với tháng trước</span>
            </p>
          </div>
        </div>

        {/* Đơn đặt sân */}
        <div className="border border-[var(--pc-hairline)] bg-[var(--pc-surface)] rounded-[12px] p-5 shadow-xs flex flex-col justify-between hover:border-[var(--pc-faint)] transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[var(--pc-mute)] uppercase tracking-wider font-mono">
              Đơn đặt sân
            </span>
            <div className="h-8 w-8 rounded-lg bg-[var(--pc-green-50)] text-[var(--pc-green-800)] flex items-center justify-center">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-[var(--pc-ink)] tracking-tight">
              128 đơn
            </h3>
            <p className="text-[11px] text-[var(--pc-mute)] mt-1 font-medium">
              102 sân đất nện, 26 sân cứng
            </p>
          </div>
        </div>

        {/* Tỷ lệ lấp đầy */}
        <div className="border border-[var(--pc-hairline)] bg-[var(--pc-surface)] rounded-[12px] p-5 shadow-xs flex flex-col justify-between hover:border-[var(--pc-faint)] transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[var(--pc-mute)] uppercase tracking-wider font-mono">
              Tỷ lệ lấp đầy
            </span>
            <div className="h-8 w-8 rounded-lg bg-[var(--pc-green-50)] text-[var(--pc-green-800)] flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-[var(--pc-ink)] tracking-tight">
              78.5%
            </h3>
            <p className="text-[11px] text-[var(--pc-green-800)] font-semibold mt-1 flex items-center gap-1">
              <span>Tăng 4.2% tuần này</span>
            </p>
          </div>
        </div>

        {/* Đang chờ duyệt */}
        <div className="border border-[var(--pc-hairline)] bg-[var(--pc-surface)] rounded-[12px] p-5 shadow-xs flex flex-col justify-between hover:border-[var(--pc-faint)] transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[var(--pc-mute)] uppercase tracking-wider font-mono">
              Chờ xử lý gấp
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-[var(--pc-warning-deep)] flex items-center justify-center">
              <Clock className="h-4 w-4 animate-spin-slow" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-[var(--pc-ink)] tracking-tight">
              3 booking
            </h3>
            <p className="text-[11px] text-[var(--pc-warning-deep)] font-semibold mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>Yêu cầu xử lý trong hôm nay</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Chart + Tasks) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Revenue Chart */}
        <div className="lg:col-span-2 border border-[var(--pc-hairline)] bg-[var(--pc-surface)] rounded-[12px] p-6 shadow-xs flex flex-col justify-between hover:border-[var(--pc-faint)] transition-all">
          <div className="flex items-center justify-between border-b border-[var(--pc-hairline-soft)] pb-4 mb-4 select-none">
            <div>
              <h2 className="text-base font-extrabold text-[var(--pc-ink)]">
                Biểu đồ Doanh thu tuần qua
              </h2>
              <p className="text-xs text-[var(--pc-mute)] font-medium">
                Dữ liệu cập nhật theo ngày
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--pc-green-800)] bg-[var(--pc-green-50)] px-2.5 py-1 rounded-[4px] border border-[var(--pc-green-200)]">
              <span>Đạt kỷ lục</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* SVG Canvas wrapper */}
          <div className="flex-1 w-full flex items-center justify-center py-2">
            <svg 
              className="w-full h-full max-h-[220px]" 
              viewBox=`0 0 ${chartWidth} ${chartHeight}`
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Gridlines */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--pc-hairline-soft)" strokeDasharray="3,3" />
              <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="var(--pc-hairline-soft)" strokeDasharray="3,3" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--pc-hairline)" />

              {/* Area under the line */}
              <path
                d={`M${padding},${chartHeight - padding} ${points} L${chartWidth - padding},${chartHeight - padding} Z`}
                d_fixed={`M${padding},${chartHeight - padding} ${points} L${chartWidth - padding},${chartHeight - padding} Z`}
                fill="url(#gradient)"
                opacity="0.1"
              />

              {/* Sparkline path */}
              <polyline
                fill="none"
                stroke="var(--pc-green-600)"
                strokeWidth="2.5"
                points={points}
              />

              {/* Interactive Dots */}
              {weeklyRevenue.map((d, index) => {
                const x = padding + (index * (graphWidth / (weeklyRevenue.length - 1)));
                const y = chartHeight - padding - ((d.amount / maxAmount) * graphHeight);
                return (
                  <g key={index} className="group/dot cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      className="fill-[var(--pc-green-600)] stroke-white stroke-2 group-hover/dot:r-6 transition-all duration-150"
                    />
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      className="hidden group-hover/dot:block font-mono text-[9px] font-bold fill-[var(--pc-ink)] bg-white"
                    >
                      {`${(d.amount / 1000000).toFixed(1)}M`}
                    </text>
                  </g>
                );
              })}

              {/* Day Labels */}
              {weeklyRevenue.map((d, index) => {
                const x = padding + (index * (graphWidth / (weeklyRevenue.length - 1)));
                return (
                  <text
                    key={index}
                    x={x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    className="font-sans text-[10px] font-semibold fill-[var(--pc-mute)] select-none"
                  >
                    {d.day}
                  </text>
                );
              })}

              {/* SVG Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--pc-green-500)" />
                  <stop offset="100%" stopColor="var(--pc-green-50)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Task List / Urgent Actions */}
        <div className="border border-[var(--pc-hairline)] bg-[var(--pc-surface)] rounded-[12px] p-6 shadow-xs flex flex-col justify-between hover:border-[var(--pc-faint)] transition-all">
          <div className="flex items-center justify-between border-b border-[var(--pc-hairline-soft)] pb-4 mb-4 select-none">
            <div>
              <h2 className="text-base font-extrabold text-[var(--pc-ink)]">
                Công việc cần xử lý gấp
              </h2>
              <p className="text-xs text-[var(--pc-mute)] font-medium">
                Yêu cầu duyệt hoặc hoàn tiền
              </p>
            </div>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-[var(--pc-warning-deep)]">
              {pendingTasks.length}
            </span>
          </div>

          {/* Task Items List */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[220px] pr-1">
            {pendingTasks.map((task) => (
              <div 
                key={task.id}
                className="border border-[var(--pc-hairline-soft)] rounded-[8px] p-3 bg-[var(--pc-canvas)] hover:border-[var(--pc-hairline)] transition-all flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold text-[var(--pc-mute)]">
                      {task.id} • {task.type}
                    </span>
                    <span className="text-xs font-bold text-[var(--pc-ink)] mt-0.5">
                      {task.user} ({task.phone})
                    </span>
                  </div>
                  <StatusBadge status={task.status as any} className="scale-90 origin-top-right py-0.5" />
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-[var(--pc-body)] font-medium border-t border-[var(--pc-hairline-soft)] pt-2 mt-0.5">
                  <span>{task.court} • {task.time}</span>
                  <span className="font-bold text-[var(--pc-ink)]">{task.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--pc-hairline-soft)] pt-4 mt-4 shrink-0">
            <Button variant="Secondary" className="w-full text-xs font-semibold">
              Xem tất cả đơn đặt sân
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
