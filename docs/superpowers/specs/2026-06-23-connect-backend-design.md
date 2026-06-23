# PlayCourt Backend Connection Design

## Goal

Connect the PlayCourt frontend to every API currently exposed by the .NET backend while preserving frontend mock data for domains that the backend does not yet expose.

## Confirmed Backend Contract

The backend returns `ApiResponse<T>` envelopes with `success`, `message`, `data`, and `errors` fields. The exposed controllers are:

- `POST /api/auth/register`, `login`, `verify-email`, `resend-verify-email`, `forgot-password`, `reset-password`, and `change-password`.
- `GET/PUT /api/users/me`, authenticated with the JWT access token.
- `GET /api/sports`, `GET /api/sports/{id}`, plus Admin-only create, update, and active-state actions.

Venue, court, booking, pricing, KYC, matchmaking, and moderation controllers are not currently public in the backend. Their existing frontend mocks remain the intentional fallback.

## Architecture

`src/lib/api/http.ts` will own request construction, JSON parsing, envelope unwrapping, JWT attachment, and normalized API errors. Domain modules (`auth.ts`, `users.ts`, `sports.ts`) will expose typed methods only; React UI will not call `fetch` directly.

`src/stores/auth-store.ts` will retain the authenticated session in browser storage: access token, expiry, and user summary. It clears itself on logout or an unauthorized response. A small provider/hook surface will let UI read session state without coupling components to HTTP details.

The API base URL comes from `NEXT_PUBLIC_API_BASE_URL`, with `http://localhost:5187/api` as the local-development fallback. This keeps GitHub Pages deployment functional: pages without an available API retain mock content, and authenticated actions report a clear connection error instead of silently pretending to succeed.

## UI Integration

- Add sign-in/register entry points and a profile/session indicator to the player header.
- Replace static sports choices in search, match creation, and owner venue settings with the Sports API when it is reachable; use the existing fixed choices only after a recoverable API failure.
- Add an account page/control for reading and updating `/users/me`.
- Gate Admin Sport management actions on the authenticated role supplied by the login response.

## Error Handling

The HTTP layer turns non-success envelopes, malformed JSON, timeouts, and network errors into one `ApiClientError` shape. Forms display the backend message and individual validation errors. `401` clears the stored session and sends users to sign in; `403` leaves the session intact and presents an authorization message.

## Testing

Tests use mocked `fetch` at the HTTP boundary to verify envelope parsing, Authorization headers, and error normalization. Store tests cover persistence/logout. Component tests verify fallback sports rendering and API-error feedback.

## Non-goals

This change does not invent endpoints or submit mock booking/KYC/match data to the backend. Those screens remain mock-backed until corresponding controllers are exposed.
