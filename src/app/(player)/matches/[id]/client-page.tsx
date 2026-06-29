"use client";

import { use } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/playcourt/button";
import { StatusBadge } from "@/components/playcourt/status-badge";
import { api } from "@/lib/api/client";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

export default function MatchDetailPage({ params }: MatchDetailPageProps) {
  const { id } = use(params);
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ["matches", id],
    queryFn: async () => {
      const response = await api.matches.detail(id);
      if (!response.data) throw new Error(response.message || "Không thể tải trận.");
      return response.data;
    },
  });

  const joinRequestsQuery = useQuery({
    queryKey: ["matches", id, "join-requests"],
    queryFn: async () => {
      const response = await api.matches.joinRequests(id);
      return response.data ?? [];
    },
    enabled: !!detailQuery.data?.match.isHost,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["matches", id] });
    queryClient.invalidateQueries({ queryKey: ["matches", id, "join-requests"] });
    queryClient.invalidateQueries({ queryKey: ["matches"] });
  };

  const requestMutation = useMutation({ mutationFn: () => api.matches.requestToJoin(id), onSuccess: invalidate });
  const cancelRequestMutation = useMutation({ mutationFn: () => api.matches.cancelJoinRequest(id), onSuccess: invalidate });
  const leaveMutation = useMutation({ mutationFn: () => api.matches.leave(id), onSuccess: invalidate });
  const cancelMatchMutation = useMutation({ mutationFn: () => api.matches.cancel(id), onSuccess: invalidate });
  const respondMutation = useMutation({
    mutationFn: ({ requestId, status }: { requestId: number; status: "Approved" | "Rejected" }) =>
      api.matches.respondJoinRequest(id, requestId, status),
    onSuccess: invalidate,
  });

  if (detailQuery.isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-[var(--pc-mute)]">Đang tải trận...</div>;
  }

  if (detailQuery.isError) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-[var(--pc-ink)]">Không thể tải trận</h1>
        <p className="mt-3 text-sm text-[var(--pc-mute)]">{detailQuery.error.message}</p>
        <Button type="button" className="mt-5" onClick={() => detailQuery.refetch()}>Thử lại</Button>
      </section>
    );
  }

  const detail = detailQuery.data;
  if (!detail) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-[var(--pc-mute)]">Không tìm thấy trận.</div>;
  }
  const { match, participants } = detail;
  const pendingJoin = match.myJoinRequestStatus?.toLowerCase() === "pending";
  const canRequest = !match.isHost && !match.isParticipant && !pendingJoin && match.availableSlots > 0;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Open match</p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--pc-ink)]">{match.sportName}</h1>
          <p className="mt-2 text-sm text-[var(--pc-body)]">{match.venueName || match.locationDescription || "Địa điểm tự chọn"}</p>
        </div>
        <StatusBadge status={match.status} />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1fr_320px]">
        <article className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-6">
          <h2 className="font-semibold text-[var(--pc-ink)]">Thông tin trận</h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--pc-mute)]">Thời gian</dt>
              <dd className="mt-1 font-semibold text-[var(--pc-ink)]">{formatDateTime(match.startAt)} - {formatDateTime(match.endAt)}</dd>
            </div>
            <div>
              <dt className="text-[var(--pc-mute)]">Host</dt>
              <dd className="mt-1 font-semibold text-[var(--pc-ink)]">{match.hostName}</dd>
            </div>
            <div>
              <dt className="text-[var(--pc-mute)]">Trình độ</dt>
              <dd className="mt-1 font-semibold text-[var(--pc-ink)]">{match.requiredSkillLevelMin ?? "-"} - {match.requiredSkillLevelMax ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-[var(--pc-mute)]">Số người</dt>
              <dd className="mt-1 font-semibold text-[var(--pc-ink)]">{match.participantCount}/{match.maxParticipants}</dd>
            </div>
          </dl>
          {match.costDescription && <p className="mt-4 rounded-[6px] bg-[var(--pc-hairline-soft)] p-3 text-sm">Chi phí: {match.costDescription}</p>}
          {match.description && <p className="mt-4 text-sm leading-6 text-[var(--pc-body)]">{match.description}</p>}
        </article>

        <aside className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-6">
          <h2 className="font-semibold text-[var(--pc-ink)]">Người tham gia</h2>
          <div className="mt-3 space-y-2 text-sm text-[var(--pc-body)]">
            {participants.map((participant) => (
              <div key={participant.profileId} className="flex justify-between rounded-[6px] bg-[var(--pc-hairline-soft)] px-3 py-2">
                <span>{participant.fullName}</span>
                <span className="text-[var(--pc-mute)]">{participant.isHost ? "Host" : participant.skillLevel}</span>
              </div>
            ))}
          </div>

          {canRequest && <Button className="mt-5 w-full" onClick={() => requestMutation.mutate()} disabled={requestMutation.isPending}>Yêu cầu tham gia</Button>}
          {pendingJoin && <Button variant="Secondary" className="mt-5 w-full" onClick={() => cancelRequestMutation.mutate()} disabled={cancelRequestMutation.isPending}>Hủy yêu cầu</Button>}
          {match.isParticipant && !match.isHost && <Button variant="Danger" className="mt-5 w-full" onClick={() => leaveMutation.mutate()} disabled={leaveMutation.isPending}>Rời trận</Button>}
          {match.isHost && <Button variant="Danger" className="mt-5 w-full" onClick={() => window.confirm("Hủy trận này?") && cancelMatchMutation.mutate()} disabled={cancelMatchMutation.isPending}>Hủy trận</Button>}
        </aside>
      </div>

      {match.isHost && (
        <section className="mt-6 rounded-[8px] border border-[var(--pc-hairline)] bg-white p-6">
          <h2 className="font-semibold text-[var(--pc-ink)]">Yêu cầu tham gia</h2>
          {joinRequestsQuery.isLoading ? (
            <p className="mt-3 text-sm text-[var(--pc-mute)]">Đang tải...</p>
          ) : joinRequestsQuery.data?.length ? (
            <div className="mt-4 grid gap-3">
              {joinRequestsQuery.data.map((request) => (
                <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-[var(--pc-hairline)] p-3 text-sm">
                  <div>
                    <p className="font-semibold text-[var(--pc-ink)]">{request.playerName}</p>
                    <p className="text-[var(--pc-mute)]">Trình độ {request.skillLevel ?? "-"} · {request.status}</p>
                  </div>
                  {request.status.toLowerCase() === "pending" && (
                    <div className="flex gap-2">
                      <Button type="button" onClick={() => respondMutation.mutate({ requestId: request.id, status: "Approved" })} disabled={respondMutation.isPending}>Duyệt</Button>
                      <Button type="button" variant="Danger" onClick={() => respondMutation.mutate({ requestId: request.id, status: "Rejected" })} disabled={respondMutation.isPending}>Từ chối</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[var(--pc-mute)]">Chưa có yêu cầu.</p>
          )}
        </section>
      )}
    </section>
  );
}
