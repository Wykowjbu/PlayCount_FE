# Task 4 Report: Player Phase - Home & Search Venue Screen

## Files Changed
- `src/lib/api/client.ts`: Client API wrapper connecting to the backend at `http://localhost:5187` with an automated client-side filter fallback using `MOCK_VENUES` if the backend is offline.
- `src/components/playcourt/date-picker.tsx`: Custom DatePicker component powered by `@radix-ui/react-popover` and built on a custom calendar grid with Vietnamese day names. Selected date uses the `bg-[var(--pc-green-800)] text-white` classes.
- `src/components/playcourt/venue-card.tsx`: Refactored to support a new `layout?: 'grid' | 'wide'` prop. The wide layout styles cards horizontally on desktop (`md:flex-row`).
- `src/app/(public)/page.tsx`: Home screen showcasing a premium dark-themed Hero section with neon green accents, Vercel mesh gradient background, a quick search form (Location, Sport dropdown, DatePicker, Search CTA), and recommended/suggested venues.
- `src/app/(public)/venues/page.tsx`: Search Venues screen featuring an inline search summary bar at the top, a Filter sidebar (Môn, Khoảng cách slider, Giá, Tiện ích checkboxes), and a list of results displaying wide VenueCards. Implemented responsive layout converting the sidebar to a bottom sheet drawer on mobile. Wrapped inside a `<Suspense>` boundary to safely resolve search parameters.
- `tests/api.test.tsx`: 4 unit tests verifying backend fetch requests, network error mock fallback, non-ok HTTP fallback, and multi-criteria local filtering logic.
- `tests/date-picker.test.tsx`: 4 unit tests verifying correct formatting, placeholder rendering, popover trigger interaction, and `onChange` callback execution.

## Testing Evidence
The entire test suite ran successfully via Vitest:
```bash
npx vitest run
```
Output:
```
 ✓ tests/api.test.tsx (4 tests) 38ms
 ✓ tests/date-picker.test.tsx (4 tests) 523ms
 ✓ tests/providers.test.tsx (2 tests) 61ms
 ✓ tests/layouts.test.tsx (10 tests) 426ms
 ✓ tests/primitives.test.tsx (14 tests) 295ms

 Test Files  5 passed (5)
      Tests  34 passed (34)
   Start at  11:50:48
   Duration  4.75s
```

## Self-Review Findings
1. **Windows Path Length & Symlinks Resolution**: During initial test executions, Vitest's `#module-evaluator` ESM import threw an `ERR_PACKAGE_IMPORT_NOT_DEFINED` error due to Windows directory junctions and long paths (over 260 characters). Resolved this elegantly by utilizing `pnpm install --node-linker=hoisted` to flatten the `node_modules` structure and prevent symlink traversal bugs in Node.js.
2. **Next.js Suspense Constraint**: Followed Next.js best practices by wrapping the main search content in a `<Suspense>` boundary. This avoids hydration and compiler de-optimization issues since the page relies on `useSearchParams()`.
3. **UX & Premium Aesthetics**: Created a high-end dark mesh gradient Hero section. Responsive sidebar filter transitions beautifully into a drawer bottom-sheet on mobile devices.
4. **DatePicker Formatting**: Formatted selected date as `DD/MM/YYYY` in the display field and correctly highlighted current/selected days.

## Commit Information
- SHA: `7f99e6b`
- Subject: `feat: complete Home and Search Venues screen with filters`

## Accessibility and Design Token Alignment Fixes (Task Review Updates)
Following reviewer feedback, the following fixes were implemented:

1. **Accessibility (Icon-Only Controls)**:
   - Wrapped the previous and next month change buttons in [date-picker.tsx](file:///C:/Users/hantu/.gemini/antigravity-cli/brain/0121db2e-86e2-41dc-8664-757f7c0ea692/.system_generated/worktrees/subagent-Player-Flow-Developer-self-d82a8dd0/src/components/playcourt/date-picker.tsx) inside Radix Tooltip components with explicit `aria-label="Tháng trước"` and `aria-label="Tháng sau"`.
   - Wrapped the mobile filter close drawer button (X icon) in [venues/page.tsx](file:///C:/Users/hantu/.gemini/antigravity-cli/brain/0121db2e-86e2-41dc-8664-757f7c0ea692/.system_generated/worktrees/subagent-Player-Flow-Developer-self-d82a8dd0/src/app/(public)/venues/page.tsx) inside a Radix Tooltip component with `aria-label="Đóng bộ lọc"`.
   - Setup global JSDOM Mock for `ResizeObserver` in `tests/setup.ts` to prevent Radix Tooltip rendering tests from throwing reference errors in test runs.

2. **Typography (Geist Mono for Labels/Eyebrows)**:
   - Applied `font-mono` to the search form labels "Khu vực" and "Môn thể thao" in [page.tsx](file:///C:/Users/hantu/.gemini/antigravity-cli/brain/0121db2e-86e2-41dc-8664-757f7c0ea692/.system_generated/worktrees/subagent-Player-Flow-Developer-self-d82a8dd0/src/app/(public)/page.tsx).
   - Applied `font-mono` to the `DatePicker` input label in [date-picker.tsx](file:///C:/Users/hantu/.gemini/antigravity-cli/brain/0121db2e-86e2-41dc-8664-757f7c0ea692/.system_generated/worktrees/subagent-Player-Flow-Developer-self-d82a8dd0/src/components/playcourt/date-picker.tsx).
   - Applied `font-mono` to the sidebar filter headings ("Môn thể thao", "Khoảng cách tối đa", "Khoảng giá", "Tiện ích") and the search status text ("Tìm thấy X sân phù hợp") in [venues/page.tsx](file:///C:/Users/hantu/.gemini/antigravity-cli/brain/0121db2e-86e2-41dc-8664-757f7c0ea692/.system_generated/worktrees/subagent-Player-Flow-Developer-self-d82a8dd0/src/app/(public)/venues/page.tsx).

3. **Border Radius & Shadows**:
   - Adjusted [date-picker.tsx](file:///C:/Users/hantu/.gemini/antigravity-cli/brain/0121db2e-86e2-41dc-8664-757f7c0ea692/.system_generated/worktrees/subagent-Player-Flow-Developer-self-d82a8dd0/src/components/playcourt/date-picker.tsx) popover panel radius to `rounded-[16px]` and updated its shadow to `shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)]`.
   - Adjusted mobile bottom-sheet filter drawer radius to `rounded-t-[16px]` and updated its shadow to a light floating shadow with a hairline border (`shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)] border-t border-[var(--pc-hairline)]`) in [venues/page.tsx](file:///C:/Users/hantu/.gemini/antigravity-cli/brain/0121db2e-86e2-41dc-8664-757f7c0ea692/.system_generated/worktrees/subagent-Player-Flow-Developer-self-d82a8dd0/src/app/(public)/venues/page.tsx).

4. **Minor Cleanup**:
   - Updated the `onScheduleClick` on `VenueCard` inside the search results from an alert to a Next.js router transition: `router.push("/venues/" + venue.id)`.

## Verification
- Ran the test suite via Vitest successfully: All 34 tests in 5 files passed.
- Commit hash: `f211d30`

