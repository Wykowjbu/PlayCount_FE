"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { PlayerHeader } from "./player-header";
import { PlayerMobileNav } from "./player-mobile-nav";
import { OwnerSidebar } from "./owner-sidebar";
import { authService } from "@/lib/auth";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname() || "";
  const router = useRouter();

  React.useEffect(() => {
    const user = authService.getCurrentUser();
    const guestRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
    const playerRoute =
      pathname.startsWith("/profile") ||
      pathname.startsWith("/bookings") ||
      pathname.startsWith("/matches");
    const protectedRoute = pathname.startsWith("/owner") || pathname.startsWith("/admin") || playerRoute;

    if (guestRoute && authService.isAuthenticated()) {
      if (user?.role === "Admin") router.replace("/admin/kyc");
      else if (user?.role === "CourtOwner") router.replace("/owner/dashboard");
      else router.replace("/profile");
      return;
    }

    if (!protectedRoute) return;
    if (!authService.isAuthenticated()) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (pathname.startsWith("/owner") && user?.role !== "CourtOwner") router.push("/403");
    if (pathname.startsWith("/admin") && user?.role !== "Admin") router.push("/403");
    // /profile, /bookings, /matches: ai đăng nhập cũng được (Owner, Admin, Player)
    // Chỉ chặn Guest — đã xử lý ở dòng 35-38
  }, [pathname, router]);
  
  // Check if current route is owner or admin panel
  const isProLayout = pathname.startsWith("/owner") || pathname.startsWith("/admin");

  if (isProLayout) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[var(--pc-canvas)]">
        {/* Pro Layout: Sidebar on Desktop */}
        <OwnerSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  // Player/Public Layout
  return (
    <div className="flex flex-col min-h-screen bg-[var(--pc-canvas)] text-[var(--pc-body)]">
      {/* Top Header */}
      <PlayerHeader />
      
      {/* Main Content Area - adding padding bottom on mobile for navigation bar height */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      
      {/* Bottom Navigation for Mobile */}
      <PlayerMobileNav />
    </div>
  );
}
