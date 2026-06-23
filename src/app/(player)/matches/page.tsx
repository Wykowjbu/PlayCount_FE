import Link from 'next/link';
import { MatchCard } from '@/components/playcourt/match-card';
import { Button } from '@/components/playcourt/button';

const matches = [
  { id: 'match-01', sport: 'Cầu lông', title: 'Đánh đôi sau giờ làm', dateTime: 'Hôm nay · 19:00', participants: [{ id: 'an', name: 'An' }, { id: 'minh', name: 'Minh' }], status: 'pending' as const, maxParticipants: 4 },
  { id: 'match-02', sport: 'Pickleball', title: 'Giao lưu cuối tuần', dateTime: 'Thứ bảy · 08:00', participants: [{ id: 'ha', name: 'Hà' }, { id: 'long', name: 'Long' }, { id: 'vy', name: 'Vy' }], status: 'confirmed' as const, maxParticipants: 4 },
];

export default function MatchesPage() {
  return <section className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-8"><div className="flex flex-col justify-between gap-5 rounded-2xl border border-[var(--pc-hairline)] bg-[var(--pc-green-50)] p-7 sm:flex-row sm:items-end"><div><p className="font-mono text-xs uppercase tracking-[.16em]">Matchmaking</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--pc-ink)]">Tìm đội hợp trình độ</h1><p className="mt-2 text-sm text-[var(--pc-body)]">Kết nối với người chơi quanh bạn.</p></div><Link href="/matches/create"><Button>Tạo trận đấu</Button></Link></div><div className="mt-7 flex flex-wrap gap-2"><Button variant="Secondary">Tất cả môn</Button><Button variant="Secondary">2.5 - 3.5</Button><Button variant="Secondary">Gần tôi</Button></div><div className="mt-7 grid gap-4 md:grid-cols-2">{matches.map((match) => <Link key={match.id} href={`/matches/${match.id}`}><MatchCard {...match} /></Link>)}</div></section>;
}
