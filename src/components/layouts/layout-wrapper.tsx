"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { PlayerHeader } from "./player-header";
import { PlayerMobileNav } from "./player-mobile-nav";
import { OwnerSidebar } from "./owner-sidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname() || "";
  
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
