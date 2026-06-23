import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import CreateMatchPage from '@/app/(player)/matches/create/page';

describe('create match wizard', () => {
  it('requires a sport before progressing from the first step', async () => {
    const user = userEvent.setup();
    render(<CreateMatchPage />);

    await user.click(screen.getByRole('button', { name: /tiếp tục/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/chọn môn thể thao/i);

    await user.click(screen.getByRole('button', { name: 'Cầu lông' }));
    await user.click(screen.getByRole('button', { name: /tiếp tục/i }));
    expect(screen.getByRole('heading', { name: /bước 2: sân & giờ/i })).toBeInTheDocument();
  });
});
