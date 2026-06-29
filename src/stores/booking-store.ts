import { create } from 'zustand';

export interface BookingDraft {
  venueId: number | null;
  courtId: number | null;
  venueName: string;
  courtName: string;
  startAt: string;
  endAt: string;
  estimatedPrice: number | null;
  note: string;
}

export const initialBookingDraft: BookingDraft = {
  venueId: null,
  courtId: null,
  venueName: '',
  courtName: '',
  startAt: '',
  endAt: '',
  estimatedPrice: null,
  note: '',
};

interface BookingStore {
  draft: BookingDraft;
  updateDraft: (changes: Partial<BookingDraft>) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  draft: initialBookingDraft,
  updateDraft: (changes) => set((state) => ({ draft: { ...state.draft, ...changes } })),
  reset: () => set({ draft: initialBookingDraft }),
}));
