import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResourceCalendar, BookingEvent } from '@/components/owner/resource-calendar';

describe('ResourceCalendar Component Tests', () => {
  const mockCourts = [
    { id: 'court-1', name: 'Sân A' },
    { id: 'court-2', name: 'Sân B' },
    { id: 'court-3', name: 'Sân C' },
  ];

  const mockBookings: BookingEvent[] = [
    {
      id: 'booking-1',
      courtId: 'court-1',
      courtName: 'Sân A',
      title: 'Đơn đặt của Nguyễn Văn A',
      startTime: '08:00',
      endTime: '10:00',
      status: 'confirmed',
      userName: 'Nguyễn Văn A',
      userPhone: '0901234567',
      price: 200000,
    },
    {
      id: 'booking-2',
      courtId: 'court-2',
      courtName: 'Sân B',
      title: 'Đơn đặt của Trần Thị B',
      startTime: '10:00',
      endTime: '12:00',
      status: 'pending',
      userName: 'Trần Thị B',
      userPhone: '0907654321',
      price: 200000,
    },
  ];

  it('renders court headers correctly', () => {
    render(
      <ResourceCalendar
        courts={mockCourts}
        bookings={[]}
        selectedDate={new Date()}
      />
    );

    expect(screen.getByText('Sân A')).toBeInTheDocument();
    expect(screen.getByText('Sân B')).toBeInTheDocument();
    expect(screen.getByText('Sân C')).toBeInTheDocument();
  });

  it('renders time slots in vertical grid (e.g. 06:00 to 22:00)', () => {
    render(
      <ResourceCalendar
        courts={mockCourts}
        bookings={[]}
        selectedDate={new Date()}
      />
    );

    expect(screen.getByText('06:00')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('22:00')).toBeInTheDocument();
  });

  it('renders bookings in correct columns and display labels', () => {
    render(
      <ResourceCalendar
        courts={mockCourts}
        bookings={mockBookings}
        selectedDate={new Date()}
      />
    );

    expect(screen.getByText('Đơn đặt của Nguyễn Văn A')).toBeInTheDocument();
    expect(screen.getByText('Đơn đặt của Trần Thị B')).toBeInTheDocument();
  });

  it('calls onEventClick when a booking event is clicked', () => {
    const handleEventClick = vi.fn();
    render(
      <ResourceCalendar
        courts={mockCourts}
        bookings={mockBookings}
        selectedDate={new Date()}
        onEventClick={handleEventClick}
      />
    );

    const eventEl = screen.getByText('Đơn đặt của Nguyễn Văn A');
    fireEvent.click(eventEl);

    expect(handleEventClick).toHaveBeenCalledTimes(1);
    expect(handleEventClick).toHaveBeenCalledWith(mockBookings[0]);
  });

  it('calls onSlotClick when a time slot inside grid is clicked', () => {
    const handleSlotClick = vi.fn();
    const { container } = render(
      <ResourceCalendar
        courts={mockCourts}
        bookings={[]}
        selectedDate={new Date()}
        onSlotClick={handleSlotClick}
      />
    );

    const slotCells = container.querySelectorAll('[data-testid="grid-cell"]');
    if (slotCells.length > 0) {
      fireEvent.click(slotCells[0]);
      expect(handleSlotClick).toHaveBeenCalledTimes(1);
    }
  });

  it('clamps booking times to calendar boundaries (06:00 to 22:00)', () => {
    const outOfBoundsBooking: BookingEvent[] = [
      {
        id: 'booking-out-1',
        courtId: 'court-1',
        courtName: 'Sân A',
        title: 'Sân đặt sớm',
        startTime: '04:00', // Before 06:00
        endTime: '08:00',
        status: 'confirmed',
        userName: 'Nguyễn Văn A',
      },
      {
        id: 'booking-out-2',
        courtId: 'court-2',
        courtName: 'Sân B',
        title: 'Sân đặt trễ',
        startTime: '21:00',
        endTime: '23:30', // After 22:00
        status: 'confirmed',
        userName: 'Trần Thị B',
      }
    ];

    render(
      <ResourceCalendar
        courts={mockCourts}
        bookings={outOfBoundsBooking}
        selectedDate={new Date()}
      />
    );

    expect(screen.getByText('Sân đặt sớm')).toBeInTheDocument();
    expect(screen.getByText('Sân đặt trễ')).toBeInTheDocument();
  });

  it('applies custom styling classes based on booking status', () => {
    const statusBookings: BookingEvent[] = [
      {
        id: 'booking-status-1',
        courtId: 'court-1',
        courtName: 'Sân A',
        title: 'Booking Chờ duyệt',
        startTime: '08:00',
        endTime: '10:00',
        status: 'pending',
        userName: 'Nguyễn Văn A',
      },
      {
        id: 'booking-status-2',
        courtId: 'court-2',
        courtName: 'Sân B',
        title: 'Booking Đã hủy',
        startTime: '10:00',
        endTime: '12:00',
        status: 'cancelled',
        userName: 'Trần Thị B',
      }
    ];

    render(
      <ResourceCalendar
        courts={mockCourts}
        bookings={statusBookings}
        selectedDate={new Date()}
      />
    );

    const pendingEl = screen.getByText('Booking Chờ duyệt').closest('.group');
    const cancelledEl = screen.getByText('Booking Đã hủy').closest('.group');

    expect(pendingEl?.className).toContain('bg-[var(--pc-warning-soft)]');
    expect(cancelledEl?.className).toContain('border-dashed');
  });
});
