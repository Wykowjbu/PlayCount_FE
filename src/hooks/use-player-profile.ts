import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, type UserProfile } from '@/lib/api/client';

export type Player = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  createdAt: string;
};

export interface UpdatePlayerInput {
  name?: string;
  phone?: string;
}

export interface PlayerBooking {
  id: string;
  venueName: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
}

export interface BookingsResponse {
  bookings: PlayerBooking[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PlayerMatch {
  id: string;
  title: string;
  venueName: string;
  date: string;
  startTime: string;
  endTime: string;
  currentPlayers: number;
  maxPlayers: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  isCreator: boolean;
}

export interface MatchesResponse {
  matches: PlayerMatch[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PlayerStats {
  totalMatches: number;
  totalHoursPlayed: number;
  favoriteVenue: { id: string; name: string; bookingCount: number } | null;
  totalBookings: number;
  completedBookings: number;
}

function mapProfile(profile: UserProfile): Player {
  return {
    id: profile.id,
    name: profile.fullName ?? '',
    email: profile.email ?? '',
    phone: profile.phoneNumber ?? '',
    avatar: profile.avatarUrl ?? null,
    createdAt: '',
  };
}

export function usePlayerProfile() {
  return useQuery<Player>({
    queryKey: ['users', 'me'],
    queryFn: async () => {
      const response = await api.users.me();
      if (!response.data) throw new Error(response.message || 'Không thể tải hồ sơ.');
      return mapProfile(response.data);
    },
  });
}

export function useUpdatePlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdatePlayerInput) => {
      const response = await api.users.updateMe({ fullName: input.name });
      if (!response.data) throw new Error(response.message || 'Không thể cập nhật hồ sơ.');
      return mapProfile(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: async (file: File) => {
      void file;
      throw new Error('Backend hiện chưa có API upload avatar. Hãy nhập avatar URL qua hồ sơ khi BE hỗ trợ.');
    },
  });
}

export function usePlayerBookings(page?: number, status?: string) {
  void page;
  void status;
  return useQuery<BookingsResponse>({
    queryKey: ['unsupported', 'bookings'],
    queryFn: async () => ({ bookings: [], total: 0, page: 1, totalPages: 0 }),
  });
}

export function usePlayerMatches(page?: number) {
  void page;
  return useQuery<MatchesResponse>({
    queryKey: ['unsupported', 'matches'],
    queryFn: async () => ({ matches: [], total: 0, page: 1, totalPages: 0 }),
  });
}

export function usePlayerStats() {
  return useQuery<PlayerStats>({
    queryKey: ['unsupported', 'stats'],
    queryFn: async () => ({
      totalMatches: 0,
      totalHoursPlayed: 0,
      favoriteVenue: null,
      totalBookings: 0,
      completedBookings: 0,
    }),
  });
}
