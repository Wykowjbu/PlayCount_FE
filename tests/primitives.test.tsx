import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/playcourt/button';
import { Input } from '@/components/playcourt/input';
import { StatusBadge } from '@/components/playcourt/status-badge';
import { VenueCard } from '@/components/playcourt/venue-card';
import { MatchCard } from '@/components/playcourt/match-card';


describe('Button Primitive Tests', () => {
  it('renders MarketingPrimary variant correctly with pill shape and ink theme classes/styles', () => {
    render(<Button variant="MarketingPrimary">Marketing</Button>);
    const button = screen.getByRole('button', { name: /marketing/i });
    expect(button).toBeInTheDocument();
    // Mong đợi chứa các class hoặc style liên quan đến pill shape (rounded-full) và ink background
    expect(button.className).toContain('rounded-full');
    expect(button.className).toContain('bg-[var(--pc-ink)]');
  });

  it('renders AppPrimary variant with 6px rounded and green-800 background', () => {
    render(<Button variant="AppPrimary">App Primary</Button>);
    const button = screen.getByRole('button', { name: /app primary/i });
    expect(button.className).toContain('rounded-[6px]');
    expect(button.className).toContain('bg-[var(--pc-green-800)]');
  });

  it('renders CommitPrimary variant with green-800 background, 6px rounded and interactive element for ripple', () => {
    render(<Button variant="CommitPrimary">Commit Primary</Button>);
    const button = screen.getByRole('button', { name: /commit primary/i });
    expect(button.className).toContain('rounded-[6px]');
    expect(button.className).toContain('bg-[var(--pc-green-800)]');
    expect(button.className).toContain('relative'); // Cần cho ripple container
    expect(button.className).toContain('overflow-hidden');
  });

  it('renders Secondary variant with outline styling', () => {
    render(<Button variant="Secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: /secondary/i });
    expect(button.className).toContain('border');
    expect(button.className).toContain('border-[var(--pc-hairline)]');
  });

  it('renders Danger variant with error background styling', () => {
    render(<Button variant="Danger">Danger</Button>);
    const button = screen.getByRole('button', { name: /danger/i });
    expect(button.className).toContain('bg-[var(--pc-error)]');
  });
});

describe('Input Primitive Tests', () => {
  it('renders wrapper label, input element and supports forwardRef', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input label="Test Label" ref={ref} placeholder="Enter text" />);
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(ref.current).toBe(input);
  });

  it('applies error classes and configures aria-describedby when error prop is provided', () => {
    render(<Input placeholder="Enter text" error="This field is required" id="test-input" />);
    const input = screen.getByPlaceholderText('Enter text');
    
    expect(input.className).toContain('border-[var(--pc-error)]');
    expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveAttribute('id', 'test-input-error');
  });

  it('has green ring class on focus', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input.className).toContain('focus-visible:ring-[var(--pc-green-600)]');
  });
});

describe('StatusBadge Primitive Tests', () => {
  it('renders green badge for confirmed, paid, verified statuses', () => {
    const { rerender } = render(<StatusBadge status="confirmed" />);
    let badge = screen.getByText('confirmed');
    expect(badge.className).toContain('bg-[var(--pc-green-100)]');
    expect(badge.className).toContain('text-[var(--pc-green-900)]');

    rerender(<StatusBadge status="paid" />);
    badge = screen.getByText('paid');
    expect(badge.className).toContain('bg-[var(--pc-green-100)]');
    expect(badge.className).toContain('text-[var(--pc-green-900)]');

    rerender(<StatusBadge status="verified" />);
    badge = screen.getByText('verified');
    expect(badge.className).toContain('bg-[var(--pc-green-100)]');
    expect(badge.className).toContain('text-[var(--pc-green-900)]');
  });

  it('renders warning badge for pending, needs action statuses', () => {
    const { rerender } = render(<StatusBadge status="pending" />);
    let badge = screen.getByText('pending');
    expect(badge.className).toContain('bg-[var(--pc-warning-soft)]');
    expect(badge.className).toContain('text-[var(--pc-warning-deep)]');

    rerender(<StatusBadge status="needs action" />);
    badge = screen.getByText('needs action');
    expect(badge.className).toContain('bg-[var(--pc-warning-soft)]');
    expect(badge.className).toContain('text-[var(--pc-warning-deep)]');
  });

  it('renders error badge for failed, rejected, cancelled statuses', () => {
    const { rerender } = render(<StatusBadge status="failed" />);
    let badge = screen.getByText('failed');
    expect(badge.className).toContain('bg-[#fee2e2]');
    expect(badge.className).toContain('text-[var(--pc-error-deep)]');

    rerender(<StatusBadge status="rejected" />);
    badge = screen.getByText('rejected');
    expect(badge.className).toContain('bg-[#fee2e2]');
    expect(badge.className).toContain('text-[var(--pc-error-deep)]');
  });

  it('renders soft badge for draft, completed statuses', () => {
    const { rerender } = render(<StatusBadge status="draft" />);
    let badge = screen.getByText('draft');
    expect(badge.className).toContain('bg-[var(--pc-hairline-soft)]');
    expect(badge.className).toContain('text-[var(--pc-body)]');

    rerender(<StatusBadge status="completed" />);
    badge = screen.getByText('completed');
    expect(badge.className).toContain('bg-[var(--pc-hairline-soft)]');
    expect(badge.className).toContain('text-[var(--pc-body)]');
  });
});

describe('VenueCard Business Card Tests', () => {
  it('renders venue information correctly: name, rating, nearest slot and button', () => {
    const onScheduleClick = vi.fn();
    render(
      <VenueCard
        name="Sân Cầu Lông Kỳ Hòa"
        image="https://example.com/image.jpg"
        sport="Badminton"
        rating={4.8}
        nearestSlot="18:00 - 20:00 Hôm nay"
        onScheduleClick={onScheduleClick}
      />
    );

    expect(screen.getByText('Sân Cầu Lông Kỳ Hòa')).toBeInTheDocument();
    expect(screen.getByText('Badminton')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('18:00 - 20:00 Hôm nay')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /xem lịch/i });
    expect(button).toBeInTheDocument();
    button.click();
    expect(onScheduleClick).toHaveBeenCalledTimes(1);
  });
});

describe('MatchCard Business Card Tests', () => {
  it('renders match information: title, sport, date, participants avatar group and status badge', () => {
    const participants = [
      { id: '1', name: 'Nguyễn Văn A', avatar: 'https://example.com/a.jpg' },
      { id: '2', name: 'Trần Thị B' },
      { id: '3', name: 'Lê Văn C' },
    ];
    const onJoinClick = vi.fn();

    render(
      <MatchCard
        title="Giao lưu Tennis cuối tuần"
        sport="Tennis"
        dateTime="Thứ Bảy, 15:00"
        participants={participants}
        status="pending"
        maxParticipants={4}
        onJoinClick={onJoinClick}
      />
    );

    expect(screen.getByText('Giao lưu Tennis cuối tuần')).toBeInTheDocument();
    expect(screen.getByText('Tennis')).toBeInTheDocument();
    expect(screen.getByText('Thứ Bảy, 15:00')).toBeInTheDocument();
    expect(screen.getByText('3/4')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();


    // Check fallback avatar for Tran Thi B (renders "T" text)
    expect(screen.getByText('T')).toBeInTheDocument();

    const joinBtn = screen.getByRole('button', { name: /tham gia/i });
    expect(joinBtn).toBeInTheDocument();
    joinBtn.click();
    expect(onJoinClick).toHaveBeenCalledTimes(1);
  });
});

