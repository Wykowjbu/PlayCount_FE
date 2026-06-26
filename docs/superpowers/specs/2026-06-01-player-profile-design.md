# Player Profile Design Spec

## Overview

Màn hình Player Profile cho phép người chơi xem và chỉnh sửa thông tin cá nhân, theo dõi lịch sử booking/match, và xem thống kê hoạt động.

**Route**: `/player/profile`  
**Layout**: Player layout với header/mobile nav  
**Access**: Authenticated players only

## Architecture

Single-page với Tabs component (shadcn/ui) chia 4 sections:
1. **Thông tin cá nhân** - Edit profile form + avatar upload
2. **Lịch sử booking** - Table với filter status + pagination
3. **Lịch sử match** - Table với filter + pagination
4. **Thống kê** - Stats cards (số trận, giờ chơi, sân yêu thích)

Data fetching dùng React Query với separate queries cho mỗi tab (lazy load khi user click vào tab).

## Components Structure

```
src/app/(player)/profile/
  page.tsx              # Server component, metadata
  client-page.tsx       # Client component chứa Tabs
  
src/components/player/profile/
  profile-info-tab.tsx        # Tab 1: Form edit + avatar
  bookings-history-tab.tsx    # Tab 2: Bookings table
  matches-history-tab.tsx     # Tab 3: Matches table
  stats-tab.tsx               # Tab 4: Stats cards
```

## API Integration

Cần endpoints từ BE:

### 1. Get Player Profile
```
GET /api/players/me
Response: {
  id: string
  name: string
  email: string
  phone: string
  avatar: string | null
  createdAt: string
}
```

### 2. Update Player Profile
```
PUT /api/players/me
Body: {
  name?: string
  phone?: string
}
Response: { success: true, player: {...} }
```

### 3. Upload Avatar
```
POST /api/players/me/avatar
Content-Type: multipart/form-data
Body: FormData with 'file' field
Response: { avatarUrl: string }
```

### 4. Get Booking History
```
GET /api/players/me/bookings?page=1&limit=10&status=all
Query params:
  - page: number (default 1)
  - limit: number (default 10)
  - status: 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
  
Response: {
  bookings: [{
    id: string
    venueId: string
    venueName: string
    courtName: string
    date: string
    startTime: string
    endTime: string
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    totalPrice: number
    createdAt: string
  }]
  total: number
  page: number
  totalPages: number
}
```

### 5. Get Match History
```
GET /api/players/me/matches?page=1&limit=10
Query params:
  - page: number (default 1)
  - limit: number (default 10)
  
Response: {
  matches: [{
    id: string
    title: string
    venueId: string
    venueName: string
    date: string
    startTime: string
    endTime: string
    currentPlayers: number
    maxPlayers: number
    status: 'open' | 'full' | 'completed' | 'cancelled'
    isCreator: boolean
    createdAt: string
  }]
  total: number
  page: number
  totalPages: number
}
```

### 6. Get Player Stats
```
GET /api/players/me/stats
Response: {
  totalMatches: number
  totalHoursPlayed: number
  favoriteVenue: {
    id: string
    name: string
    bookingCount: number
  } | null
  totalBookings: number
  completedBookings: number
}
```

## Tab 1: Thông tin cá nhân

**Layout:**
```
┌─────────────────────────────────────┐
│  [Avatar - 120x120 circle]          │
│  [Upload button overlays on hover]  │
│                                     │
│  Name:     [____________]           │
│  Email:    user@mail.com (disabled) │
│  Phone:    [____________]           │
│                                     │
│  [Hủy]  [Lưu thay đổi]             │
└─────────────────────────────────────┘
```

**Behavior:**
- Avatar default: user initials trên background màu
- Hover avatar → show "Upload ảnh" overlay
- Click → open file picker (accept image/png,image/jpeg,image/webp, max 5MB)
- Upload ngay khi chọn file (show loading spinner trên avatar)
- Form fields có validation:
  - Name: required, min 2 chars
  - Phone: required, format +84 hoặc 0xxxxxxxxx
- "Lưu thay đổi" disabled khi không có changes hoặc validation fail
- Success → show toast "Cập nhật thành công"
- Error → show toast với error message

