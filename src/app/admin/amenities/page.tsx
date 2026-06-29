"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from "react";
import { Button } from "@/components/playcourt/button";
import { Input } from "@/components/playcourt/input";
import { api, type Amenity } from "@/lib/api/client";

export default function AdminAmenitiesPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [form, setForm] = useState({ id: 0, name: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => {
    setLoading(true);
    api.amenities.list().then((response) => setAmenities(response.data ?? [])).catch((err) => setError(err instanceof Error ? err.message : "Không thể tải amenities.")).finally(() => setLoading(false));
  };
  useEffect(load, []);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.id) await api.amenities.update(form.id, { name: form.name.trim() });
    else await api.amenities.create({ name: form.name.trim() });
    setForm({ id: 0, name: "" });
    load();
  };
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-8">
      <h1 className="text-3xl font-semibold text-[var(--pc-ink)]">Quản lý tiện ích</h1>
      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      <form onSubmit={submit} className="grid gap-3 rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5 md:grid-cols-[1fr_auto]">
        <Input required label="Tên tiện ích" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Button className="self-end" type="submit">{form.id ? "Cập nhật" : "Tạo"}</Button>
      </form>
      <div className="rounded-[8px] border border-[var(--pc-hairline)] bg-white">
        {loading ? <p className="p-4">Đang tải...</p> : amenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center justify-between border-t border-[var(--pc-hairline)] p-4 first:border-t-0">
            <span className="font-semibold">{amenity.name}</span>
            <div className="flex gap-2"><Button variant="Secondary" type="button" onClick={() => setForm({ id: amenity.id, name: amenity.name })}>Sửa</Button><Button variant="Danger" type="button" onClick={async () => { if (confirm("Xóa tiện ích?")) { await api.amenities.delete(amenity.id); load(); } }}>Xóa</Button></div>
          </div>
        ))}
      </div>
    </section>
  );
}
