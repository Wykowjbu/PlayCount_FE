# FE API Audit

Date: 2026-06-29

OpenAPI source: `http://localhost:5187/swagger/v1/swagger.json`

Exported contract: `docs/openapi-playcourt.json`

## Endpoint Coverage

| Group | Operations in Swagger | FE API layer | Status |
|---|---:|---|---|
| Auth | 7 | `api.auth` | Real |
| Users | 6 | `api.users` | Real |
| Sports | 5 | `api.sports` | Real |
| Amenities | 5 | `api.amenities` | Real |
| Venues | 21 | `api.venues` | Real |
| Courts | 5 | `api.courts` | Real |
| CourtSchedules | 3 | `api.schedules`, `api.courts.schedules` | Real |
| PricingRules | 4 | `api.pricingRules`, `api.courts.pricingRules` | Real |
| CourtOwners | 3 | `api.courtOwners` | Real |
| Bookings | 10 | `api.bookings` | Real |
| Matches | 15 | `api.matches` | Real |
| Reviews | 12 | `api.reviews` | Real |
| VenueStaffs | 3 | `api.venueStaff` | Real |

## Route Mapping

| Feature | Route FE | File | Status | API BE | Role | Gap | Action |
|---|---|---|---|---|---|---|---|
| Home venue preview | `/` | `src/app/(public)/page.tsx` | Real | `GET /api/Venues`, `GET /api/Sports` | Public | None known | Keep |
| Venue search | `/venues` | `src/app/(public)/venues/page.tsx` | Real | `GET /api/Venues`, `GET /api/Sports` | Public | None known | Connected |
| Venue detail | `/venues/[id]` | `src/app/(public)/venues/[id]/client-page.tsx` | Real | venue detail, courts, pricing, schedules, availability, reviews, stats | Public/Player | Booking requires Player | Connected |
| Login | `/login` | `src/app/(auth)/login/page.tsx` | Real | `POST /api/Auth/login` | Guest | None known | Guarded |
| Register | `/register` | `src/app/(auth)/register/page.tsx` | Real | `POST /api/Auth/register` | Guest | Owner role must be `CourtOwner` | Fixed |
| Verify email | `/verify-email` | `src/app/(auth)/verify-email/page.tsx` | Real | verify/resend email | Guest | None known | Keep |
| Forgot/reset password | `/forgot-password` | `src/app/(auth)/forgot-password/page.tsx` | Real | forgot/reset password | Guest | None known | Keep |
| Player profile | `/profile` | `src/app/(player)/profile/client-page.tsx` | Partial | users, player sports, bookings, matches search, favorites | Player | No dedicated player stats/my-matches endpoint | Derived from real APIs |
| Booking checkout | `/bookings/checkout` | `src/app/(player)/bookings/checkout/page.tsx` | Real | `POST /api/Bookings` | Player | No Payment API | Payment UI disabled |
| Booking detail | `/bookings/[id]` | `src/app/(player)/bookings/[id]/client-page.tsx` | Real | booking detail, cancel, create review | Player | No payment/refund status | Payment copy removed |
| Match search | `/matches` | `src/app/(player)/matches/page.tsx` | Real | search, recommended | Player | Filter set is limited to Swagger | Connected |
| Match detail | `/matches/[id]` | `src/app/(player)/matches/[id]/client-page.tsx` | Real | detail, join/cancel/leave, host join request actions | Player | No kick/cancel invite/complete match | Connected where supported |
| Match create | `/matches/create` | `src/app/(player)/matches/create/page.tsx` | Real | `POST /api/Matches` | Player | Court search picker not present | Uses court id input |
| Owner dashboard | `/owner/dashboard` | `src/app/owner/dashboard/page.tsx` | Partial | venue stats | CourtOwner | Revenue depends on BE fields | Keep conservative |
| Owner calendar | `/owner/calendar` | `src/app/owner/calendar/page.tsx` | Real | venue bookings, courts, confirm/reject/complete | CourtOwner | No calendar aggregate endpoint | Fetches selected venue |
| Owner venues | `/owner/venues` | `src/app/owner/venues/page.tsx` | Real | venue/court/pricing/schedule/image/amenity/opening-hours | CourtOwner | Large component, not split | Connected |
| Owner venue staff | `/owner/venues/[id]/staff` | `src/app/owner/venues/[id]/staff/page.tsx` | Real | list/add/remove staff | CourtOwner | No update-role endpoint | Added route |
| Owner onboarding/KYC | `/owner/onboarding` | `src/app/owner/onboarding/page.tsx` | Blocked | no owner self-update KYC endpoint confirmed | CourtOwner | No upload/self-submit API | See blockers |
| Admin sports | `/admin/sports` | `src/app/admin/sports/page.tsx` | Real | sports CRUD/toggle | Admin | None known | Keep |
| Admin amenities | `/admin/amenities` | `src/app/admin/amenities/page.tsx` | Real | amenities CRUD | Admin | Delete may fail if used by venue | Surface API errors |
| Admin KYC | `/admin/kyc` | `src/app/admin/kyc/page.tsx` | Real | court-owner list/detail/status | Admin | None known | Keep |
| Admin moderation | `/admin/moderation` | `src/app/admin/moderation/page.tsx` | Real | admin venue list/detail/status | Admin | Review queue not listable | Keep venue moderation only |
| 403 | `/403` | `src/app/403/page.tsx` | Real | none | All | None | Used by guard |

## Mock Scan

Command:

```powershell
rg -n "mock|MOCK_|dummy|fake|fixture|sample|setTimeout|Promise\.resolve|Math\.random|console\.log|Coming soon|reviewer mode|hardcoded|thanh toán thành công|Thanh toán đã xác nhận|generateStaticParams|alert\(" src
```

Result after cleanup: no matches in `src`.

## Guard Matrix

| Route family | Allowed role |
|---|---|
| `/`, `/venues`, `/venues/[id]`, auth routes | Public/Guest |
| `/profile`, `/bookings/*`, `/matches/*` | Player |
| `/owner/*` | CourtOwner |
| `/admin/*` | Admin |

