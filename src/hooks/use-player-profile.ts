import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  Player,
  UpdatePlayerInput,
  BookingsResponse,
  MatchesResponse,
  PlayerStats,
} from '@/types/player';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Get player profile
export function usePlayerProfile() {
  return useQuery<Player>({
    queryKey: ['player', 'me'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/players/me`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return res.json();
    },
  });
}

// Update player profile
export function useUpdatePlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdatePlayerInput) => {
      const res = await fetch(`${API_BASE}/players/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player', 'me'] });
    },
  });
}

// Upload avatar
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/players/me/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload avatar');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player', 'me'] });
    },
  });
}

// Get booking history
export function usePlayerBookings(page: number, status: string) {
  return useQuery<BookingsResponse>({
    queryKey: ['player', 'bookings', { page, status }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        status,
      });
      const res = await fetch(`${API_BASE}/players/me/bookings?${params}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return res.json();
    },
  });
}

// Get match history
export function usePlayerMatches(page: number) {
  return useQuery<MatchesResponse>({
    queryKey: ['player', 'matches', { page }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
      });
      const res = await fetch(`${API_BASE}/players/me/matches?${params}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch matches');
      return res.json();
    },
  });
}

// Get player stats
export function usePlayerStats() {
  return useQuery<PlayerStats>({
    queryKey: ['player', 'stats'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/players/me/stats`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });
}
