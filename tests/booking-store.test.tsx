import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { initialBookingDraft, useBookingStore } from '@/stores/booking-store';

describe('booking checkout store', () => {
  beforeEach(() => {
    useBookingStore.getState().reset();
  });

  it('updates the checkout draft without discarding existing selections', () => {
    act(() => {
      useBookingStore.getState().updateDraft({
        venueName: 'Sân cầu lông Phú Nhuận',
        courtName: 'Court A',
        date: '2026-06-24',
        timeSlots: ['18:00 - 19:00'],
        total: 180000,
      });
      useBookingStore.getState().updateDraft({
        contactName: 'Nguyễn An',
        contactPhone: '0901234567',
      });
    });

    expect(useBookingStore.getState().draft).toMatchObject({
      venueName: 'Sân cầu lông Phú Nhuận',
      courtName: 'Court A',
      timeSlots: ['18:00 - 19:00'],
      contactName: 'Nguyễn An',
      contactPhone: '0901234567',
      total: 180000,
    });
  });

  it('resets the draft to its initial checkout state', () => {
    act(() => {
      useBookingStore.getState().updateDraft({ venueName: 'Sân đã chọn', total: 250000 });
      useBookingStore.getState().reset();
    });

    expect(useBookingStore.getState().draft).toEqual(initialBookingDraft);
  });
});
