'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/playcourt/tabs';
import { ProfileInfoTab } from '@/components/player/profile/profile-info-tab';
import { BookingsHistoryTab } from '@/components/player/profile/bookings-history-tab';
import { MatchesHistoryTab } from '@/components/player/profile/matches-history-tab';
import { StatsTab } from '@/components/player/profile/stats-tab';
import { Button } from '@/components/playcourt/button';
import { Input } from '@/components/playcourt/input';
import { api, getVenueImage, getVenueSportName, type PlayerSport, type Sport, type Venue } from '@/lib/api/client';
import { useEffect } from 'react';

function PlayerSportsTab() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [items, setItems] = useState<PlayerSport[]>([]);
  const [sportId, setSportId] = useState('');
  const [skillLevel, setSkillLevel] = useState(1);
  const [message, setMessage] = useState('');
  const load = () => Promise.all([api.sports.list(true), api.users.sports()]).then(([sportResponse, userSportsResponse]) => { setSports(sportResponse.data ?? []); setItems(userSportsResponse.data ?? []); });
  useEffect(() => { load().catch((err) => setMessage(err instanceof Error ? err.message : 'Không thể tải môn thể thao.')); }, []);
  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.some((item) => item.sportId === Number(sportId))) { setMessage('Bạn đã thêm môn này.'); return; }
    await api.users.addSport({ sportId: Number(sportId), skillLevel });
    setSportId('');
    await load();
  };
  return <div className="space-y-5"><form onSubmit={add} className="grid gap-3 rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5 md:grid-cols-[1fr_180px_auto]"><label className="flex flex-col gap-1.5 text-xs font-semibold">Môn<select required value={sportId} onChange={(e) => setSportId(e.target.value)} className="h-[38px] rounded-[6px] border border-[var(--pc-hairline)] px-3"><option value="">Chọn môn</option>{sports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}</select></label><label className="flex flex-col gap-1.5 text-xs font-semibold">Trình độ<select value={skillLevel} onChange={(e) => setSkillLevel(Number(e.target.value))} className="h-[38px] rounded-[6px] border border-[var(--pc-hairline)] px-3"><option value={0}>Beginner</option><option value={1}>Intermediate</option><option value={2}>Advanced</option></select></label><Button className="self-end" type="submit">Thêm</Button></form>{message && <p className="text-sm text-[var(--pc-mute)]">{message}</p>}<div className="rounded-[8px] border border-[var(--pc-hairline)] bg-white">{items.length ? items.map((item) => <div key={item.sportId} className="flex items-center justify-between border-t border-[var(--pc-hairline)] p-4 first:border-t-0"><span>{item.sport?.name ?? sports.find((sport) => sport.id === item.sportId)?.name ?? item.sportId} · {['Beginner','Intermediate','Advanced'][item.skillLevel] ?? item.skillLevel}</span><div className="flex gap-2"><Button variant="Secondary" type="button" onClick={async () => { await api.users.updateSport(item.sportId, { skillLevel: item.skillLevel === 2 ? 0 : item.skillLevel + 1 }); await load(); }}>Đổi level</Button><Button variant="Danger" type="button" onClick={async () => { if (confirm('Xóa môn khỏi hồ sơ?')) { await api.users.deleteSport(item.sportId); await load(); } }}>Xóa</Button></div></div>) : <p className="p-4 text-sm text-[var(--pc-mute)]">Chưa có môn thể thao.</p>}</div></div>;
}

function FavoriteVenuesTab() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [message, setMessage] = useState('');
  const load = () => api.venues.favorites().then((response) => setVenues(response.data ?? []));
  useEffect(() => { load().catch((err) => setMessage(err instanceof Error ? err.message : 'Không thể tải yêu thích.')); }, []);
  return <div className="grid gap-4">{message && <p className="text-sm text-[var(--pc-mute)]">{message}</p>}{venues.length ? venues.map((venue) => <div key={venue.id} className="flex gap-4 rounded-[8px] border border-[var(--pc-hairline)] bg-white p-4"><div className="h-20 w-28 overflow-hidden rounded-[6px] bg-[var(--pc-hairline-soft)]">{getVenueImage(venue) && <img src={getVenueImage(venue)} alt="" className="h-full w-full object-cover" />}</div><div className="flex-1"><p className="font-semibold">{venue.name}</p><p className="text-sm text-[var(--pc-mute)]">{getVenueSportName(venue)} · {venue.address}</p></div><Button variant="Danger" type="button" onClick={async () => { await api.venues.unfavorite(venue.id); await load(); }}>Bỏ yêu thích</Button></div>) : <div className="rounded-[8px] border border-dashed border-[var(--pc-hairline)] bg-white p-8 text-center text-sm text-[var(--pc-mute)]">Chưa có venue yêu thích.</div>}</div>;
}

function ChangePasswordTab() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setMessage(''); try { const response = await api.auth.changePassword(form); setMessage(response.message || 'Đã đổi mật khẩu.'); setForm({ currentPassword: '', newPassword: '' }); } catch (err) { setMessage(err instanceof Error ? err.message : 'Không thể đổi mật khẩu.'); } };
  return <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5"><Input required type="password" label="Mật khẩu hiện tại" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} /><Input required minLength={6} type="password" label="Mật khẩu mới" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} /><Button type="submit">Đổi mật khẩu</Button>{message && <p className="text-sm text-[var(--pc-mute)]">{message}</p>}</form>;
}

export default function ProfileClientPage() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-[var(--pc-ink)]">Hồ sơ cá nhân</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="sports">Môn & trình độ</TabsTrigger>
          <TabsTrigger value="favorites">Yêu thích</TabsTrigger>
          <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
          <TabsTrigger value="bookings">Lịch sử booking</TabsTrigger>
          <TabsTrigger value="matches">Lịch sử match</TabsTrigger>
          <TabsTrigger value="stats">Thống kê</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="info">
            <ProfileInfoTab />
          </TabsContent>

          <TabsContent value="sports">
            <PlayerSportsTab />
          </TabsContent>

          <TabsContent value="favorites">
            <FavoriteVenuesTab />
          </TabsContent>

          <TabsContent value="password">
            <ChangePasswordTab />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsHistoryTab />
          </TabsContent>

          <TabsContent value="matches">
            <MatchesHistoryTab />
          </TabsContent>

          <TabsContent value="stats">
            <StatsTab />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
