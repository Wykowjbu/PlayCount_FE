"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/playcourt/button";
import { Input } from "@/components/playcourt/input";
import { api, type VenueStaffRole } from "@/lib/api/client";

interface StaffPageProps {
  params: Promise<{ id: string }>;
}

const roleLabels: Record<VenueStaffRole, string> = {
  0: "Manager",
  1: "Receptionist",
  2: "Accountant",
};

export default function VenueStaffPage({ params }: StaffPageProps) {
  const { id: venueId } = use(params);
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<VenueStaffRole>(1);
  const [message, setMessage] = useState("");

  const staffQuery = useQuery({
    queryKey: ["venue-staff", venueId],
    queryFn: async () => {
      const response = await api.venueStaff.list(venueId);
      return response.data ?? [];
    },
  });

  const addMutation = useMutation({
    mutationFn: () => api.venueStaff.add(venueId, { email: email.trim(), role }),
    onSuccess: () => {
      setEmail("");
      setMessage("Đã thêm staff.");
      queryClient.invalidateQueries({ queryKey: ["venue-staff", venueId] });
    },
    onError: (err) => setMessage(err instanceof Error ? err.message : "Không thể thêm staff."),
  });

  const removeMutation = useMutation({
    mutationFn: (staffId: number) => api.venueStaff.remove(venueId, staffId),
    onSuccess: () => {
      setMessage("Đã xóa staff.");
      queryClient.invalidateQueries({ queryKey: ["venue-staff", venueId] });
    },
    onError: (err) => setMessage(err instanceof Error ? err.message : "Không thể xóa staff."),
  });
  const staff = staffQuery.data ?? [];

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8">
      <div>
        <Link href="/owner/venues" className="text-sm font-semibold text-[var(--pc-green-700)] hover:underline">← Venue của tôi</Link>
        <p className="mt-5 font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Venue staff</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Quản lý staff</h1>
      </div>

      {message && <div className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-3 text-sm text-[var(--pc-body)]">{message}</div>}

      <form
        className="grid gap-4 rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5 md:grid-cols-[1fr_180px_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          setMessage("");
          addMutation.mutate();
        }}
      >
        <Input required label="Email staff" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--pc-body)]">
          Role
          <select value={role} onChange={(event) => setRole(Number(event.target.value) as VenueStaffRole)} className="h-[38px] rounded-[6px] border border-[var(--pc-hairline)] bg-white px-3 text-sm">
            {([0, 1, 2] as VenueStaffRole[]).map((value) => <option key={value} value={value}>{roleLabels[value]}</option>)}
          </select>
        </label>
        <Button type="submit" disabled={addMutation.isPending || !email.trim()} className="self-end">
          {addMutation.isPending ? "Đang thêm..." : "Thêm staff"}
        </Button>
      </form>

      <div className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
        <h2 className="font-semibold text-[var(--pc-ink)]">Danh sách staff</h2>
        {staffQuery.isLoading ? (
          <p className="mt-4 text-sm text-[var(--pc-mute)]">Đang tải...</p>
        ) : staffQuery.isError ? (
          <div className="mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {staffQuery.error.message}
          </div>
        ) : staff.length ? (
          <div className="mt-4 divide-y divide-[var(--pc-hairline)]">
            {staff.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-semibold text-[var(--pc-ink)]">{item.fullName}</p>
                  <p className="text-[var(--pc-mute)]">{item.email} · {roleLabels[item.role as unknown as VenueStaffRole] ?? item.role} · {item.isActive ? "Active" : "Inactive"}</p>
                </div>
                <Button
                  type="button"
                  variant="Danger"
                  disabled={removeMutation.isPending}
                  onClick={() => window.confirm(`Xóa staff ${item.email}?`) && removeMutation.mutate(item.id)}
                >
                  Xóa
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--pc-mute)]">Chưa có staff.</p>
        )}
      </div>
    </section>
  );
}
