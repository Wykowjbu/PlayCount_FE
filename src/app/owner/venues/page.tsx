"use client";

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/playcourt/button";
import { Input } from "@/components/playcourt/input";
import {
  api,
  getVenueAmenityNames,
  getVenueImage,
  type Amenity,
  type Court,
  type CourtSchedule,
  type OpeningHour,
  type PricingRule,
  type Sport,
  type Venue,
} from "@/lib/api/client";

const emptyVenue = {
  name: "",
  description: "",
  address: "",
  latitude: "",
  longitude: "",
  phone: "",
  openTime: "",
  closeTime: "",
};

const defaultHours: OpeningHour[] = Array.from({ length: 7 }, (_, index) => ({
  dayOfWeek: index + 1,
  openTime: "08:00:00",
  closeTime: "22:00:00",
  isClosed: false,
}));

const statusLabel: Record<string, string> = { "0": "Pending", "1": "Approved", "2": "Rejected", "3": "Suspended" };

export default function OwnerVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [venueForm, setVenueForm] = useState(emptyVenue);
  const [sports, setSports] = useState<Sport[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [hours, setHours] = useState<OpeningHour[]>(defaultHours);
  const [activeCourtId, setActiveCourtId] = useState<string | number | null>(null);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [schedules, setSchedules] = useState<CourtSchedule[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [newCourt, setNewCourt] = useState({ name: "", sportId: "", indoor: true });
  const [pricingForm, setPricingForm] = useState({ dayOfWeek: 1, startTime: "08:00", endTime: "10:00", pricePerHour: 100000, effectiveFrom: new Date().toISOString().slice(0, 16), effectiveTo: "" });
  const [scheduleForm, setScheduleForm] = useState({ startAt: "", endAt: "", reason: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadBase = () => {
    setLoading(true);
    setError("");
    Promise.all([api.venues.my(), api.sports.list(true), api.amenities.list()])
      .then(([venueResponse, sportResponse, amenityResponse]) => {
        const list = venueResponse.data ?? [];
        setVenues(list);
        setSports(sportResponse.data ?? []);
        setAmenities(amenityResponse.data ?? []);
        if (!selectedVenueId && list[0]) setSelectedVenueId(String(list[0].id));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Không thể tải dữ liệu owner."))
      .finally(() => setLoading(false));
  };

  useEffect(loadBase, []);

  useEffect(() => {
    if (!selectedVenueId) return;
    setError("");
    Promise.all([
      api.venues.myDetail(selectedVenueId),
      api.venues.openingHours(selectedVenueId).catch(() => ({ data: defaultHours })),
      api.courts.list(selectedVenueId).catch(() => ({ data: [] })),
    ])
      .then(([venueResponse, hoursResponse, courtsResponse]) => {
        const venue = venueResponse.data;
        setSelectedVenue(venue);
        setVenueForm({
          name: venue?.name ?? "",
          description: venue?.description ?? "",
          address: venue?.address ?? "",
          latitude: venue?.latitude == null ? "" : String(venue.latitude),
          longitude: venue?.longitude == null ? "" : String(venue.longitude),
          phone: venue?.phone ?? "",
          openTime: venue?.openTime ?? "",
          closeTime: venue?.closeTime ?? "",
        });
        setHours((hoursResponse.data?.length ? hoursResponse.data : defaultHours) as OpeningHour[]);
        setCourts(courtsResponse.data ?? []);
        setActiveCourtId(courtsResponse.data?.[0]?.id ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Không thể tải chi tiết venue."));
  }, [selectedVenueId]);

  useEffect(() => {
    if (!activeCourtId) {
      setPricingRules([]);
      setSchedules([]);
      return;
    }
    Promise.all([
      api.courts.pricingRules(activeCourtId).catch(() => ({ data: [] })),
      api.courts.schedules(activeCourtId).catch(() => ({ data: [] })),
    ]).then(([pricingResponse, scheduleResponse]) => {
      setPricingRules(pricingResponse.data ?? []);
      setSchedules(scheduleResponse.data ?? []);
    });
  }, [activeCourtId]);

  const venuePayload = () => ({
    name: venueForm.name.trim(),
    description: venueForm.description.trim() || null,
    address: venueForm.address.trim(),
    latitude: venueForm.latitude ? Number(venueForm.latitude) : null,
    longitude: venueForm.longitude ? Number(venueForm.longitude) : null,
    phone: venueForm.phone.trim() || null,
    openTime: venueForm.openTime || null,
    closeTime: venueForm.closeTime || null,
  });

  const saveVenue = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = venuePayload();
      if (!payload.name || !payload.address) throw new Error("Tên venue và địa chỉ là bắt buộc.");
      if (selectedVenue) {
        await api.venues.update(selectedVenue.id, payload);
        setMessage("Đã cập nhật venue.");
      } else {
        const response = await api.venues.create(payload);
        setSelectedVenueId(String(response.data?.id ?? ""));
        setMessage("Đã tạo venue, đang chờ duyệt.");
      }
      loadBase();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu venue.");
    } finally {
      setSaving(false);
    }
  };

  const createMode = () => {
    setSelectedVenueId("");
    setSelectedVenue(null);
    setVenueForm(emptyVenue);
    setCourts([]);
    setHours(defaultHours);
    setActiveCourtId(null);
  };

  const deleteVenue = async () => {
    if (!selectedVenue || !confirm(`Xóa venue ${selectedVenue.name}?`)) return;
    setSaving(true);
    try {
      await api.venues.delete(selectedVenue.id);
      setMessage("Đã xóa venue.");
      setSelectedVenue(null);
      setSelectedVenueId("");
      loadBase();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xóa venue.");
    } finally {
      setSaving(false);
    }
  };

  const addImage = async () => {
    if (!selectedVenue || !imageUrl.trim()) return;
    setSaving(true);
    try {
      await api.venues.images.add(selectedVenue.id, { imageUrl: imageUrl.trim(), isCover: !getVenueImage(selectedVenue) });
      setImageUrl("");
      setMessage("Đã thêm URL ảnh.");
      setSelectedVenueId(String(selectedVenue.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể thêm ảnh.");
    } finally {
      setSaving(false);
    }
  };

  const toggleAmenity = async (amenityId: number, assigned: boolean) => {
    if (!selectedVenue) return;
    setSaving(true);
    try {
      if (assigned) await api.venues.removeAmenity(selectedVenue.id, amenityId);
      else await api.venues.addAmenity(selectedVenue.id, amenityId);
      setMessage("Đã cập nhật tiện ích.");
      setSelectedVenueId(String(selectedVenue.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật tiện ích.");
    } finally {
      setSaving(false);
    }
  };

  const saveHours = async () => {
    if (!selectedVenue) return;
    setSaving(true);
    try {
      await api.venues.updateOpeningHours(selectedVenue.id, hours);
      setMessage("Đã cập nhật giờ mở cửa.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật giờ mở cửa.");
    } finally {
      setSaving(false);
    }
  };

  const createCourt = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedVenue) return;
    setSaving(true);
    try {
      await api.courts.create(selectedVenue.id, { name: newCourt.name.trim(), sportId: Number(newCourt.sportId), indoor: newCourt.indoor });
      setNewCourt({ name: "", sportId: "", indoor: true });
      setMessage("Đã tạo court.");
      const response = await api.courts.list(selectedVenue.id);
      setCourts(response.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo court.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCourt = async (courtId: string | number) => {
    if (!confirm("Xóa court này?")) return;
    setError("");
    try {
      await api.courts.delete(courtId);
      if (selectedVenue) setCourts((await api.courts.list(selectedVenue.id)).data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xóa court.");
    }
  };

  const addPricing = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeCourtId) return;
    if (pricingForm.endTime <= pricingForm.startTime) {
      setError("Giờ kết thúc phải sau giờ bắt đầu.");
      return;
    }
    setError("");
    try {
      await api.courts.addPricingRule(activeCourtId, {
        dayOfWeek: Number(pricingForm.dayOfWeek),
        startTime: pricingForm.startTime,
        endTime: pricingForm.endTime,
        pricePerHour: Number(pricingForm.pricePerHour),
        effectiveFrom: new Date(pricingForm.effectiveFrom).toISOString(),
        effectiveTo: pricingForm.effectiveTo ? new Date(pricingForm.effectiveTo).toISOString() : null,
      });
      setPricingRules((await api.courts.pricingRules(activeCourtId)).data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể thêm pricing rule.");
    }
  };

  const addSchedule = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeCourtId) return;
    const startAt = new Date(scheduleForm.startAt);
    const endAt = new Date(scheduleForm.endAt);
    if (endAt <= startAt) {
      setError("Thời gian kết thúc lịch khóa phải sau thời gian bắt đầu.");
      return;
    }
    setError("");
    try {
      await api.courts.addSchedule(activeCourtId, { startAt: startAt.toISOString(), endAt: endAt.toISOString(), reason: scheduleForm.reason || null });
      setSchedules((await api.courts.schedules(activeCourtId)).data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể thêm lịch khóa.");
    }
  };

  const assignedAmenities = new Set(getVenueAmenityNames(selectedVenue ?? ({} as Venue)));

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--pc-mute)]">Venue management</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--pc-ink)]">Venue của tôi</h1>
        </div>
        <Button type="button" onClick={createMode}>Tạo venue</Button>
      </div>

      {error && <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      {message && <div className="rounded-[8px] border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</div>}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[8px] border border-[var(--pc-hairline)] bg-white p-4">
          <h2 className="text-sm font-bold text-[var(--pc-ink)]">Danh sách venue</h2>
          <div className="mt-3 flex flex-col gap-2">
            {loading ? <p className="text-sm text-[var(--pc-mute)]">Đang tải...</p> : venues.length ? venues.map((venue) => (
              <button key={venue.id} type="button" onClick={() => setSelectedVenueId(String(venue.id))} className={`rounded-[6px] border px-3 py-2 text-left text-sm ${selectedVenueId === String(venue.id) ? "border-[var(--pc-green-800)] bg-[var(--pc-green-50)]" : "border-[var(--pc-hairline)]"}`}>
                <span className="font-semibold text-[var(--pc-ink)]">{venue.name}</span>
                <span className="block text-xs text-[var(--pc-mute)]">{statusLabel[String(venue.status)] ?? String(venue.status ?? "Pending")}</span>
              </button>
            )) : <p className="text-sm text-[var(--pc-mute)]">Chưa có venue.</p>}
          </div>
        </aside>

        <main className="flex flex-col gap-6">
          <form onSubmit={saveVenue} className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[var(--pc-ink)]">{selectedVenue ? "Thông tin venue" : "Tạo venue"}</h2>
              {selectedVenue && <Button type="button" variant="Danger" disabled={saving} onClick={deleteVenue}>Xóa venue</Button>}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input required label="Tên venue" value={venueForm.name} onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })} />
              <Input required label="Địa chỉ" value={venueForm.address} onChange={(e) => setVenueForm({ ...venueForm, address: e.target.value })} />
              <Input label="Số điện thoại" maxLength={20} value={venueForm.phone} onChange={(e) => setVenueForm({ ...venueForm, phone: e.target.value })} />
              <Input label="Latitude" type="number" min={-90} max={90} value={venueForm.latitude} onChange={(e) => setVenueForm({ ...venueForm, latitude: e.target.value })} />
              <Input label="Longitude" type="number" min={-180} max={180} value={venueForm.longitude} onChange={(e) => setVenueForm({ ...venueForm, longitude: e.target.value })} />
              <Input label="Open time" type="time" value={venueForm.openTime} onChange={(e) => setVenueForm({ ...venueForm, openTime: e.target.value })} />
              <Input label="Close time" type="time" value={venueForm.closeTime} onChange={(e) => setVenueForm({ ...venueForm, closeTime: e.target.value })} />
            </div>
            <label className="mt-4 block text-xs font-semibold text-[var(--pc-body)]">Mô tả<textarea className="mt-1 w-full rounded-[6px] border border-[var(--pc-hairline)] p-3 text-sm" value={venueForm.description} onChange={(e) => setVenueForm({ ...venueForm, description: e.target.value })} /></label>
            <Button type="submit" disabled={saving} className="mt-4">{saving ? "Đang lưu..." : "Lưu venue"}</Button>
          </form>

          {selectedVenue && (
            <>
              <div className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--pc-ink)]">Staff</h2>
                    <p className="text-sm text-[var(--pc-mute)]">Quản lý staff bằng VenueStaff API.</p>
                  </div>
                  <Link className="rounded-[6px] bg-[var(--pc-green-800)] px-4 py-2 text-sm font-semibold text-white" href={`/owner/venues/${selectedVenue.id}/staff`}>
                    Mở staff
                  </Link>
                </div>
              </div>

              <div className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
                <h2 className="text-lg font-bold text-[var(--pc-ink)]">Ảnh venue</h2>
                <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
                  <Input label="Image URL" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                  <Button type="button" disabled={saving || !imageUrl} onClick={addImage} className="self-end">Thêm URL</Button>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {(selectedVenue.images ?? []).map((image) => <img key={image.id} src={image.imageUrl} alt="" className="h-32 w-full rounded-[6px] object-cover" />)}
                </div>
              </div>

              <div className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
                <h2 className="text-lg font-bold text-[var(--pc-ink)]">Tiện ích</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {amenities.map((amenity) => {
                    const assigned = assignedAmenities.has(amenity.name);
                    return <Button key={amenity.id} type="button" variant={assigned ? "AppPrimary" : "Secondary"} disabled={saving} onClick={() => toggleAmenity(amenity.id, assigned)}>{amenity.name}</Button>;
                  })}
                </div>
              </div>

              <div className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
                <h2 className="text-lg font-bold text-[var(--pc-ink)]">Giờ mở cửa</h2>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {hours.map((hour, index) => <div key={hour.dayOfWeek} className="rounded-[6px] border border-[var(--pc-hairline)] p-3">
                    <label className="flex items-center justify-between text-sm font-semibold">Ngày {hour.dayOfWeek}<input type="checkbox" checked={hour.isClosed} onChange={(e) => setHours((items) => items.map((item, i) => i === index ? { ...item, isClosed: e.target.checked } : item))} /> Nghỉ</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Input type="time" value={(hour.openTime ?? "").slice(0, 5)} disabled={hour.isClosed} onChange={(e) => setHours((items) => items.map((item, i) => i === index ? { ...item, openTime: `${e.target.value}:00` } : item))} />
                      <Input type="time" value={(hour.closeTime ?? "").slice(0, 5)} disabled={hour.isClosed} onChange={(e) => setHours((items) => items.map((item, i) => i === index ? { ...item, closeTime: `${e.target.value}:00` } : item))} />
                    </div>
                  </div>)}
                </div>
                <Button type="button" onClick={saveHours} disabled={saving} className="mt-4">Lưu giờ mở cửa</Button>
              </div>

              <div className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
                <h2 className="text-lg font-bold text-[var(--pc-ink)]">Courts</h2>
                <form onSubmit={createCourt} className="mt-3 grid gap-3 md:grid-cols-[1fr_180px_120px_auto]">
                  <Input required label="Tên court" value={newCourt.name} onChange={(e) => setNewCourt({ ...newCourt, name: e.target.value })} />
                  <label className="flex flex-col gap-1.5 text-xs font-semibold">Sport<select required value={newCourt.sportId} onChange={(e) => setNewCourt({ ...newCourt, sportId: e.target.value })} className="h-[38px] rounded-[6px] border border-[var(--pc-hairline)] px-2"><option value="">Chọn</option>{sports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}</select></label>
                  <label className="mt-7 flex items-center gap-2 text-sm"><input type="checkbox" checked={newCourt.indoor} onChange={(e) => setNewCourt({ ...newCourt, indoor: e.target.checked })} /> Indoor</label>
                  <Button type="submit" disabled={saving} className="self-end">Tạo court</Button>
                </form>
                <div className="mt-4 flex flex-wrap gap-2">{courts.map((court) => <Button key={court.id} type="button" variant={activeCourtId === court.id ? "AppPrimary" : "Secondary"} onClick={() => setActiveCourtId(court.id)}>{court.name}</Button>)}</div>
                {activeCourtId && <Button type="button" variant="Danger" className="mt-3" onClick={() => deleteCourt(activeCourtId)}>Xóa court đang chọn</Button>}
              </div>

              {activeCourtId && (
                <div className="grid gap-6 xl:grid-cols-2">
                  <section className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
                    <h2 className="text-lg font-bold text-[var(--pc-ink)]">Pricing rules</h2>
                    <form onSubmit={addPricing} className="mt-3 grid gap-3">
                      <Input label="Day of week" type="number" min={1} max={7} value={pricingForm.dayOfWeek} onChange={(e) => setPricingForm({ ...pricingForm, dayOfWeek: Number(e.target.value) })} />
                      <div className="grid grid-cols-2 gap-3"><Input label="Start" type="time" value={pricingForm.startTime} onChange={(e) => setPricingForm({ ...pricingForm, startTime: e.target.value })} /><Input label="End" type="time" value={pricingForm.endTime} onChange={(e) => setPricingForm({ ...pricingForm, endTime: e.target.value })} /></div>
                      <Input label="Price/hour" type="number" min={1} value={pricingForm.pricePerHour} onChange={(e) => setPricingForm({ ...pricingForm, pricePerHour: Number(e.target.value) })} />
                      <Input label="Effective from" type="datetime-local" value={pricingForm.effectiveFrom} onChange={(e) => setPricingForm({ ...pricingForm, effectiveFrom: e.target.value })} />
                      <Input label="Effective to" type="datetime-local" value={pricingForm.effectiveTo} onChange={(e) => setPricingForm({ ...pricingForm, effectiveTo: e.target.value })} />
                      <Button type="submit">Thêm pricing rule</Button>
                    </form>
                    <ul className="mt-4 divide-y divide-[var(--pc-hairline)] text-sm">{pricingRules.map((rule) => <li key={rule.id} className="flex justify-between py-2"><span>Ngày {rule.dayOfWeek} · {rule.startTime}-{rule.endTime} · {rule.pricePerHour}</span><button className="text-red-700" onClick={async () => { if (confirm("Xóa pricing rule?")) { try { await api.pricingRules.delete(rule.id); setPricingRules((await api.courts.pricingRules(activeCourtId)).data ?? []); } catch (err) { setError(err instanceof Error ? err.message : "Không thể xóa pricing rule."); } } }}>Xóa</button></li>)}</ul>
                  </section>

                  <section className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
                    <h2 className="text-lg font-bold text-[var(--pc-ink)]">Schedules</h2>
                    <form onSubmit={addSchedule} className="mt-3 grid gap-3">
                      <Input required label="Start at" type="datetime-local" value={scheduleForm.startAt} onChange={(e) => setScheduleForm({ ...scheduleForm, startAt: e.target.value })} />
                      <Input required label="End at" type="datetime-local" value={scheduleForm.endAt} onChange={(e) => setScheduleForm({ ...scheduleForm, endAt: e.target.value })} />
                      <Input label="Reason" value={scheduleForm.reason} onChange={(e) => setScheduleForm({ ...scheduleForm, reason: e.target.value })} />
                      <Button type="submit">Thêm lịch khóa</Button>
                    </form>
                    <ul className="mt-4 divide-y divide-[var(--pc-hairline)] text-sm">{schedules.map((item) => <li key={item.id} className="flex justify-between gap-3 py-2"><span>{new Date(item.startAt).toLocaleString("vi-VN")} - {new Date(item.endAt).toLocaleString("vi-VN")} · {item.reason}</span><button className="text-red-700" onClick={async () => { if (confirm("Xóa schedule?")) { try { await api.schedules.delete(item.id); setSchedules((await api.courts.schedules(activeCourtId)).data ?? []); } catch (err) { setError(err instanceof Error ? err.message : "Không thể xóa schedule."); } } }}>Xóa</button></li>)}</ul>
                  </section>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </section>
  );
}
