import type { Metadata } from 'next';
import ProfileClientPage from './client-page';

export const metadata: Metadata = {
  title: 'Hồ sơ cá nhân | PlayCount',
  description: 'Quản lý thông tin cá nhân, lịch sử booking và match',
};

export default function ProfilePage() {
  return <ProfileClientPage />;
}
