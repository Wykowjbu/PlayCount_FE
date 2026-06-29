import { Suspense } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CheckoutPage from '@/app/(player)/bookings/checkout/page';
import BookingDetailPage from '@/app/(player)/bookings/[id]/page';

describe('booking pages', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows checkout as unsupported while Booking/Payment APIs are missing', () => {
    render(<CheckoutPage />);
    expect(screen.getByRole('heading', { name: /booking chưa có api/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /thanh toán/i })).not.toBeInTheDocument();
  });

  it('copies the booking code and asks for cancellation confirmation', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });

    const params = Promise.resolve({ id: 'BK-20260624' });
    await act(async () => {
      render(<Suspense fallback="Đang tải"><BookingDetailPage params={params} /></Suspense>);
      await params;
    });

    await user.click(await screen.findByRole('button', { name: /sao chép mã đơn/i }));
    expect(writeText).toHaveBeenCalledWith('BK-20260624');

    await user.click(screen.getByRole('button', { name: /hủy đặt sân/i }));
    expect(screen.getByRole('dialog', { name: /xác nhận hủy/i })).toBeInTheDocument();
  });
});
