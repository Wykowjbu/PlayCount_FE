"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Trophy, User, CalendarPlus, Swords, X } from "lucide-react";

export function PlayerMobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Sân", href: "/courts", icon: MapPin },
    { name: "Trận", href: "/matches", icon: Trophy },
    { name: "Tôi", href: "/profile", icon: User },
  ];

  return (
    <>
      <nav data-testid="player-mobile-nav" className="fixed bottom-0 left-0 right-0 z-40 h-16 w-full border-t border-[var(--pc-hairline)] bg-[var(--pc-surface)] px-2 md:hidden">
        <div className="mx-auto flex h-full max-w-lg items-center justify-around">
          {/* Tab 1 & Tab 2 */}
          {tabs.slice(0, 2).map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center w-12 h-full gap-0.5 text-[10px] font-medium transition-colors ${
                  isActive ? "text-[var(--pc-green-800)]" : "text-[var(--pc-mute)]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </Link>
            );
          })}

          {/* Central "+" Action Button */}
          <div className="relative -mt-6">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pc-green-800)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              aria-label="+"
            >
              <span className="text-2xl font-light leading-none">+</span>
            </button>
          </div>

          {/* Tab 3 & Tab 4 */}
          {tabs.slice(2).map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center w-12 h-full gap-0.5 text-[10px] font-medium transition-colors ${
                  isActive ? "text-[var(--pc-green-800)]" : "text-[var(--pc-mute)]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Action Sheet Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Sheet Panel */}
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-[var(--pc-surface)] p-6 pb-8 shadow-2xl transition-transform duration-300 translate-y-0 border-t border-[var(--pc-hairline)]">
            <div className="flex items-center justify-between border-b border-[var(--pc-hairline)] pb-4">
              <h3 className="text-base font-semibold text-[var(--pc-ink)]">Tạo mới nhanh</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-[var(--pc-mute)] hover:bg-[var(--pc-hairline-soft)] hover:text-[var(--pc-ink)]"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* Option 1: Đặt sân nhanh */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--pc-hairline)] bg-[var(--pc-canvas)] p-5 text-center transition-all hover:border-[var(--pc-green-200)] hover:bg-[var(--pc-green-50)]/30 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--pc-green-100)] text-[var(--pc-green-800)] transition-transform group-hover:scale-110">
                  <CalendarPlus className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-[var(--pc-ink)]">Đặt sân nhanh</span>
                  <span className="block mt-0.5 text-[11px] text-[var(--pc-mute)]">Giữ sân trong 60s</span>
                </div>
              </button>

              {/* Option 2: Tạo trận đấu */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--pc-hairline)] bg-[var(--pc-canvas)] p-5 text-center transition-all hover:border-[var(--pc-green-200)] hover:bg-[var(--pc-green-50)]/30 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--pc-tennis-soft)] text-[var(--pc-ink)] transition-transform group-hover:scale-110">
                  <Swords className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-[var(--pc-ink)]">Tạo trận đấu</span>
                  <span className="block mt-0.5 text-[11px] text-[var(--pc-mute)]">Tìm đối ghép kèo nhanh</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
