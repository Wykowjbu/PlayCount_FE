export type UserRole = "Admin" | "Player" | "CourtOwner";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  errors?: string[];
};

export type PagedResponse<T> = ApiResponse<T[]> & {
  totalCount: number;
  totalPages: number;
  pageIndex: number;
  pageSize: number;
};

export type ApiErrorCode = 400 | 401 | 403 | 404 | 409 | 500 | number;

export class ApiError extends Error {
  status: ApiErrorCode;
  errors: string[];

  constructor(status: ApiErrorCode, message: string, errors: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export type LoginUser = {
  id: number | string;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  role: UserRole | string;
  status?: string | null;
  isEmailVerified?: boolean;
};

export type LoginResponse = {
  accessToken: string;
  tokenType?: string;
  expiresAt?: string;
  user?: LoginUser | null;
};

export type UserStatus = string | number;
export type VenueStatus = 0 | 1 | 2 | 3;
export type CourtStatus = 0 | 1 | 2;
export type BookingStatusCode = 0 | 1 | 2 | 3 | 4;
export type BookingStatus = string;
export type MatchStatus = string;
export type MatchJoinRequestStatus = "Pending" | "Approved" | "Rejected" | string;
export type MatchInvitationStatus = "Pending" | "Accepted" | "Declined" | string;
export type ReviewStatus = 0 | 1 | 2;
export type CourtOwnerVerificationStatus = 0 | 1 | 2;
export type VenueStaffRole = 0 | 1 | 2;

export type Sport = {
  id: number;
  code?: string | null;
  name: string;
  description?: string | null;
  playerCount?: number | null;
  isActive?: boolean;
};

export type Amenity = {
  id: number;
  name: string;
};

export type VenueImage = {
  id: number | string;
  imageUrl: string;
  isCover?: boolean;
};

export type OpeningHour = {
  dayOfWeek: number;
  openTime?: string | null;
  closeTime?: string | null;
  isClosed: boolean;
};

export type Venue = {
  id: number | string;
  name: string;
  description?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  openTime?: string | null;
  closeTime?: string | null;
  status?: VenueStatus | string;
  images?: VenueImage[];
  amenities?: Amenity[] | string[];
  sports?: Sport[];
  ownerId?: number | string;
  isFavorite?: boolean;
  rating?: number;
};

export type Court = {
  id: number | string;
  venueId?: number | string;
  sportId: number;
  sport?: Sport | string | null;
  name: string;
  indoor: boolean;
  status?: CourtStatus;
};

export type PricingRule = {
  id: number | string;
  courtId?: number | string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
};

export type CourtSchedule = {
  id: number | string;
  courtId?: number | string;
  startAt: string;
  endAt: string;
  reason?: string | null;
};

export type PlayerSport = {
  sportId: number;
  sport?: Sport;
  skillLevel: 0 | 1 | 2 | number;
};

export type UserProfile = LoginUser & {
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: number | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
};

export type CourtOwner = {
  id: number | string;
  userId?: number | string;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  businessName?: string | null;
  verificationStatus?: CourtOwnerVerificationStatus;
  rejectionReason?: string | null;
};

export type Booking = {
  id: number;
  userProfileId: number;
  playerName: string;
  courtId: number;
  courtName: string;
  venueId: number;
  venueName: string;
  startAt: string;
  endAt: string;
  totalPrice: number;
  platformFee: number;
  ownerEarnings: number;
  status: BookingStatus;
  note?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

export type BookingAvailability = {
  courtId: number;
  startAt: string;
  endAt: string;
  isAvailable: boolean;
  estimatedPrice?: number | null;
  reason?: string | null;
};

export type BookingFilters = {
  Status?: BookingStatusCode;
  From?: string;
  To?: string;
  Page?: number;
  PageSize?: number;
};

export type Match = {
  id: number;
  hostProfileId: number;
  hostName: string;
  hostAvatarUrl?: string | null;
  sportId: number;
  sportCode: string;
  sportName: string;
  courtId?: number | null;
  courtName?: string | null;
  venueName?: string | null;
  locationDescription?: string | null;
  startAt: string;
  endAt: string;
  requiredSkillLevelMin?: string | null;
  requiredSkillLevelMax?: string | null;
  maxParticipants: number;
  participantCount: number;
  availableSlots: number;
  costDescription?: string | null;
  description?: string | null;
  status: MatchStatus;
  isHost: boolean;
  isParticipant: boolean;
  myJoinRequestStatus?: MatchJoinRequestStatus | null;
  createdAt: string;
};

export type MatchParticipant = {
  profileId: number;
  fullName: string;
  avatarUrl?: string | null;
  skillLevel?: string | null;
  isHost: boolean;
  joinedAt: string;
};

export type MatchDetail = {
  match: Match;
  participants: MatchParticipant[];
};

export type MatchJoinRequest = {
  id: number;
  matchId: number;
  playerProfileId: number;
  playerName: string;
  playerAvatarUrl?: string | null;
  skillLevel?: string | null;
  status: MatchJoinRequestStatus;
  requestedAt: string;
  respondedAt?: string | null;
};

export type MatchInvitation = {
  id: number;
  matchId: number;
  sportName: string;
  matchStartAt: string;
  inviterProfileId: number;
  inviterName: string;
  inviteeProfileId: number;
  inviteeName: string;
  message?: string | null;
  status: MatchInvitationStatus;
  invitedAt: string;
  respondedAt?: string | null;
};

export type PlayerMatchCandidate = {
  profileId: number;
  fullName: string;
  avatarUrl?: string | null;
  city?: string | null;
  skillLevel: string;
  matchScore: number;
};

export type MatchFilters = {
  SportId?: number;
  SkillLevel?: number;
  Location?: string;
  StartFrom?: string;
  StartTo?: string;
  IncludeFull?: boolean;
  PageIndex?: number;
  PageSize?: number;
};

export type CreateMatchRequest = {
  sportId: number;
  courtId?: number | null;
  locationDescription?: string | null;
  startAt: string;
  endAt: string;
  requiredSkillLevelMin?: number | null;
  requiredSkillLevelMax?: number | null;
  maxParticipants: number;
  costDescription?: string | null;
  description?: string | null;
};

export type Review = {
  id: number;
  playerId: number;
  playerName: string;
  playerAvatar?: string | null;
  bookingId: number;
  venueId: number;
  venueName: string;
  courtId: number;
  courtName: string;
  rating: number;
  reviewText?: string | null;
  status: string;
  createdAt: string;
  updatedAt?: string | null;
  images: ReviewImage[];
};

export type ReviewImage = {
  id: number;
  reviewId: number;
  imageUrl: string;
  displayOrder: number;
  createdAt: string;
};

export type ReviewStats = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
};

export type VenueStaff = {
  id: number;
  venueId: number;
  venueName: string;
  userId: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export type VenueFilters = {
  Keyword?: string;
  SportId?: number;
  IsOpenNow?: boolean;
  PageIndex?: number;
  PageSize?: number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5187";

const TOKEN_KEY = "access_token";
const USER_KEY = "user";
export const SESSION_CHANGED_EVENT = "playcourt-session-changed";

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function emitSessionChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emitSessionChanged();
}

function redirectForAuth(status: number) {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  if (status === 401 && !path.startsWith("/login")) {
    clearSession();
    window.location.assign(`/login?next=${encodeURIComponent(path)}`);
  }
  if (status === 403 && path !== "/403") {
    window.location.assign("/403");
  }
}

async function readJson(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractMessage(body: unknown, fallback: string) {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

function extractErrors(body: unknown) {
  if (!body || typeof body !== "object" || !("errors" in body)) return [];
  const errors = (body as { errors?: unknown }).errors;
  if (Array.isArray(errors)) return errors.map(String);
  if (errors && typeof errors === "object") {
    return Object.values(errors).flat().map(String);
  }
  return [];
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { headers, body, ...init } = options;
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${normalizePath(path)}`, {
    ...init,
    headers: {
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body,
  });

  const parsed = await readJson(response);
  if (!response.ok) {
    redirectForAuth(response.status);
    throw new ApiError(
      response.status,
      extractMessage(parsed, `HTTP ${response.status}`),
      extractErrors(parsed),
    );
  }

  if (parsed && typeof parsed === "object" && "success" in parsed) {
    const wrapped = parsed as ApiResponse<T>;
    if (!wrapped.success) {
      throw new ApiError(response.status, wrapped.message || "Yêu cầu không thành công", wrapped.errors ?? []);
    }
  }

  return parsed as T;
}

export function unwrap<T>(response: ApiResponse<T>): T {
  if (response.data === null || response.data === undefined) {
    throw new ApiError(404, response.message || "Không có dữ liệu", response.errors ?? []);
  }
  return response.data;
}

export function toQuery(params: Record<string, string | number | boolean | undefined | null>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  });
  const value = search.toString();
  return value ? `?${value}` : "";
}

function normalizeRole(role?: string | null): UserRole | string {
  return role === "Owner" ? "CourtOwner" : role || "Player";
}

export function saveSession(login: LoginResponse) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, login.accessToken);
  if (login.user) {
    localStorage.setItem(USER_KEY, JSON.stringify({ ...login.user, role: normalizeRole(login.user.role) }));
  }
  emitSessionChanged();
}

export function getStoredUser(): LoginUser | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(USER_KEY);
  if (!value) return null;
  try {
    const user = JSON.parse(value) as LoginUser;
    return { ...user, role: normalizeRole(user.role) };
  } catch {
    clearSession();
    return null;
  }
}

export const api = {
  auth: {
    async register(body: {
      fullName: string;
      email: string;
      phoneNumber: string;
      password: string;
      role: "Player" | "CourtOwner";
      businessName: string | null;
    }) {
      return apiRequest<ApiResponse<unknown>>("/api/Auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    async login(body: { identifier: string; password: string }) {
      const response = await apiRequest<ApiResponse<LoginResponse>>("/api/Auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const login = unwrap(response);
      saveSession(login);
      return response;
    },
    verifyEmail: (body: { email: string; otp: string }) =>
      apiRequest<ApiResponse<unknown>>("/api/Auth/verify-email", { method: "POST", body: JSON.stringify(body) }),
    resendVerifyEmail: (body: { email: string }) =>
      apiRequest<ApiResponse<unknown>>("/api/Auth/resend-verify-email", { method: "POST", body: JSON.stringify(body) }),
    forgotPassword: (body: { email: string }) =>
      apiRequest<ApiResponse<unknown>>("/api/Auth/forgot-password", { method: "POST", body: JSON.stringify(body) }),
    resetPassword: (body: { email: string; otp: string; newPassword: string }) =>
      apiRequest<ApiResponse<unknown>>("/api/Auth/reset-password", { method: "POST", body: JSON.stringify(body) }),
    changePassword: (body: { currentPassword: string; newPassword: string }) =>
      apiRequest<ApiResponse<unknown>>("/api/Auth/change-password", { method: "POST", body: JSON.stringify(body) }),
    logout: clearSession,
    getToken,
    getCurrentUser: getStoredUser,
    isAuthenticated: () => !!getToken(),
  },
  users: {
    me: () => apiRequest<ApiResponse<UserProfile>>("/api/Users/me"),
    updateMe: (body: Partial<UserProfile>) =>
      apiRequest<ApiResponse<UserProfile>>("/api/Users/me", { method: "PUT", body: JSON.stringify(body) }),
    sports: () => apiRequest<ApiResponse<PlayerSport[]>>("/api/Users/me/sports"),
    addSport: (body: { sportId: number; skillLevel: number }) =>
      apiRequest<ApiResponse<PlayerSport>>("/api/Users/me/sports", { method: "POST", body: JSON.stringify(body) }),
    updateSport: (sportId: number, body: { skillLevel: number }) =>
      apiRequest<ApiResponse<PlayerSport>>(`/api/Users/me/sports/${sportId}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteSport: (sportId: number) => apiRequest<ApiResponse<unknown>>(`/api/Users/me/sports/${sportId}`, { method: "DELETE" }),
  },
  sports: {
    list: (isActive?: boolean) => apiRequest<ApiResponse<Sport[]>>(`/api/Sports${toQuery({ isActive })}`),
    create: (body: Partial<Sport>) => apiRequest<ApiResponse<Sport>>("/api/Sports", { method: "POST", body: JSON.stringify(body) }),
    update: (id: number, body: Partial<Sport>) => apiRequest<ApiResponse<Sport>>(`/api/Sports/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    toggle: (id: number) => apiRequest<ApiResponse<Sport>>(`/api/Sports/${id}/toggle-active`, { method: "PATCH" }),
  },
  amenities: {
    list: () => apiRequest<ApiResponse<Amenity[]>>("/api/Amenities"),
    create: (body: { name: string }) => apiRequest<ApiResponse<Amenity>>("/api/Amenities", { method: "POST", body: JSON.stringify(body) }),
    update: (id: number, body: { name: string }) => apiRequest<ApiResponse<Amenity>>(`/api/Amenities/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: number) => apiRequest<ApiResponse<unknown>>(`/api/Amenities/${id}`, { method: "DELETE" }),
  },
  venues: {
    list: (filters: VenueFilters) => apiRequest<PagedResponse<Venue>>(`/api/Venues${toQuery(filters)}`),
    detail: (id: string | number) => apiRequest<ApiResponse<Venue>>(`/api/Venues/${id}`),
    my: () => apiRequest<ApiResponse<Venue[]>>("/api/Venues/my"),
    myDetail: (id: string | number) => apiRequest<ApiResponse<Venue>>(`/api/Venues/my/${id}`),
    create: (body: Partial<Venue>) => apiRequest<ApiResponse<Venue>>("/api/Venues", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string | number, body: Partial<Venue>) => apiRequest<ApiResponse<Venue>>(`/api/Venues/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string | number) => apiRequest<ApiResponse<unknown>>(`/api/Venues/${id}`, { method: "DELETE" }),
    admin: () => apiRequest<ApiResponse<Venue[]>>("/api/Venues/admin"),
    adminDetail: (id: string | number) => apiRequest<ApiResponse<Venue>>(`/api/Venues/admin/${id}`),
    status: (id: string | number, status: VenueStatus) =>
      apiRequest<ApiResponse<Venue>>(`/api/Venues/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    images: {
      add: (venueId: string | number, body: { imageUrl: string; isCover: boolean }) =>
        apiRequest<ApiResponse<VenueImage>>(`/api/Venues/${venueId}/images`, { method: "POST", body: JSON.stringify(body) }),
      delete: (venueId: string | number, imageId: string | number) =>
        apiRequest<ApiResponse<unknown>>(`/api/Venues/${venueId}/images/${imageId}`, { method: "DELETE" }),
      setCover: (venueId: string | number, imageId: string | number) =>
        apiRequest<ApiResponse<unknown>>(`/api/Venues/${venueId}/images/${imageId}/set-cover`, { method: "PATCH" }),
    },
    addAmenity: (venueId: string | number, amenityId: number) =>
      apiRequest<ApiResponse<unknown>>(`/api/Venues/${venueId}/amenities/${amenityId}`, { method: "POST" }),
    removeAmenity: (venueId: string | number, amenityId: number) =>
      apiRequest<ApiResponse<unknown>>(`/api/Venues/${venueId}/amenities/${amenityId}`, { method: "DELETE" }),
    openingHours: (venueId: string | number) => apiRequest<ApiResponse<OpeningHour[]>>(`/api/Venues/${venueId}/opening-hours`),
    updateOpeningHours: (venueId: string | number, openingHours: OpeningHour[]) =>
      apiRequest<ApiResponse<OpeningHour[]>>(`/api/Venues/${venueId}/opening-hours`, {
        method: "PUT",
        body: JSON.stringify({ openingHours }),
      }),
    favorite: (id: string | number) => apiRequest<ApiResponse<unknown>>(`/api/Venues/${id}/favorites`, { method: "POST" }),
    unfavorite: (id: string | number) => apiRequest<ApiResponse<unknown>>(`/api/Venues/${id}/favorites`, { method: "DELETE" }),
    favorites: () => apiRequest<ApiResponse<Venue[]>>("/api/Venues/favorites/my"),
    stats: () => apiRequest<ApiResponse<Record<string, unknown>>>("/api/Venues/stats"),
  },
  courts: {
    list: (venueId: string | number) => apiRequest<ApiResponse<Court[]>>(`/api/venues/${venueId}/courts`),
    detail: (id: string | number) => apiRequest<ApiResponse<Court>>(`/api/courts/${id}`),
    create: (venueId: string | number, body: { sportId: number; name: string; indoor: boolean }) =>
      apiRequest<ApiResponse<Court>>(`/api/venues/${venueId}/courts`, { method: "POST", body: JSON.stringify(body) }),
    update: (id: string | number, body: { sportId: number; name: string; indoor: boolean; status: CourtStatus }) =>
      apiRequest<ApiResponse<Court>>(`/api/courts/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string | number) => apiRequest<ApiResponse<unknown>>(`/api/courts/${id}`, { method: "DELETE" }),
    pricingRules: (courtId: string | number) => apiRequest<ApiResponse<PricingRule[]>>(`/api/courts/${courtId}/pricing-rules`),
    addPricingRule: (courtId: string | number, body: Omit<PricingRule, "id" | "courtId">) =>
      apiRequest<ApiResponse<PricingRule>>(`/api/courts/${courtId}/pricing-rules`, { method: "POST", body: JSON.stringify(body) }),
    schedules: (courtId: string | number) => apiRequest<ApiResponse<CourtSchedule[]>>(`/api/courts/${courtId}/schedules`),
    addSchedule: (courtId: string | number, body: { startAt: string; endAt: string; reason?: string | null }) =>
      apiRequest<ApiResponse<CourtSchedule>>(`/api/courts/${courtId}/schedules`, { method: "POST", body: JSON.stringify(body) }),
  },
  pricingRules: {
    update: (id: string | number, body: Omit<PricingRule, "id" | "courtId">) =>
      apiRequest<ApiResponse<PricingRule>>(`/api/pricing-rules/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string | number) => apiRequest<ApiResponse<unknown>>(`/api/pricing-rules/${id}`, { method: "DELETE" }),
  },
  schedules: {
    delete: (id: string | number) => apiRequest<ApiResponse<unknown>>(`/api/court-schedules/${id}`, { method: "DELETE" }),
  },
  courtOwners: {
    list: (verificationStatus?: CourtOwnerVerificationStatus) =>
      apiRequest<ApiResponse<CourtOwner[]>>(`/api/court-owners${toQuery({ verificationStatus })}`),
    detail: (id: string | number) => apiRequest<ApiResponse<CourtOwner>>(`/api/court-owners/${id}`),
    updateStatus: (id: string | number, body: { verificationStatus: CourtOwnerVerificationStatus; rejectionReason?: string | null }) =>
      apiRequest<ApiResponse<CourtOwner>>(`/api/court-owners/${id}/verification-status`, { method: "PATCH", body: JSON.stringify(body) }),
  },
  bookings: {
    create: (body: { courtId: number; startAt: string; endAt: string; note?: string | null }) =>
      apiRequest<ApiResponse<Booking>>("/api/Bookings", { method: "POST", body: JSON.stringify(body) }),
    detail: (id: string | number) => apiRequest<ApiResponse<Booking>>(`/api/Bookings/${id}`),
    me: (filters: BookingFilters = {}) => apiRequest<PagedResponse<Booking>>(`/api/Bookings/me${toQuery(filters)}`),
    venue: (venueId: string | number, filters: BookingFilters = {}) =>
      apiRequest<PagedResponse<Booking>>(`/api/venues/${venueId}/bookings${toQuery(filters)}`),
    court: (courtId: string | number, filters: BookingFilters = {}) =>
      apiRequest<PagedResponse<Booking>>(`/api/courts/${courtId}/bookings${toQuery(filters)}`),
    availability: (courtId: string | number, body: { startAt: string; endAt: string }) =>
      apiRequest<ApiResponse<BookingAvailability>>(
        `/api/courts/${courtId}/availability${toQuery({ StartAt: body.startAt, EndAt: body.endAt })}`,
      ),
    cancel: (id: string | number, reason?: string | null) =>
      apiRequest<ApiResponse<Booking>>(`/api/Bookings/${id}/cancel`, { method: "PATCH", body: JSON.stringify({ reason: reason || null }) }),
    confirm: (id: string | number, reason?: string | null) =>
      apiRequest<ApiResponse<Booking>>(`/api/Bookings/${id}/confirm`, { method: "PATCH", body: JSON.stringify({ reason: reason || null }) }),
    reject: (id: string | number, reason?: string | null) =>
      apiRequest<ApiResponse<Booking>>(`/api/Bookings/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason: reason || null }) }),
    complete: (id: string | number, reason?: string | null) =>
      apiRequest<ApiResponse<Booking>>(`/api/Bookings/${id}/complete`, { method: "PATCH", body: JSON.stringify({ reason: reason || null }) }),
  },
  matches: {
    search: (filters: MatchFilters = {}) => apiRequest<PagedResponse<Match>>(`/api/Matches${toQuery(filters)}`),
    recommended: (limit = 20) => apiRequest<ApiResponse<Match[]>>(`/api/Matches/recommended${toQuery({ limit })}`),
    detail: (id: string | number) => apiRequest<ApiResponse<MatchDetail>>(`/api/Matches/${id}`),
    create: (body: CreateMatchRequest) => apiRequest<ApiResponse<Match>>("/api/Matches", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string | number, body: CreateMatchRequest) =>
      apiRequest<ApiResponse<Match>>(`/api/Matches/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    cancel: (id: string | number) => apiRequest<ApiResponse<unknown>>(`/api/Matches/${id}`, { method: "DELETE" }),
    requestToJoin: (id: string | number) => apiRequest<ApiResponse<unknown>>(`/api/Matches/${id}/join-requests`, { method: "POST" }),
    cancelJoinRequest: (id: string | number) => apiRequest<ApiResponse<unknown>>(`/api/Matches/${id}/join-requests/me`, { method: "DELETE" }),
    joinRequests: (id: string | number) => apiRequest<ApiResponse<MatchJoinRequest[]>>(`/api/Matches/${id}/join-requests`),
    respondJoinRequest: (id: string | number, requestId: string | number, status: "Approved" | "Rejected") =>
      apiRequest<ApiResponse<MatchJoinRequest>>(`/api/Matches/${id}/join-requests/${requestId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    leave: (id: string | number) => apiRequest<ApiResponse<unknown>>(`/api/Matches/${id}/participants/me`, { method: "DELETE" }),
    candidates: (id: string | number, limit = 20) =>
      apiRequest<ApiResponse<PlayerMatchCandidate[]>>(`/api/Matches/${id}/candidates${toQuery({ limit })}`),
    invite: (id: string | number, body: { inviteeProfileId: number; message?: string | null }) =>
      apiRequest<ApiResponse<MatchInvitation>>(`/api/Matches/${id}/invitations`, { method: "POST", body: JSON.stringify(body) }),
    invitations: () => apiRequest<ApiResponse<MatchInvitation[]>>("/api/Matches/invitations/me"),
    respondInvitation: (invitationId: string | number, status: "Accepted" | "Declined") =>
      apiRequest<ApiResponse<MatchInvitation>>(`/api/Matches/invitations/${invitationId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },
  reviews: {
    create: (body: { bookingId: number; rating: number; reviewText?: string | null; imageUrls?: string[] | null }) =>
      apiRequest<ApiResponse<Review>>("/api/Reviews", { method: "POST", body: JSON.stringify(body) }),
    venue: (venueId: string | number, page = 1, pageSize = 10) =>
      apiRequest<PagedResponse<Review>>(`/api/venues/${venueId}/reviews${toQuery({ page, pageSize })}`),
    court: (courtId: string | number, page = 1, pageSize = 10) =>
      apiRequest<PagedResponse<Review>>(`/api/courts/${courtId}/reviews${toQuery({ page, pageSize })}`),
    update: (id: string | number, body: { rating: number; reviewText?: string | null }) =>
      apiRequest<ApiResponse<Review>>(`/api/Reviews/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string | number) => apiRequest<ApiResponse<unknown>>(`/api/Reviews/${id}`, { method: "DELETE" }),
    report: (id: string | number) => apiRequest<ApiResponse<unknown>>(`/api/Reviews/${id}/report`, { method: "POST" }),
    moderate: (id: string | number, status: ReviewStatus) =>
      apiRequest<ApiResponse<Review>>(`/api/admin/reviews/${id}/moderate${toQuery({ status })}`, { method: "PUT" }),
    addImage: (id: string | number, body: { imageUrl: string; displayOrder: number }) =>
      apiRequest<ApiResponse<unknown>>(`/api/Reviews/${id}/images`, { method: "POST", body: JSON.stringify(body) }),
    deleteImage: (id: string | number, imageId: string | number) =>
      apiRequest<ApiResponse<unknown>>(`/api/Reviews/${id}/images/${imageId}`, { method: "DELETE" }),
    venueStats: (venueId: string | number) => apiRequest<ApiResponse<ReviewStats>>(`/api/venues/${venueId}/rating-stats`),
    courtStats: (courtId: string | number) => apiRequest<ApiResponse<ReviewStats>>(`/api/courts/${courtId}/rating-stats`),
    my: (page = 1, pageSize = 10) => apiRequest<PagedResponse<Review>>(`/api/Reviews/my${toQuery({ page, pageSize })}`),
  },
  venueStaff: {
    list: (venueId: string | number) => apiRequest<ApiResponse<VenueStaff[]>>(`/api/venues/${venueId}/staff`),
    add: (venueId: string | number, body: { email: string; role: VenueStaffRole }) =>
      apiRequest<ApiResponse<VenueStaff>>(`/api/venues/${venueId}/staff`, { method: "POST", body: JSON.stringify(body) }),
    remove: (venueId: string | number, staffId: string | number) =>
      apiRequest<ApiResponse<unknown>>(`/api/venues/${venueId}/staff/${staffId}`, { method: "DELETE" }),
  },
};

export const fetchVenues = async (filters: VenueFilters = {}) => api.venues.list(filters);
export const fetchVenueById = async (id: string | number) => unwrap(await api.venues.detail(id));

export function getVenueImage(venue: Venue) {
  const cover = venue.images?.find((image) => image.isCover) ?? venue.images?.[0];
  return cover?.imageUrl ?? "";
}

export function getVenueSportName(venue: Venue) {
  return venue.sports?.[0]?.name ?? "Thể thao";
}

export function getVenueAmenityNames(venue: Venue) {
  return (venue.amenities ?? []).map((amenity) => (typeof amenity === "string" ? amenity : amenity.name));
}

export function getVenuePriceLabel() {
  return "Xem bảng giá";
}
