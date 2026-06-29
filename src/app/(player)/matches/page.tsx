"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/playcourt/button";
import { StatusBadge } from "@/components/playcourt/status-badge";
import { api, type Match } from "@/lib/api/client";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

function MatchCard({ match }: { match: Match }) {
  return (
    <Link href={`/matches/${match.id}`} className="block rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5 transition hover:shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.12em] text-[var(--pc-mute)]">{match.sportName}</p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--pc-ink)]">{match.venueName || match.locationDescription || "Địa điểm tự chọn"}</h2>
          <p className="mt-2 text-sm text-[var(--pc-body)]">{formatDateTime(match.startAt)} - {formatDateTime(match.endAt)}</p>
          <p className="mt-1 text-sm text-[var(--pc-mute)]">Host: {match.hostName}</p>
        </div>
        <StatusBadge status={match.status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--pc-body)]">
        <span className="rounded-full bg-[var(--pc-hairline-soft)] px-3 py-1">{match.participantCount}/{match.maxParticipants} người</span>
        <span className="rounded-full bg-[var(--pc-hairline-soft)] px-3 py-1">Còn {match.availableSlots} chỗ</span>
        {match.myJoinRequestStatus && <span className="rounded-full bg-[var(--pc-warning-soft)] px-3 py-1">Yêu cầu: {match.myJoinRequestStatus}</span>}
      </div>
    </Link>
  );
}

export default function MatchesPage() {
  const [tab, setTab] = useState<"search" | "recommended">("search");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);

  const searchQuery = useQuery({
    queryKey: ["matches", "search", page, location],
    queryFn: () => api.matches.search({ PageIndex: page, PageSize: 10, Location: location.trim() || undefined, IncludeFull: true }),
    enabled: tab === "search",
  });

  const recommendedQuery = useQuery({
    queryKey: ["matches", "recommended"],
    queryFn: () => api.matches.recommended(20),
    enabled: tab === "recommended",
  });

  const matches = tab === "recommended" ? recommendedQuery.data?.data ?? [] : searchQuery.data?.data ?? [];
  const isLoading = tab === "recommended" ? recommendedQuery.isLoading : searchQuery.isLoading;
  const error = tab === "recommended" ? recommendedQuery.error : searchQuery.error;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Matchmaking</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Tìm trận đấu</h1>
        </div>
        <Link className="inline-flex rounded-[6px] bg-[var(--pc-green-800)] px-4 py-2 text-sm font-semibold text-white" href="/matches/create">
          Tạo trận
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button type="button" variant={tab === "search" ? "AppPrimary" : "Secondary"} onClick={() => setTab("search")}>Tìm kiếm</Button>
        <Button type="button" variant={tab === "recommended" ? "AppPrimary" : "Secondary"} onClick={() => setTab("recommended")}>Đề xuất</Button>
      </div>

      {tab === "search" && (
        <form
          className="mt-5 grid gap-3 rounded-[8px] border border-[var(--pc-hairline)] bg-white p-4 sm:grid-cols-[1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            searchQuery.refetch();
          }}
        >
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Quận, venue hoặc mô tả địa điểm"
            className="h-10 rounded-[6px] border border-[var(--pc-hairline)] px-3 text-sm outline-none focus:border-[var(--pc-green-700)]"
          />
          <Button type="submit">Lọc</Button>
        </form>
      )}

      {error && (
        <div className="mt-6 rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error.message}
        </div>
      )}

      <div className="mt-6 grid gap-4">
        {isLoading ? (
          <p className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-6 text-center text-sm text-[var(--pc-mute)]">Đang tải trận...</p>
        ) : matches.length ? (
          matches.map((match) => <MatchCard key={match.id} match={match} />)
        ) : (
          <p className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-6 text-center text-sm text-[var(--pc-mute)]">Không có trận phù hợp.</p>
        )}
      </div>

      {tab === "search" && searchQuery.data && searchQuery.data.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button type="button" variant="Secondary" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Trước</Button>
          <span className="grid place-items-center px-3 text-sm text-[var(--pc-body)]">{page}/{searchQuery.data.totalPages}</span>
          <Button type="button" variant="Secondary" disabled={page >= searchQuery.data.totalPages} onClick={() => setPage((value) => value + 1)}>Sau</Button>
        </div>
      )}
    </section>
  );
}
