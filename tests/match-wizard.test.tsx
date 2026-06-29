import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CreateMatchPage from '@/app/(player)/matches/create/page';

describe('create match wizard', () => {
  it('is blocked until Match APIs exist', () => {
    render(<CreateMatchPage />);
    expect(screen.getByRole('heading', { name: /chưa hỗ trợ tạo trận/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /đăng trận|tiếp tục/i })).not.toBeInTheDocument();
  });
});
