import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminKycPage from '@/app/admin/kyc/page';
import { api } from '@/lib/api/client';

describe('admin KYC actions', () => {
  beforeEach(() => {
    vi.spyOn(api.courtOwners, 'list').mockResolvedValue({
      success: true,
      message: 'ok',
      data: [{ id: 'owner-1', fullName: 'Nguyễn An', email: 'a@example.com', businessName: 'PlayCourt', verificationStatus: 0 }],
      errors: [],
    });
    vi.spyOn(api.courtOwners, 'updateStatus').mockResolvedValue({
      success: true,
      message: 'ok',
      data: null,
      errors: [],
    });
  });

  it('approves a court owner through the real API service', async () => {
    const user = userEvent.setup();
    render(<AdminKycPage />);

    await user.click(await screen.findByRole('button', { name: /xem\/duyệt/i }));
    await user.click(screen.getByRole('button', { name: /^duyệt$/i }));

    await waitFor(() => expect(api.courtOwners.updateStatus).toHaveBeenCalledWith('owner-1', { verificationStatus: 1, rejectionReason: null }));
  });
});
