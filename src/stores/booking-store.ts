import { create } from 'zustand';

export interface BookingDraft {
  venueName: string;
  courtName: string;
  date: string;
  timeSlots: string[];
  total: number;
  contactName: string;
  contactPhone: string;
  note: string;
  paymentMethod: 'card' | 'wallet' | 'bank-transfer';
}

export const initialBookingDraft: BookingDraft = {
  venueName: '',
  courtName: '',
  date: '',
  timeSlots: [],
  total: 0,
  contactName: '',
  contactPhone: '',
  note: '',
  paymentMethod: 'card',
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
