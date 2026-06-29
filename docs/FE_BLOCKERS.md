# FE Blockers

Date: 2026-06-29

These are backend/product gaps observed from live Swagger and DTO/controller audit. FE does not fake these flows.

| Area | Blocker | FE action |
|---|---|---|
| Payment | No Payment API/provider callback/refund/payout endpoints in Swagger. | Checkout creates booking only; payment status UI removed. |
| Notification | No Notification controller/API in Swagger. | Header shows empty unsupported state and no badge count. |
| Match | No complete match endpoint. | Host cancel/update/join-request flows only. |
| Match | No host cancel-invitation endpoint. | Invitation cancellation UI not added. |
| Match | No kick participant endpoint. | Kick UI not added. |
| Match | No dedicated my-hosted/my-joined endpoint. | Profile history derives from real search response flags when available. |
| Reviews | No list reported reviews endpoint. | Admin review moderation queue not added; only moderate-by-id API exists. |
| Venue staff | No update-role endpoint and no dedicated `Staff` user role in auth role set. | Staff page supports add/list/remove only. |
| Owner KYC | No owner self-update/upload KYC endpoint confirmed in Swagger. | Owner onboarding cannot submit local success state. |
| Avatar upload | Profile update accepts `avatarUrl`; no upload endpoint. | Profile uses URL input only. |
| Static export | GitHub Pages static export with runtime dynamic API routes can break refresh/deep links and cannot call localhost in production. | Runtime deployment or client-shell route strategy still needs product decision. |

