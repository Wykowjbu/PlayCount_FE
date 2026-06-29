"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, User, Settings, LogOut, LayoutDashboard } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useAuth } from "@/contexts/auth-context";

export function PlayerHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Tìm sân", href: "/venues" },
    { name: "Tìm trận", href: "/matches" },
    { name: "Booking", href: "/bookings" },
  ];

  const notifications = [
    { id: 1, text: "Yêu cầu đặt sân #1204 của bạn đã được xác nhận.", time: "5 phút trước", unread: true },
    { id: 2, text: "Có trận đấu mới phù hợp với trình độ của bạn tại sân Bình Vị.", time: "1 giờ trước", unread: false },
    { id: 3, text: "Ưu đãi 20% đặt sân giờ vàng từ 14:00 - 17:00 ngày mai.", time: "5 giờ trước", unread: false },
  ];

  return (
    <Tooltip.Provider>
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
                      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[var(--pc-tennis)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            
            {/* Search Button */}
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button 
                  type="button" 
                  className="rounded-full p-2 text-[var(--pc-mute)] hover:bg-[var(--pc-hairline-soft)] hover:text-[var(--pc-ink)] transition-colors cursor-pointer"
                  aria-label="Tìm kiếm"
                >
                  <Search className="h-5 w-5" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  sideOffset={4}
                  className="z-50 rounded-md bg-[var(--pc-ink)] px-2.5 py-1.5 text-xs font-mono text-[var(--pc-canvas)] shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-150"
                >
                  Tìm kiếm
                  <Tooltip.Arrow className="fill-[var(--pc-ink)]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            {/* Notifications Popover */}
            <Popover.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Popover.Trigger asChild>
                    <button
                      type="button"
                      className="relative rounded-full p-2 text-[var(--pc-mute)] hover:bg-[var(--pc-hairline-soft)] hover:text-[var(--pc-ink)] transition-colors cursor-pointer"
                      aria-label="Thông báo"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--pc-error)]" />
                    </button>
                  </Popover.Trigger>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    align="center"
                    sideOffset={4}
                    className="z-50 rounded-md bg-[var(--pc-ink)] px-2.5 py-1.5 text-xs font-mono text-[var(--pc-canvas)] shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-150"
                  >
                    Thông báo
                    <Tooltip.Arrow className="fill-[var(--pc-ink)]" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Popover.Portal>
                <Popover.Content
                  align="end"
                  sideOffset={8}
                  className="z-50 w-80 rounded-2xl border border-[var(--pc-hairline)] bg-[var(--pc-surface)] p-2 shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)] ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200 focus:outline-hidden"
                >
                  <div className="flex items-center justify-between border-b border-[var(--pc-hairline)] px-3 py-2">
                    <span className="text-sm font-semibold text-[var(--pc-ink)]">Thông báo mới</span>
                    <button type="button" className="text-xs text-[var(--pc-green-700)] hover:underline">Đánh dấu đã đọc</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`flex flex-col gap-1 rounded-md px-3 py-2 text-xs transition-colors hover:bg-[var(--pc-hairline-soft)] ${
                          notif.unread ? "bg-[var(--pc-green-50)]/50" : ""
                        }`}
                      >
                        <p className="font-medium text-[var(--pc-ink)]">{notif.text}</p>
                        <span className="text-[10px] text-[var(--pc-mute)] font-mono">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {/* Profile Menu Dropdown */}
            <DropdownMenu.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <DropdownMenu.Trigger asChild>
                    <button
                      type="button"
                      className="flex items-center justify-center h-9 w-9 rounded-full border border-[var(--pc-hairline)] bg-[var(--pc-hairline-soft)] hover:ring-2 hover:ring-[var(--pc-green-200)] transition-all overflow-hidden cursor-pointer"
                      aria-label="Menu tài khoản"
                    >
                      <div className="text-xs font-semibold text-[var(--pc-ink)] font-mono">PC</div>
                    </button>
                  </DropdownMenu.Trigger>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    align="center"
                    sideOffset={4}
                    className="z-50 rounded-md bg-[var(--pc-ink)] px-2.5 py-1.5 text-xs font-mono text-[var(--pc-canvas)] shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-150"
                  >
                    Menu tài khoản
                    <Tooltip.Arrow className="fill-[var(--pc-ink)]" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={8}
                  className="z-50 w-56 rounded-2xl border border-[var(--pc-hairline)] bg-[var(--pc-surface)] p-1 shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)] ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200 focus:outline-hidden"
                >
                  <div className="px-3 py-2.5 border-b border-[var(--pc-hairline)]">
                    <p className="text-xs font-medium text-[var(--pc-mute)] font-mono">Tài khoản</p>
                    <p className="text-sm font-semibold text-[var(--pc-ink)] truncate">{user?.fullName || user?.email || "Khách"}</p>
                  </div>
                  <div className="py-1">
                    <DropdownMenu.Item asChild>
                      <Link
                        href={user?.role === "Admin" ? "/admin/kyc" : "/owner/dashboard"}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] transition-colors outline-hidden cursor-pointer"
                      >
                        <LayoutDashboard className="h-4 w-4 text-[var(--pc-mute)]" />
                        <span>{user?.role === "Admin" ? "Admin" : "Quản lý sân"}</span>
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link 
                        href="/profile"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] transition-colors outline-hidden cursor-pointer"
                      >
                        <User className="h-4 w-4 text-[var(--pc-mute)]" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link 
                        href="/settings"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] transition-colors outline-hidden cursor-pointer"
                      >
                        <Settings className="h-4 w-4 text-[var(--pc-mute)]" />
                        <span>Cài đặt</span>
                      </Link>
                    </DropdownMenu.Item>
                  </div>
                  <div className="border-t border-[var(--pc-hairline)] pt-1 mt-1">
                    <DropdownMenu.Item asChild>
                      <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--pc-error)] hover:bg-[var(--pc-error-deep)]/5 transition-colors outline-hidden cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </DropdownMenu.Item>
                  </div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

          </div>

        </div>
      </header>
    </Tooltip.Provider>
  );
}