## Tab 2: Lịch sử booking

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Filter: [All ▼] [Pending] [Confirmed] [...]   │
│                                                 │
│  ┌────────────────────────────────────────┐   │
│  │ Sân A - Venue ABC                       │   │
│  │ 15/06/2026 • 08:00 - 10:00             │   │
│  │ [Badge: Confirmed]      500,000đ        │   │
│  └────────────────────────────────────────┘   │
│                                                 │
│  [Pagination: < 1 2 3 >]                       │
└─────────────────────────────────────────────────┘
```

**Behavior:**
- Filter dropdown với options: All, Pending, Confirmed, Completed, Cancelled
- Click card → navigate to `/player/bookings/[id]`
- Show loading skeleton khi fetch
- Empty state: "Bạn chưa có booking nào"
- Pagination: 10 items/page

## Tab 3: Lịch sử match

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────┐   │
│  │ [Created by you badge]                  │   │
│  │ Match Title                             │   │
│  │ Venue ABC • 15/06/2026 • 18:00-20:00   │   │
│  │ 3/6 players • [Badge: Open]            │   │
│  └────────────────────────────────────────┘   │
│                                                 │
│  [Pagination: < 1 2 3 >]                       │
└─────────────────────────────────────────────────┘
```

**Behavior:**
- Show badge "Bạn tạo" nếu `isCreator === true`
- Click card → navigate to `/player/matches/[id]`
- Show loading skeleton khi fetch
- Empty state: "Bạn chưa tham gia match nào"
- Pagination: 10 items/page

## Tab 4: Thống kê

**Layout:**
```
┌─────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   24     │  │  48.5    │  │  Sân ABC │ │
│  │ Trận đấu │  │ Giờ chơi │  │ Yêu thích│ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
│  ┌────────────────────────────────────┐   │
│  │ Tổng booking: 18                    │   │
│  │ Hoàn thành: 15                      │   │
│  │ Tỷ lệ: 83.3%                       │   │
│  └────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Behavior:**
- Stats cards với icon + số + label
- Sân yêu thích: hiển thị tên venue, click → navigate to `/venues/[id]`
- Nếu chưa có data: show "Chưa có dữ liệu" placeholder

## Error Handling

- **Network error**: Toast "Không thể kết nối. Vui lòng thử lại"
- **401 Unauthorized**: Redirect to `/login` với returnUrl
- **Avatar upload fail**: Toast với message từ API, không clear avatar hiện tại
- **Form validation fail**: Hiển thị error message dưới field

## Responsive Design

**Desktop (>768px):**
- Tabs ngang phía trên content
- Form 2 columns cho desktop
- Table full width

**Mobile (<768px):**
- Tabs scrollable horizontal
- Form 1 column
- Cards stack vertical cho bookings/matches
- Stats cards 1 column

## Testing Checklist

- [ ] Load profile data success
- [ ] Edit name/phone success
- [ ] Upload avatar success (hiển thị preview ngay)
- [ ] Validation errors show correct
- [ ] Filter bookings by status
- [ ] Pagination works cho bookings/matches
- [ ] Navigate to booking/match/venue detail
- [ ] Stats display correct numbers
- [ ] Empty states render
- [ ] Error handling (network, 401, validation)
- [ ] Responsive trên mobile/desktop

## Implementation Notes

- Dùng `useForm` từ react-hook-form cho profile form
- Avatar upload: convert to base64 preview trước khi upload
- React Query:
  - `useQuery` với keys: `['player', 'me']`, `['player', 'bookings', { page, status }]`, etc.
  - `useMutation` cho update profile và upload avatar
  - Invalidate queries sau mutation success
- Tabs state: dùng `useState` local, không cần persist vào URL
- Format currency: `new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`
- Date format: dùng `date-fns` với locale vi

## Dependencies

- shadcn/ui: `Tabs`, `Button`, `Input`, `Avatar`, `Badge`, `Select`
- react-hook-form
- react-query
- date-fns
- lucide-react (icons)

## Global Constraints

- Next.js 14+ App Router
- TypeScript strict mode
- Tailwind CSS
- Mobile-first responsive
- Accessible (ARIA labels, keyboard navigation)
