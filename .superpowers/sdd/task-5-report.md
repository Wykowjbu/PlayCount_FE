# Task 5 Report: Player Phase - Venue Detail & Court Slot Picker

## Files Changed
- `src/lib/api/client.ts`: Added the `fetchVenueById(id: string)` API client helper with offline mock fallback.
- `src/components/playcourt/slot-picker.tsx`: Court Slot Picker grid exhibiting time rows (06:00 to 22:00) and court columns. It handles busy states (repeating stripes, disabled cursor), hover states, selection states, selection summary details, total calculations, and "Tiếp tục" CTA.
- `src/app/(public)/venues/[id]/page.tsx`: Venue Details page featuring a Framer Motion image carousel with thumbnails overlay, an Accordion-based cancellation policy, amenities checklist, star ratings list, sticky booking sidebar panel, and smooth scrolling target grid integration.
- `tests/slot-picker.test.tsx`: 4 unit tests verifying correct header rendering, select toggle handlers, busy state locks, and total price calculation updates.

## Testing Evidence
Vitest test suite execution result:
```bash
npx vitest run
```
Output:
```
 ✓ tests/api.test.tsx (4 tests) 27ms
 ✓ tests/providers.test.tsx (2 tests) 77ms
 ✓ tests/date-picker.test.tsx (4 tests) 749ms
 ✓ tests/slot-picker.test.tsx (4 tests) 438ms
 ✓ tests/primitives.test.tsx (14 tests) 420ms
 ✓ tests/layouts.test.tsx (10 tests) 552ms

 Test Files  6 passed (6)
      Tests  38 passed (38)
   Start at  11:55:42
   Duration  4.40s
```

## Self-Review Findings
1. **Next.js 15/16 Params Promise**: Since dynamic page params are treated as a Promise in Next.js 15/16, successfully consumed the `params` via React's `use(params)` hook in client-side component code.
2. **Carousel Transitions**: Enabled smooth image fade animations with `AnimatePresence` and `motion.img` from `'motion/react'`.
3. **Accessibility Controls**: Wrapped the image carousel's prev/next buttons inside Radix `Tooltip` components with explicit `aria-label="Ảnh trước"` and `aria-label="Ảnh sau"` settings.
4. **Grid Status Styling**: Used repeating linear gradients (`repeating-linear-gradient(45deg, ...)`) to render peak-hour busy slots in visual grid patterns.

## Commit Information
- SHA: `359d10a`
- Subject: `feat: implement Venue Detail page and Court Slot Picker grid`

## Review Fixes Applied
1. **Quick Slots List in BookingPanel**:
   - Added a "Danh sách slot nhanh" (Quick Slots List) component inside the sticky booking panel.
   - Users can now click quick slot buttons to directly select/deselect slots, which syncs instantly with the main grid.
   - Displayed selected slots summary details and calculated total price in real-time within the sticky sidebar itself.
2. **Tailwind Dynamic Column Span Resolution**:
   - Removed dynamic compile-time template strings `col-span-${colSpan}` in `slot-picker.tsx`.
   - Used standard inline styles `style={{ gridColumn: 'span ' + colSpan + ' / span ' + colSpan }}` to safely support dynamic court counts.
3. **Accessibility and Code Cleanup**:
   - Added `aria-label` attribute on the slot buttons describing court name, time slot, and price/busy status.
   - Extracted static configuration arrays (`COURT_NAMES`, `TIME_SLOTS`, and `MOCK_REVIEWS`) outside the component to prevent unnecessary memory allocations on re-renders.
   - Wrapped calculations in `useMemo` for slots, selected slots, and total price calculation updates.
   - Updated `tests/slot-picker.test.tsx` to add a test validating correct rendering of descriptive `aria-label` values.
