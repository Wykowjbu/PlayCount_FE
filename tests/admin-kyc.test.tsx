import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AdminKycPage from '@/app/admin/kyc/page';

describe('admin KYC actions', () => {
  it('sends the selected approval action for a KYC profile', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<AdminKycPage onAction={onAction} />);

    await user.click(screen.getByRole('button', { name: /duyệt hồ sơ/i }));
    expect(onAction).toHaveBeenCalledWith('kyc-001', 'approved');
  });
});
