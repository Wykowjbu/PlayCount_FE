import { describe, expect, it } from 'vitest';
import { hasPricingOverlap } from '@/lib/pricing-rules';

describe('pricing rule overlap validation', () => {
  it('detects overlapping time windows on the same weekday', () => {
    expect(hasPricingOverlap(
      [{ days: ['mon'], startTime: '17:00', endTime: '20:00' }],
      { days: ['mon', 'wed'], startTime: '19:00', endTime: '21:00' },
    )).toBe(true);
  });

  it('allows adjacent or different weekday pricing rules', () => {
    expect(hasPricingOverlap(
      [{ days: ['mon'], startTime: '17:00', endTime: '20:00' }],
      { days: ['tue'], startTime: '20:00', endTime: '22:00' },
    )).toBe(false);
  });
});
