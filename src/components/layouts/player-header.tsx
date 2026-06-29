"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, User, LogOut, LayoutDashboard } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useAuth } from "@/contexts/auth-context";

export function PlayerHeader() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  const navLinks = [
    { name: "Tìm sân", href: "/venues" },
    { name: "Tìm trận", href: "/matches" },
    { name: "Booking", href: "/profile" },
  ];

  const dashboardHref =
    user?.role === "Admin" ? "/admin/kyc" : user?.role === "CourtOwner" ? "/owner/dashboard" : null;
  const accountLabel = user?.fullName || user?.email || "PlayCourt";
  const initials = accountLabel
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

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
                    <span className="text-sm font-semibold text-[var(--pc-ink)]">Thông báo</span>
                  </div>
                  <div className="py-6 text-center text-xs text-[var(--pc-mute)]">
                    Backend chưa có Notification API. Không hiển thị badge.
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {isLoading ? (
              <div
                className="h-9 w-24 rounded-[6px] border border-[var(--pc-green-100)] bg-white/70 shadow-sm"
                aria-label="Đang tải tài khoản"
              />
            ) : user ? (
              <DropdownMenu.Root>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <DropdownMenu.Trigger asChild>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--pc-green-100)] bg-white text-[var(--pc-green-900)] shadow-sm transition-all hover:ring-2 hover:ring-[var(--pc-green-200)] cursor-pointer"
                        aria-label="Menu tài khoản"
                      >
                        <div className="font-mono text-xs font-semibold">{initials || "PC"}</div>
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
                      <p className="text-sm font-semibold text-[var(--pc-ink)] truncate">{accountLabel}</p>
                    </div>
                    <div className="py-1">
                      {dashboardHref && (
                        <DropdownMenu.Item asChild>
                          <Link
                            href={dashboardHref}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] transition-colors outline-hidden cursor-pointer"
                          >
                            <LayoutDashboard className="h-4 w-4 text-[var(--pc-mute)]" />
                            <span>{user.role === "Admin" ? "Admin" : "Quản lý sân"}</span>
                          </Link>
                        </DropdownMenu.Item>
                      )}
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] transition-colors outline-hidden cursor-pointer"
                        >
                          <User className="h-4 w-4 text-[var(--pc-mute)]" />
                          <span>Hồ sơ cá nhân</span>
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
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-[6px] border border-[var(--pc-green-100)] bg-white px-3 text-xs font-semibold text-[var(--pc-green-900)] shadow-sm transition-colors hover:bg-[var(--pc-green-50)]"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-9 items-center justify-center rounded-[6px] border border-[#e4d55a] bg-[var(--pc-tennis)] px-3 text-xs font-semibold text-[var(--pc-green-950)] shadow-sm transition-colors hover:bg-[#dff55c]"
                >
                  Đăng ký
                </Link>
              </div>
            )}

          </div>

        </div>
      </header>
    </Tooltip.Provider>
  );
}
