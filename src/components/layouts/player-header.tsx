"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, User, Settings, LogOut, LayoutDashboard } from "lucide-react";

export function PlayerHeader() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks = [
    { name: "Tìm sân", href: "/courts" },
    { name: "Tìm trận", href: "/matches" },
    { name: "Booking", href: "/bookings" },
  ];

  const notifications = [
    { id: 1, text: "Yêu cầu đặt sân #1204 của bạn đã được xác nhận.", time: "5 phút trước", unread: true },
    { id: 2, text: "Có trận đấu mới phù hợp với trình độ của bạn tại sân Bình Vị.", time: "1 giờ trước", unread: false },
    { id: 3, text: "Ưu đãi 20% đặt sân giờ vàng từ 14:00 - 17:00 ngày mai.", time: "5 giờ trước", unread: false },
  ];

  return (
    <header data-testid="player-header" className="sticky top-0 z-50 h-16 w-full border-b border-[var(--pc-hairline)] bg-[var(--pc-canvas)]/92 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-1.5 font-sans text-xl font-semibold tracking-tight text-[var(--pc-ink)]">
            <span>PlayCourt</span>
            <span className="h-2 w-2 rounded-full bg-[var(--pc-tennis)]" aria-hidden="true" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-5 text-sm font-medium transition-colors hover:text-[var(--pc-ink)] ${
                    isActive ? "text-[var(--pc-ink)]" : "text-[var(--pc-mute)]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[var(--pc-green-800)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          
          {/* Search Button */}
          <button 
            type="button" 
            className="rounded-full p-2 text-[var(--pc-mute)] hover:bg-[var(--pc-hairline-soft)] hover:text-[var(--pc-ink)] transition-colors"
            aria-label="Tìm kiếm"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative rounded-full p-2 text-[var(--pc-mute)] hover:bg-[var(--pc-hairline-soft)] hover:text-[var(--pc-ink)] transition-colors"
              aria-label="Thông báo"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--pc-error)]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[var(--pc-hairline)] bg-[var(--pc-surface)] p-2 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-[var(--pc-hairline)] px-3 py-2">
                  <span className="text-sm font-semibold text-[var(--pc-ink)]">Thông báo mới</span>
                  <button type="button" className="text-xs text-[var(--pc-green-700)] hover:underline">Đánh dấu đã đọc</button>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`flex flex-col gap-1 rounded-lg px-3 py-2 text-xs transition-colors hover:bg-[var(--pc-hairline-soft)] ${
                        notif.unread ? "bg-[var(--pc-green-50)]/50" : ""
                      }`}
                    >
                      <p className="font-medium text-[var(--pc-ink)]">{notif.text}</p>
                      <span className="text-[10px] text-[var(--pc-mute)]">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center justify-center h-9 w-9 rounded-full border border-[var(--pc-hairline)] bg-[var(--pc-hairline-soft)] hover:ring-2 hover:ring-[var(--pc-green-200)] transition-all overflow-hidden"
              aria-label="Menu tài khoản"
            >
              <div className="text-xs font-semibold text-[var(--pc-ink)]">PC</div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--pc-hairline)] bg-[var(--pc-surface)] p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2.5 border-b border-[var(--pc-hairline)]">
                  <p className="text-xs font-medium text-[var(--pc-mute)]">Tài khoản</p>
                  <p className="text-sm font-semibold text-[var(--pc-ink)] truncate">Nguyễn Văn A</p>
                </div>
                <div className="py-1">
                  <Link 
                    href="/owner"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <LayoutDashboard className="h-4 w-4 text-[var(--pc-mute)]" />
                    <span>Quản lý sân (Owner)</span>
                  </Link>
                  <Link 
                    href="/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User className="h-4 w-4 text-[var(--pc-mute)]" />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                  <Link 
                    href="/settings"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="h-4 w-4 text-[var(--pc-mute)]" />
                    <span>Cài đặt</span>
                  </Link>
                </div>
                <div className="border-t border-[var(--pc-hairline)] pt-1 mt-1">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--pc-error)] hover:bg-[var(--pc-error-deep)]/5 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
