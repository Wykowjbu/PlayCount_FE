import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, type BookingStatusCode, type Match, type UserProfile } from '@/lib/api/client';

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
  avatarUrl?: string | null;
}

export interface PlayerBooking {
  id: string | number;
  venueName: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
}

export interface BookingsResponse {
  bookings: PlayerBooking[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PlayerMatch {
  id: string | number;
  title: string;
  venueName: string;
  date: string;
  startTime: string;
  endTime: string;
  currentPlayers: number;
  maxPlayers: number;
  status: string;
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
  favoriteVenue: { id: string | number; name: string; bookingCount?: number } | null;
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
      const response = await api.users.updateMe({ fullName: input.name, avatarUrl: input.avatarUrl });
      if (!response.data) throw new Error(response.message || 'Không thể cập nhật hồ sơ.');
      return mapProfile(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}

export function usePlayerBookings(page?: number, status?: string) {
  return useQuery<BookingsResponse>({
    queryKey: ['bookings', 'me', page ?? 1, status ?? 'all'],
    queryFn: async () => {
      const statusMap: Record<string, BookingStatusCode | undefined> = {
        all: undefined,
        pending: 0,
        confirmed: 1,
        completed: 2,
        cancelled: 3,
      };
      const response = await api.bookings.me({
        Page: page ?? 1,
        PageSize: 10,
        Status: statusMap[status ?? 'all'],
      });
      const bookings = (response.data ?? []).map((booking) => ({
        id: booking.id,
        venueName: booking.venueName,
        courtName: booking.courtName,
        date: booking.startAt,
        startTime: new Date(booking.startAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }),
        endTime: new Date(booking.endAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }),
        status: booking.status,
        totalPrice: booking.totalPrice,
      }));
      return {
        bookings,
        total: response.totalCount,
        page: response.pageIndex,
        totalPages: response.totalPages,
      };
    },
  });
}

export function usePlayerMatches(page?: number) {
  return useQuery<MatchesResponse>({
    queryKey: ['matches', 'me-ish', page ?? 1],
    queryFn: async () => {
      const response = await api.matches.search({ PageIndex: page ?? 1, PageSize: 50, IncludeFull: true });
      const mine = (response.data ?? []).filter((match) => match.isHost || match.isParticipant);
      return {
        matches: mine.map(mapMatch),
        total: mine.length,
        page: response.pageIndex,
        totalPages: response.totalPages,
      };
    },
  });
}

export function usePlayerStats() {
  return useQuery<PlayerStats>({
    queryKey: ['players', 'stats', 'derived'],
    queryFn: async () => {
      const [bookingResponse, matchResponse, favoritesResponse] = await Promise.all([
        api.bookings.me({ Page: 1, PageSize: 100 }),
        api.matches.search({ PageIndex: 1, PageSize: 100, IncludeFull: true }),
        api.venues.favorites().catch(() => ({ data: [] })),
      ]);
      const bookings = bookingResponse.data ?? [];
      const completedBookings = bookings.filter((booking) => booking.status.toLowerCase() === 'completed');
      const totalHoursPlayed = completedBookings.reduce((total, booking) => {
        const duration = new Date(booking.endAt).getTime() - new Date(booking.startAt).getTime();
        return total + Math.max(0, duration / 36e5);
      }, 0);
      const favoriteVenue = favoritesResponse.data?.[0]
        ? { id: favoritesResponse.data[0].id, name: favoritesResponse.data[0].name }
        : null;
      return {
        totalMatches: (matchResponse.data ?? []).filter((match) => match.isHost || match.isParticipant).length,
        totalHoursPlayed: Number(totalHoursPlayed.toFixed(1)),
        favoriteVenue,
        totalBookings: bookingResponse.totalCount,
        completedBookings: completedBookings.length,
      };
    },
  });
}

function mapMatch(match: Match): PlayerMatch {
  return {
    id: match.id,
    title: `${match.sportName} - ${match.venueName || match.locationDescription || 'Địa điểm tự chọn'}`,
    venueName: match.venueName || match.locationDescription || 'Địa điểm tự chọn',
    date: match.startAt,
    startTime: new Date(match.startAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }),
    endTime: new Date(match.endAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }),
    currentPlayers: match.participantCount,
    maxPlayers: match.maxParticipants,
    status: match.status,
    isCreator: match.isHost,
  };
}
