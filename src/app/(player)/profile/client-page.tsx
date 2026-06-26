'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/playcourt/tabs';
import { ProfileInfoTab } from '@/components/player/profile/profile-info-tab';
import { BookingsHistoryTab } from '@/components/player/profile/bookings-history-tab';
import { MatchesHistoryTab } from '@/components/player/profile/matches-history-tab';
import { StatsTab } from '@/components/player/profile/stats-tab';

export default function ProfileClientPage() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-[var(--pc-ink)]">Hồ sơ cá nhân</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="bookings">Lịch sử booking</TabsTrigger>
          <TabsTrigger value="matches">Lịch sử match</TabsTrigger>
          <TabsTrigger value="stats">Thống kê</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="info">
            <ProfileInfoTab />
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
