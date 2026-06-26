export interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  createdAt: string;
}

export interface UpdatePlayerInput {
  name?: string;
  phone?: string;
}

export interface PlayerBooking {
  id: string;
  venueId: string;
  venueName: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
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
  venueId: string;
  venueName: string;
  date: string;
  startTime: string;
  endTime: string;
  currentPlayers: number;
  maxPlayers: number;
  status: 'open' | 'full' | 'completed' | 'cancelled';
  isCreator: boolean;
  createdAt: string;
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
  favoriteVenue: {
    id: string;
    name: string;
    bookingCount: number;
  } | null;
  totalBookings: number;
  completedBookings: number;
}
