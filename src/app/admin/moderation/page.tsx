"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from "react";
import { Button } from "@/components/playcourt/button";
import { api, type Venue, type VenueStatus } from "@/lib/api/client";

const venueStatus: Record<number, string> = { 0: "Pending", 1: "Approved", 2: "Rejected", 3: "Suspended" };

export default function ModerationPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [target, setTarget] = useState<Venue | null>(null);
  const [nextStatus, setNextStatus] = useState<VenueStatus>(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.venues.admin()
      .then((response) => setVenues(response.data ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : "Không thể tải venue moderation."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const changeStatus = async () => {
    if (!target) return;
    setSaving(true);
    setError("");
    try {
      await api.venues.status(target.id, nextStatus);
      setTarget(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đổi trạng thái venue.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Kiểm duyệt venue</h1>
      </div>
      {error && <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      <div className="overflow-hidden rounded-[8px] border border-[var(--pc-hairline)] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--pc-hairline-soft)] text-[var(--pc-mute)]">
            <tr><th className="p-4">Venue</th><th>Địa chỉ</th><th>Trạng thái</th><th /></tr>
          </thead>
          <tbody>
            {loading ? <tr><td className="p-4" colSpan={4}>Đang tải...</td></tr> : venues.length ? venues.map((venue) => (
              <tr key={venue.id} className="border-t border-[var(--pc-hairline)]">
                <td className="p-4 font-medium text-[var(--pc-ink)]">{venue.name}</td>
                <td>{venue.address || "--"}</td>
                <td>{venueStatus[Number(venue.status ?? 0)]}</td>
                <td className="p-3 text-right"><Button type="button" variant="Secondary" onClick={() => { setTarget(venue); setNextStatus(Number(venue.status ?? 1) as VenueStatus); }}>Đổi trạng thái</Button></td>
              </tr>
            )) : <tr><td className="p-4 text-[var(--pc-mute)]" colSpan={4}>Không có venue cần duyệt.</td></tr>}
          </tbody>
        </table>
      </div>
      {target && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-[8px] bg-white p-6">
            <h2 className="text-lg font-bold text-[var(--pc-ink)]">{target.name}</h2>
            <p className="mt-2 text-sm text-[var(--pc-body)]">{target.address}</p>
            <label className="mt-4 block text-sm font-semibold">Trạng thái mới<select value={nextStatus} onChange={(e) => setNextStatus(Number(e.target.value) as VenueStatus)} className="mt-2 h-[38px] w-full rounded-[6px] border border-[var(--pc-hairline)] px-3">
              <option value={0}>Pending</option>
              <option value={1}>Approved</option>
              <option value={2}>Rejected</option>
              <option value={3}>Suspended</option>
            </select></label>
            <div className="mt-5 flex justify-end gap-2"><Button type="button" variant="Secondary" onClick={() => setTarget(null)}>Hủy</Button><Button type="button" disabled={saving} onClick={changeStatus}>Xác nhận</Button></div>
          </div>
        </div>
      )}
    </section>
  );
}
