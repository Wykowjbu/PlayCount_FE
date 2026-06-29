"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/playcourt/button";
import { Input } from "@/components/playcourt/input";
import { api } from "@/lib/api/client";

export default function CreateMatchPage() {
  const router = useRouter();
  const sportsQuery = useQuery({
    queryKey: ["sports", "active"],
    queryFn: () => api.sports.list(true),
  });
  const [form, setForm] = useState({
    sportId: "",
    courtId: "",
    locationDescription: "",
    startAt: "",
    endAt: "",
    requiredSkillLevelMin: "0",
    requiredSkillLevelMax: "2",
    maxParticipants: "4",
    costDescription: "",
    description: "",
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const startAt = new Date(form.startAt);
    const endAt = new Date(form.endAt);
    if (!form.sportId) {
      setError("Vui lòng chọn môn thể thao.");
      return;
    }
    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || endAt <= startAt) {
      setError("Thời gian trận không hợp lệ.");
      return;
    }
    if (Number(form.requiredSkillLevelMin) > Number(form.requiredSkillLevelMax)) {
      setError("Khoảng trình độ không hợp lệ.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.matches.create({
        sportId: Number(form.sportId),
        courtId: form.courtId ? Number(form.courtId) : null,
        locationDescription: form.locationDescription.trim() || null,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        requiredSkillLevelMin: Number(form.requiredSkillLevelMin),
        requiredSkillLevelMax: Number(form.requiredSkillLevelMax),
        maxParticipants: Number(form.maxParticipants),
        costDescription: form.costDescription.trim() || null,
        description: form.description.trim() || null,
      });
      if (!response.data) throw new Error(response.message || "Không thể tạo trận.");
      router.push(`/matches/${response.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo trận.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Create match</p>
      <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Tạo trận đấu</h1>

      {error && <div className="mt-5 rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      <form onSubmit={submit} className="mt-6 grid gap-5 rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--pc-body)]">
          Môn thể thao
          <select
            required
            value={form.sportId}
            onChange={(event) => setForm({ ...form, sportId: event.target.value })}
            className="h-10 rounded-[6px] border border-[var(--pc-hairline)] bg-white px-3 text-sm"
          >
            <option value="">Chọn môn</option>
            {(sportsQuery.data?.data ?? []).map((sport) => (
              <option key={sport.id} value={sport.id}>{sport.name}</option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Court ID (nếu có)" type="number" min={1} value={form.courtId} onChange={(event) => setForm({ ...form, courtId: event.target.value })} />
          <Input required label="Số người tối đa" type="number" min={2} max={100} value={form.maxParticipants} onChange={(event) => setForm({ ...form, maxParticipants: event.target.value })} />
          <Input required label="Bắt đầu" type="datetime-local" value={form.startAt} onChange={(event) => setForm({ ...form, startAt: event.target.value })} />
          <Input required label="Kết thúc" type="datetime-local" value={form.endAt} onChange={(event) => setForm({ ...form, endAt: event.target.value })} />
          <Input label="Trình độ thấp nhất" type="number" min={0} max={2} value={form.requiredSkillLevelMin} onChange={(event) => setForm({ ...form, requiredSkillLevelMin: event.target.value })} />
          <Input label="Trình độ cao nhất" type="number" min={0} max={2} value={form.requiredSkillLevelMax} onChange={(event) => setForm({ ...form, requiredSkillLevelMax: event.target.value })} />
        </div>

        <Input label="Địa điểm mô tả" maxLength={500} value={form.locationDescription} onChange={(event) => setForm({ ...form, locationDescription: event.target.value })} />
        <Input label="Chi phí" maxLength={500} value={form.costDescription} onChange={(event) => setForm({ ...form, costDescription: event.target.value })} />
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--pc-body)]">
          Mô tả
          <textarea value={form.description} maxLength={2000} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-28 rounded-[6px] border border-[var(--pc-hairline)] p-3 text-sm" />
        </label>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang tạo..." : "Tạo trận"}</Button>
          <Link className="inline-flex rounded-[6px] border border-[var(--pc-hairline)] px-4 py-2 text-sm font-semibold" href="/matches">Quay lại</Link>
        </div>
      </form>
    </section>
  );
}
