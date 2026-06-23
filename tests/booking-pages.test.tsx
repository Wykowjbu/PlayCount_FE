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

  it('disables the payment action after checkout submission', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);

    await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn An');
    await user.type(screen.getByLabelText('Số điện thoại'), '0901234567');
    await user.click(screen.getByRole('checkbox'));
    const submitButton = screen.getByRole('button', { name: /thanh toán/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/đang xử lý/i)).toBeInTheDocument();
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
