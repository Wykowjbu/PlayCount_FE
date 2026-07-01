"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/playcourt/button";
import { api } from "@/lib/api/client";

export default function OwnerDashboard() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    api.venues.stats()
      .then((response) => setStats(response.data ?? {}))
      .catch((err) => setError(err instanceof Error ? err.message : "Không thể tải thống kê."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const entries = Object.entries(stats ?? {});

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">CourtOwner</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Dashboard/thống kê</h1>
        </div>
        <Button type="button" variant="Secondary" onClick={load} disabled={loading}>
          <RefreshCw className="h-4 w-4" /> Làm mới
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-[8px] border border-[var(--pc-hairline)] bg-white" />)}</div>
      ) : error ? (
        <div className="rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
      ) : entries.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {entries.map(([key, value]) => (
            <div key={key} className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
              <BarChart3 className="h-5 w-5 text-[var(--pc-green-800)]" />
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[var(--pc-mute)]">{key}</p>
              <p className="mt-1 text-2xl font-black text-[var(--pc-ink)]">{String(value ?? 0)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[8px] border border-dashed border-[var(--pc-hairline)] bg-white p-8 text-center text-sm text-[var(--pc-mute)]">Backend chưa trả số liệu dashboard.</div>
      )}

      <div className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[var(--pc-ink)]">Venue của tôi</h2>
            <p className="mt-1 text-sm text-[var(--pc-mute)]">Quản lý venue, ảnh, tiện ích, giờ mở cửa, court, pricing rule và schedule.</p>
          </div>
          <Link className="inline-flex items-center gap-2 rounded-[6px] border border-[#e4d55a] bg-[var(--pc-tennis)]/70 px-4 py-2 text-sm font-semibold text-[var(--pc-green-950)] hover:bg-[var(--pc-tennis)]" href="/owner/venues">
            <MapPin className="h-4 w-4" /> Mở quản lý
          </Link>
        </div>
      </div>
    </section>
  );
}
