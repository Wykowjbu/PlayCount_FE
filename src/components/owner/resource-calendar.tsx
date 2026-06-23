"use client";

import React from 'react';
import { StatusBadge, StatusType } from '../playcourt/status-badge';

export interface BookingEvent {
  id: string;
  courtId: string;
  courtName: string;
  title: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  status: StatusType;
  userName: string;
  userPhone?: string;
  price?: number;
}

export interface Court {
  id: string;
  name: string;
}

export interface ResourceCalendarProps {
  courts: Court[];
  bookings: BookingEvent[];
  selectedDate?: Date;
  onEventClick?: (booking: BookingEvent) => void;
  onSlotClick?: (courtId: string, timeSlot: string) => void;
}

export function ResourceCalendar({
  courts,
  bookings,
  selectedDate = new Date(),
  onEventClick,
  onSlotClick,
}: ResourceCalendarProps) {
  const startHour = 6;
  const endHour = 22;
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const hourHeight = 64; // height in pixels

  const formatHour = (hour) => {
    return hour.toString().padStart(2, '0') + ":00";
  };

  const parseTimeToMinutes = (timeStr) => {
    const parts = timeStr.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    return h * 60 + m;
  };

  const startMinutes = startHour * 60;

  return (
    <div className="border border-[var(--pc-hairline)] rounded-[12px] bg-white shadow-sm overflow-hidden flex flex-col h-[700px]">
      {/* Grid Headers */}
      <div className="flex border-b border-[var(--pc-hairline)] bg-[var(--pc-canvas)] select-none shrink-0">
        {/* Time Column Header */}
        <div className="w-16 border-r border-[var(--pc-hairline)] py-3 flex items-center justify-center font-mono text-[10px] font-semibold text-[var(--pc-mute)] uppercase tracking-wider">
          Giờ
        </div>
        {/* Court Column Headers */}
        {courts.map((court) => (
          <div
            key={court.id}
            className="flex-1 py-3 text-center text-sm font-bold text-[var(--pc-ink)] border-r border-[var(--pc-hairline)] last:border-r-0"
          >
            {court.name}
          </div>
        ))}
      </div>

      {/* Grid Body with Scroll */}
      <div className="flex-1 overflow-y-auto relative flex">
        {/* Left Time Column */}
        <div className="w-16 border-r border-[var(--pc-hairline)] bg-[var(--pc-canvas)] shrink-0 select-none">
          {hours.map((hour) => (
            <div
              key={hour}
              style={{ height: hourHeight + "px" }}
              className="flex items-start justify-center pt-2 font-mono text-xs font-semibold text-[var(--pc-mute)] border-b border-[var(--pc-hairline-soft)] last:border-b-0"
            >
              {formatHour(hour)}
            </div>
          ))}
        </div>

        {/* Court Columns Grid */}
        <div className="flex-1 flex relative">
          {courts.map((court) => {
            // Find bookings for this court
            const courtBookings = bookings.filter((b) => b.courtId === court.id);

            return (
              <div
                key={court.id}
                className="flex-1 relative border-r border-[var(--pc-hairline)] last:border-r-0 h-full"
                style={{ minHeight: (hours.length * hourHeight) + "px" }}
              >
                {/* Background Grid Cells for clicking */}
                {hours.map((hour, idx) => {
                  const timeSlot = formatHour(hour);
                  return (
                    <div
                      key={hour}
                      data-testid="grid-cell"
                      onClick={() => onSlotClick?.(court.id, timeSlot)}
                      style={{ height: hourHeight + "px" }}
                      className="border-b border-[var(--pc-hairline-soft)] hover:bg-[var(--pc-hairline-soft)] transition-colors cursor-pointer last:border-b-0"
                    />
                  );
                })}

                {/* Booking Cards Overlay */}
                {courtBookings.map((booking) => {
                  const startMinRaw = parseTimeToMinutes(booking.startTime);
                  const endMinRaw = parseTimeToMinutes(booking.endTime);
                  
                  // Clamp to grid boundaries (06:00 to 22:00)
                  const startMin = Math.max(startMinutes, Math.min(endHour * 60, startMinRaw));
                  const endMin = Math.max(startMinutes, Math.min(endHour * 60, endMinRaw));

                  // Skip rendering if completely out of range or invalid duration
                  if (startMin >= endMin) return null;
                  
                  // Calculate absolute position
                  const top = ((startMin - startMinutes) / 60) * hourHeight;
                  const height = ((endMin - startMin) / 60) * hourHeight;

                  let eventClasses = "";
                  let titleClasses = "";
                  let timeClasses = "";

                  switch (booking.status) {
                    case "confirmed":
                    case "paid":
                    case "verified":
                      eventClasses = "border-[var(--pc-green-200)] bg-[var(--pc-green-50)] hover:border-[var(--pc-green-600)]";
                      titleClasses = "text-[var(--pc-green-900)]";
                      timeClasses = "text-[var(--pc-green-700)]";
                      break;
                    case "pending":
                    case "needs action":
                      eventClasses = "border-[var(--pc-warning)] bg-[var(--pc-warning-soft)] hover:border-[var(--pc-warning-deep)]";
                      titleClasses = "text-[var(--pc-warning-deep)]";
                      timeClasses = "text-[var(--pc-warning-deep)]/80";
                      break;
                    case "failed":
                    case "rejected":
                    case "cancelled":
                      eventClasses = "border-dashed border-[var(--pc-mute)] bg-[var(--pc-hairline-soft)] hover:border-[var(--pc-ink)] opacity-75";
                      titleClasses = "text-[var(--pc-mute)] line-through";
                      timeClasses = "text-[var(--pc-mute)]";
                      break;
                    default:
                      eventClasses = "border-[var(--pc-hairline)] bg-[var(--pc-canvas)] hover:border-[var(--pc-faint)]";
                      titleClasses = "text-[var(--pc-ink)]";
                      timeClasses = "text-[var(--pc-body)]";
                      break;
                  }

                  return (
                    <div
                      key={booking.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(booking);
                      }}
                      style={{
                        position: 'absolute',
                        top: top + "px",
                        height: height + "px",
                        left: '4px',
                        right: '4px',
                        zIndex: 10,
                      }}
                      className={"group cursor-pointer select-none rounded-[6px] border p-2 hover:shadow-xs transition-all flex flex-col justify-between overflow-hidden " + eventClasses}
                    >
                      <div className="flex flex-col gap-1">
                        <p className={"text-xs font-bold truncate group-hover:text-[var(--pc-ink)] transition-colors " + titleClasses}>
                          {booking.title}
                        </p>
                        <p className={"text-[10px] font-semibold font-mono " + timeClasses}>
                          {booking.startTime} - {booking.endTime}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-medium text-[var(--pc-body)] truncate">
                          {booking.userName}
                        </span>
                        <StatusBadge
                          status={booking.status}
                          className="scale-90 origin-right py-0 px-1.5"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
