"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Trophy, 
  CreditCard, 
  BarChart, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  MapPin,
  Home
} from "lucide-react";

export function OwnerSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState("venue-1");

  const venues = [
    { id: "venue-1", name: "Sân Tennis Bình Vị" },
    { id: "venue-2", name: "Sân Tennis Kỳ Hòa" },
    { id: "venue-3", name: "Pickleball Hoàng Hoa Thám" },
  ];

  const menuItems = [
    { name: "Tổng quan", href: "/owner", icon: LayoutDashboard },
    { name: "Lịch đặt", href: "/owner/calendar", icon: Calendar },
    { name: "Danh sách sân", href: "/owner/courts", icon: Trophy },
    { name: "Đơn đặt sân", href: "/owner/bookings", icon: CreditCard },
    { name: "Doanh thu", href: "/owner/revenue", icon: BarChart },
    { name: "Cấu hình", href: "/owner/settings", icon: Settings },
  ];

  return (
    <aside 
      data-testid="owner-sidebar"
      className={`relative hidden md:flex flex-col h-screen border-r border-[var(--pc-hairline)] bg-[var(--pc-surface)] transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[248px]"
      }`}
    >
      {/* Upper Area: Venue Selector / Logo */}
      <div className="flex flex-col gap-4 p-4 border-b border-[var(--pc-hairline)]">
        
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--pc-hairline)] bg-[var(--pc-surface)] text-[var(--pc-mute)] hover:text-[var(--pc-ink)] shadow-xs transition-transform cursor-pointer"
          aria-label={isCollapsed ? "Mở rộng" : "Thu nhỏ"}
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        {/* Venue Selector */}
        <div className="flex flex-col gap-1">
          {isCollapsed ? (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-[var(--pc-green-50)] text-[var(--pc-green-800)]" title="Chọn địa điểm">
              <Home className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="venue-select" className="flex items-center gap-1.5 text-xs font-semibold text-[var(--pc-mute)] uppercase tracking-wider font-mono">
                <MapPin className="h-3.5 w-3.5 text-[var(--pc-green-700)]" />
                <span>Địa điểm quản lý</span>
              </label>
              <div className="relative">
                <select
                  id="venue-select"
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full appearance-none rounded-md border border-[var(--pc-hairline)] bg-[var(--pc-canvas)] py-2 pl-3 pr-8 text-sm font-medium text-[var(--pc-ink)] focus:outline-hidden focus:ring-1 focus:ring-[var(--pc-green-700)] transition-all cursor-pointer"
                >
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-[var(--pc-mute)]">
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md py-2.5 px-3 text-sm font-medium transition-all group ${
                isActive 
                  ? "border-l-2 border-[var(--pc-green-700)] bg-[var(--pc-green-50)] text-[var(--pc-ink)]" 
                  : "text-[var(--pc-mute)] hover:bg-[var(--pc-hairline-soft)] hover:text-[var(--pc-ink)]"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 transition-colors ${
                isActive ? "text-[var(--pc-green-700)]" : "text-[var(--pc-mute)] group-hover:text-[var(--pc-ink)]"
              }`} />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[var(--pc-hairline)]">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[var(--pc-green-800)] text-white flex items-center justify-center font-bold text-xs font-mono">
              PC
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-[var(--pc-ink)] leading-none">PlayCourt Pro</p>
              <span className="text-[10px] text-[var(--pc-mute)] font-mono">Owner Dashboard</span>
            </div>
          </div>
        ) : (
          <div className="mx-auto h-8 w-8 rounded-full bg-[var(--pc-green-800)] text-white flex items-center justify-center font-bold text-xs font-mono" title="PlayCourt Pro">
            PC
          </div>
        )}
      </div>

    </aside>
  );
}
