"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from "react";
import { Button } from "@/components/playcourt/button";
import { api, type CourtOwner, type CourtOwnerVerificationStatus } from "@/lib/api/client";

const statusText: Record<number, string> = { 0: "Pending", 1: "Approved", 2: "Rejected" };

export default function AdminKycPage() {
  const [owners, setOwners] = useState<CourtOwner[]>([]);
  const [status, setStatus] = useState<string>("");
  const [target, setTarget] = useState<CourtOwner | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    api.courtOwners.list(status === "" ? undefined : Number(status) as CourtOwnerVerificationStatus)
      .then((response) => setOwners(response.data ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : "Không thể tải danh sách chủ sân."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status]);

  const updateStatus = async (owner: CourtOwner, nextStatus: CourtOwnerVerificationStatus) => {
    if (nextStatus === 2 && !reason.trim()) {
      setError("Từ chối cần nhập lý do.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.courtOwners.updateStatus(owner.id, { verificationStatus: nextStatus, rejectionReason: nextStatus === 2 ? reason.trim() : null });
      setTarget(null);
      setReason("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật trạng thái.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Duyệt chủ sân</h1>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-[38px] rounded-[6px] border border-[var(--pc-hairline)] bg-white px-3 text-sm">
          <option value="">Tất cả trạng thái</option>
          <option value="0">Pending</option>
          <option value="1">Approved</option>
          <option value="2">Rejected</option>
        </select>
      </div>
      {error && <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      <div className="overflow-hidden rounded-[8px] border border-[var(--pc-hairline)] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--pc-hairline-soft)] text-[var(--pc-mute)]">
            <tr><th className="p-4">Chủ sân</th><th>Doanh nghiệp</th><th>Email</th><th>Trạng thái</th><th /></tr>
          </thead>
          <tbody>
            {loading ? <tr><td className="p-4" colSpan={5}>Đang tải...</td></tr> : owners.length ? owners.map((owner) => (
              <tr key={owner.id} className="border-t border-[var(--pc-hairline)]">
                <td className="p-4 font-medium text-[var(--pc-ink)]">{owner.fullName || owner.userId || owner.id}</td>
                <td>{owner.businessName || "--"}</td>
                <td>{owner.email || "--"}</td>
                <td>{statusText[owner.verificationStatus ?? 0]}</td>
                <td className="p-3 text-right"><Button type="button" variant="Secondary" onClick={() => setTarget(owner)}>Xem/Duyệt</Button></td>
              </tr>
            )) : <tr><td className="p-4 text-[var(--pc-mute)]" colSpan={5}>Không có chủ sân phù hợp.</td></tr>}
          </tbody>
        </table>
      </div>

      {target && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-[8px] bg-white p-6">
            <h2 className="text-lg font-bold text-[var(--pc-ink)]">Chi tiết chủ sân</h2>
            <dl className="mt-4 grid gap-2 text-sm">
              <div><dt className="font-semibold">Tên</dt><dd>{target.fullName || "--"}</dd></div>
              <div><dt className="font-semibold">Email</dt><dd>{target.email || "--"}</dd></div>
              <div><dt className="font-semibold">Doanh nghiệp</dt><dd>{target.businessName || "--"}</dd></div>
              <div><dt className="font-semibold">Trạng thái</dt><dd>{statusText[target.verificationStatus ?? 0]}</dd></div>
            </dl>
            <label className="mt-4 block text-sm font-semibold">Lý do từ chối<textarea className="mt-2 w-full rounded-[6px] border border-[var(--pc-hairline)] p-2" value={reason} onChange={(e) => setReason(e.target.value)} /></label>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="Secondary" onClick={() => setTarget(null)}>Đóng</Button>
              <Button type="button" disabled={saving} onClick={() => updateStatus(target, 1)}>Duyệt</Button>
              <Button type="button" variant="Danger" disabled={saving} onClick={() => updateStatus(target, 2)}>Từ chối</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
