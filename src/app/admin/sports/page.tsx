"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from "react";
import { Button } from "@/components/playcourt/button";
import { Input } from "@/components/playcourt/input";
import { api, type Sport } from "@/lib/api/client";

export default function AdminSportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [form, setForm] = useState({ id: 0, code: "", name: "", description: "", playerCount: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.sports.list().then((response) => setSports(response.data ?? [])).catch((err) => setError(err instanceof Error ? err.message : "Không thể tải sports.")).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const payload = { code: form.code.trim(), name: form.name.trim(), description: form.description || null, playerCount: form.playerCount ? Number(form.playerCount) : null };
      if (form.id) await api.sports.update(form.id, { ...payload, isActive: true });
      else await api.sports.create(payload);
      setForm({ id: 0, code: "", name: "", description: "", playerCount: "" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu sport.");
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <h1 className="text-3xl font-semibold text-[var(--pc-ink)]">Quản lý môn thể thao</h1>
      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      <form onSubmit={submit} className="grid gap-3 rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5 md:grid-cols-5">
        <Input required label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <Input required label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Input label="Player count" type="number" value={form.playerCount} onChange={(e) => setForm({ ...form, playerCount: e.target.value })} />
        <Button className="self-end" type="submit">{form.id ? "Cập nhật" : "Tạo"}</Button>
      </form>
      <div className="rounded-[8px] border border-[var(--pc-hairline)] bg-white">
        {loading ? <p className="p-4">Đang tải...</p> : sports.map((sport) => (
          <div key={sport.id} className="flex items-center justify-between border-t border-[var(--pc-hairline)] p-4 first:border-t-0">
            <div><p className="font-semibold">{sport.name}</p><p className="text-xs text-[var(--pc-mute)]">{sport.code} · {sport.isActive ? "Active" : "Inactive"}</p></div>
            <div className="flex gap-2"><Button variant="Secondary" type="button" onClick={() => setForm({ id: sport.id, code: sport.code ?? "", name: sport.name, description: sport.description ?? "", playerCount: sport.playerCount == null ? "" : String(sport.playerCount) })}>Sửa</Button><Button variant="Secondary" type="button" onClick={async () => { try { await api.sports.toggle(sport.id); load(); } catch (err) { setError(err instanceof Error ? err.message : "Không thể toggle sport."); } }}>Bật/tắt</Button></div>
          </div>
        ))}
      </div>
    </section>
  );
}
