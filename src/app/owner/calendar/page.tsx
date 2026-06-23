"use client";

import React, { useState, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  X,
  Check,
  User,
  Phone,
  Compass,
  AlertTriangle,
  Clock
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ResourceCalendar, BookingEvent, Court } from "@/components/owner/resource-calendar";
import { Button } from "@/components/playcourt/button";
import { Input } from "@/components/playcourt/input";

const mockCourts = [
  { id: "court-1", name: "Sân Tennis Đất Nện 1" },
  { id: "court-2", name: "Sân Tennis Cứng 2" },
  { id: "court-3", name: "Sân Tennis Cứng 3" },
];

const initialBookings = [
  {
    id: "booking-101",
    courtId: "court-1",
    courtName: "Sân Tennis Đất Nện 1",
    title: "Trận giao hữu hội bách khoa",
    startTime: "08:00",
    endTime: "10:00",
    status: "confirmed",
    userName: "Lê Minh Quân",
    userPhone: "0909 111 222",
    price: 360000,
  },
  {
    id: "booking-102",
    courtId: "court-2",
    courtName: "Sân Tennis Cứng 2",
    title: "Tập luyện cá nhân",
    startTime: "10:00",
    endTime: "11:30",
    status: "pending",
    userName: "Nguyễn Thảo Chi",
    userPhone: "0918 222 333",
    price: 225000,
  },
  {
    id: "booking-103",
    courtId: "court-3",
    courtName: "Sân Tennis Cứng 3",
    title: "Lớp học Tennis trẻ em",
    startTime: "15:00",
    endTime: "17:00",
    status: "confirmed",
    userName: "Thầy Hùng",
    userPhone: "0982 333 444",
    price: 300000,
  },
  {
    id: "booking-104",
    courtId: "court-1",
    courtName: "Sân Tennis Đất Nện 1",
    title: "Chờ duyệt thanh toán",
    startTime: "18:00",
    endTime: "20:00",
    status: "pending",
    userName: "Trần Anh Tuấn",
    userPhone: "0934 444 555",
    price: 360000,
  },
];

function QuickTooltip({ children, content }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          align="center"
          sideOffset={4}
          className="z-50 rounded-md bg-[var(--pc-ink)] px-2.5 py-1.5 text-xs font-mono text-[var(--pc-canvas)] shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-150 select-none"
        >
          {content}
          <Tooltip.Arrow className="fill-[var(--pc-ink)]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export default function OwnerCalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // State for side panel (viewing booking details)
  const [activeBooking, setActiveBooking] = useState(null);

  // State for quick create booking dialog
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBookingCourt, setNewBookingCourt] = useState("court-1");
  const [newBookingTime, setNewBookingTime] = useState("08:00");
  const [newBookingName, setNewBookingName] = useState("");
  const [newBookingPhone, setNewBookingPhone] = useState("");
  const [newBookingTitle, setNewBookingTitle] = useState("");

  const formattedDate = useMemo(() => {
    return selectedDate.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [selectedDate]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (selectedStatus !== "all" && b.status !== selectedStatus) return false;
      
      if (selectedSport !== "all") {
        if (selectedSport === "Tennis" && b.courtName.indexOf("Tennis") === -1) return false;
        if (selectedSport === "Badminton" && b.courtName.indexOf("Cầu lông") === -1) return false;
      }

      return true;
    });
  }, [bookings, selectedSport, selectedStatus]);

  // Navigation handlers
  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // Event actions
  const handleEventClick = (booking) => {
    setActiveBooking(booking);
  };

  const handleSlotClick = (courtId, timeSlot) => {
    setNewBookingCourt(courtId);
    setNewBookingTime(timeSlot);
    setNewBookingName("");
    setNewBookingPhone("");
    setNewBookingTitle("");
    setShowCreateModal(true);
  };

  const handleConfirmBooking = (bookingId) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: "confirmed" } : b)
    );
    setActiveBooking(prev => prev && prev.id === bookingId ? { ...prev, status: "confirmed" } : prev);
  };

  const handleCancelBooking = (bookingId) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" } : b)
    );
    setActiveBooking(prev => prev && prev.id === bookingId ? { ...prev, status: "cancelled" } : prev);
  };

  const handleSaveBooking = (e) => {
    e.preventDefault();
    if (!newBookingName || !newBookingTitle) return;

    // Parse end time (default to start time + 2 hours)
    const timeParts = newBookingTime.split(":");
    const h = parseInt(timeParts[0], 10);
    const m = parseInt(timeParts[1], 10);
    const endH = Math.min(22, h + 2);
    const endTimeStr = endH.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0");

    const court = mockCourts.find(c => c.id === newBookingCourt);

    const newEvent = {
      id: "booking-manual-" + Date.now(),
      courtId: newBookingCourt,
      courtName: court ? court.name : "Sân đã chọn",
      title: newBookingTitle,
      startTime: newBookingTime,
      endTime: endTimeStr,
      status: "confirmed", // Manual is pre-confirmed
      userName: newBookingName,
      userPhone: newBookingPhone,
      price: 360000,
    };

    setBookings(prev => [...prev, newEvent]);
    setShowCreateModal(false);
  };

  return (
    <Tooltip.Provider>
      <div className="flex h-screen relative overflow-hidden bg-[var(--pc-canvas)]">
        
        {/* Main Calendar Body */}
        <div className="flex-1 flex flex-col p-6 md:p-8 overflow-hidden gap-6">
          
          {/* Upper Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none shrink-0 border-b border-[var(--pc-hairline-soft)] pb-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-[var(--pc-green-50)] text-[var(--pc-green-800)] flex items-center justify-center">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--pc-mute)] font-semibold">
                  PlayCourt Pro &gt; Lịch đặt sân
                </span>
                <h1 className="text-xl md:text-2xl font-extrabold text-[var(--pc-ink)] tracking-tight capitalize">
                  {formattedDate}
                </h1>
              </div>
            </div>

            {/* Date Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToday}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-[var(--pc-hairline)] bg-white text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] active:scale-[0.98] transition-all cursor-pointer"
              >
                Hôm nay
              </button>
              <div className="flex items-center border border-[var(--pc-hairline)] bg-white rounded-md overflow-hidden">
                <QuickTooltip content="Ngày trước">
                  <button
                    onClick={handlePrevDay}
                    className="p-1.5 text-[var(--pc-mute)] hover:text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] cursor-pointer"
                    aria-label="Ngày trước"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </QuickTooltip>
                <QuickTooltip content="Ngày tiếp theo">
                  <button
                    onClick={handleNextDay}
                    className="p-1.5 text-[var(--pc-mute)] hover:text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] border-l border-[var(--pc-hairline)] cursor-pointer"
                    aria-label="Ngày tiếp theo"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </QuickTooltip>
              </div>
            </div>
          </div>

          {/* Filters and Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-white border border-[var(--pc-hairline)] rounded-[8px] p-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Sport Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[var(--pc-mute)] font-mono uppercase">Môn:</span>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="text-xs font-semibold rounded-md border border-[var(--pc-hairline)] bg-[var(--pc-canvas)] px-2 py-1 cursor-pointer outline-hidden"
                >
                  <option value="all">Tất cả</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Badminton">Cầu lông</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[var(--pc-mute)] font-mono uppercase">Trạng thái:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="text-xs font-semibold rounded-md border border-[var(--pc-hairline)] bg-[var(--pc-canvas)] px-2 py-1 cursor-pointer outline-hidden"
                >
                  <option value="all">Tất cả</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="pending">Đang chờ</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>

            <Button 
              variant="AppPrimary" 
              className="py-1.5 text-xs font-bold shrink-0 shadow-xs"
              onClick={() => handleSlotClick("court-1", "08:00")}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tạo đặt sân thủ công</span>
            </Button>
          </div>

          {/* Resource Calendar Grid */}
          <div className="flex-1 min-h-0 relative">
            <ResourceCalendar
              courts={mockCourts}
              bookings={filteredBookings}
              selectedDate={selectedDate}
              onEventClick={handleEventClick}
              onSlotClick={handleSlotClick}
            />
          </div>
        </div>

        {/* Slide-over Side Panel (Details) */}
        {activeBooking && (
          <div className="absolute inset-0 bg-black/30 z-30 flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[var(--pc-hairline)] animate-in slide-in-from-right duration-250">
              {/* Panel Header */}
              <div className="p-5 border-b border-[var(--pc-hairline)] flex items-center justify-between bg-[var(--pc-canvas)] select-none">
                <div>
                  <span className="font-mono text-[9px] font-bold text-[var(--pc-mute)] uppercase">
                    Mã: {activeBooking.id}
                  </span>
                  <h2 className="text-base font-extrabold text-[var(--pc-ink)]">
                    Chi tiết đơn đặt sân
                  </h2>
                </div>
                <QuickTooltip content="Đóng chi tiết">
                  <button
                    onClick={() => setActiveBooking(null)}
                    className="p-1 rounded-full hover:bg-[var(--pc-hairline-soft)] text-[var(--pc-mute)] hover:text-[var(--pc-ink)] cursor-pointer"
                    aria-label="Đóng chi tiết"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </QuickTooltip>
              </div>

              {/* Panel Content */}
              <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-6">
                
                {/* Event title & Status */}
                <div className="border border-[var(--pc-hairline)] rounded-[8px] p-4 bg-[var(--pc-canvas)] flex flex-col gap-3">
                  <h3 className="text-base font-bold text-[var(--pc-ink)]">
                    {activeBooking.title}
                  </h3>
                  <div className="flex items-center justify-between border-t border-[var(--pc-hairline-soft)] pt-3 mt-1">
                    <span className="text-xs font-semibold text-[var(--pc-mute)]">Trạng thái:</span>
                    <div className="scale-95 origin-right">
                      <span className={"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider " + (
                        activeBooking.status === "confirmed" ? "bg-[var(--pc-green-100)] text-[var(--pc-green-900)]" :
                        activeBooking.status === "pending" ? "bg-[var(--pc-warning-soft)] text-[var(--pc-warning-deep)]" :
                        "bg-red-100 text-red-800"
                      )}>
                        {activeBooking.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Info Fields */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-[var(--pc-mute)] uppercase tracking-wider font-mono">
                    Thông tin lịch hẹn
                  </h4>

                  {/* Court Name */}
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[var(--pc-hairline-soft)] flex items-center justify-center text-[var(--pc-mute)] shrink-0">
                      <Compass className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--pc-mute)] uppercase font-mono">Sân đấu</p>
                      <p className="text-xs font-bold text-[var(--pc-ink)]">{activeBooking.courtName}</p>
                    </div>
                  </div>

                  {/* Date/Time */}
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[var(--pc-hairline-soft)] flex items-center justify-center text-[var(--pc-mute)] shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--pc-mute)] uppercase font-mono">Thời gian đặt</p>
                      <p className="text-xs font-bold text-[var(--pc-ink)]">
                        {activeBooking.startTime} - {activeBooking.endTime} ({formattedDate})
                      </p>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[var(--pc-hairline-soft)] flex items-center justify-center text-[var(--pc-mute)] shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--pc-mute)] uppercase font-mono">Khách hàng</p>
                      <p className="text-xs font-bold text-[var(--pc-ink)]">{activeBooking.userName}</p>
                    </div>
                  </div>

                  {/* User Phone */}
                  {activeBooking.userPhone && (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[var(--pc-hairline-soft)] flex items-center justify-center text-[var(--pc-mute)] shrink-0">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-[var(--pc-mute)] uppercase font-mono">Số điện thoại</p>
                        <p className="text-xs font-bold text-[var(--pc-ink)]">{activeBooking.userPhone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Details */}
                {activeBooking.price !== undefined && (
                  <div className="border-t border-[var(--pc-hairline)] pt-5 flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--pc-ink)]">Tổng doanh thu:</span>
                    <span className="text-base font-black text-[var(--pc-green-800)]">
                      {activeBooking.price.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                )}
              </div>

              {/* Panel Footer Controls */}
              <div className="p-5 border-t border-[var(--pc-hairline)] bg-[var(--pc-canvas)] flex gap-3 select-none">
                {activeBooking.status === "pending" && (
                  <>
                    <Button 
                      variant="AppPrimary" 
                      className="flex-1 font-bold text-xs"
                      onClick={() => handleConfirmBooking(activeBooking.id)}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Duyệt đơn đặt</span>
                    </Button>
                    <Button 
                      variant="Secondary" 
                      className="flex-1 font-bold text-xs"
                      onClick={() => handleCancelBooking(activeBooking.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Từ chối</span>
                    </Button>
                  </>
                )}
                {activeBooking.status === "confirmed" && (
                  <Button 
                    variant="Danger" 
                    className="w-full font-bold text-xs"
                    onClick={() => handleCancelBooking(activeBooking.id)}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Hủy lịch hẹn &amp; Hoàn tiền</span>
                  </Button>
                )}
                {activeBooking.status === "cancelled" && (
                  <div className="text-center w-full py-2 bg-red-50 text-red-700 text-xs font-bold rounded-md border border-red-200 flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Đơn đặt sân này đã bị hủy bỏ</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Creation Modal (Tạo nhanh đơn đặt) */}
        {showCreateModal && (
          <div className="absolute inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
            <form 
              onSubmit={handleSaveBooking}
              className="w-full max-w-md bg-white border border-[var(--pc-hairline)] rounded-[16px] shadow-2xl overflow-hidden flex flex-col gap-4 animate-in zoom-in-95 duration-150"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-[var(--pc-hairline)] flex items-center justify-between bg-[var(--pc-canvas)] select-none">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--pc-ink)]">
                    Tạo đặt sân thủ công
                  </h3>
                  <p className="text-xs text-[var(--pc-mute)] font-medium">
                    Đặt trực tiếp cho khách hàng
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-full hover:bg-[var(--pc-hairline-soft)] text-[var(--pc-mute)] hover:text-[var(--pc-ink)] cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Form inputs */}
              <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[350px]">
                
                {/* Selected info tag */}
                <div className="bg-[var(--pc-green-50)] text-[var(--pc-green-900)] border border-[var(--pc-green-200)] rounded-[6px] p-3 text-xs font-semibold flex flex-col gap-1">
                  <p>Sân: {mockCourts.find(c => c.id === newBookingCourt)?.name}</p>
                  <p>Giờ bắt đầu: {newBookingTime} (Đặt mặc định 2 tiếng)</p>
                </div>

                {/* Title input */}
                <Input
                  label="Tiêu đề lịch đặt"
                  placeholder="Ví dụ: Anh Dũng giao lưu chiều"
                  required
                  value={newBookingTitle}
                  onChange={(e) => setNewBookingTitle(e.target.value)}
                />

                {/* Name input */}
                <Input
                  label="Tên khách hàng"
                  placeholder="Nhập tên người đặt"
                  required
                  value={newBookingName}
                  onChange={(e) => setNewBookingName(e.target.value)}
                />

                {/* Phone input */}
                <Input
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại liên hệ"
                  value={newBookingPhone}
                  onChange={(e) => setNewBookingPhone(e.target.value)}
                />
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-[var(--pc-hairline)] bg-[var(--pc-canvas)] flex justify-end gap-3 select-none">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs font-semibold px-4 py-2 rounded-md border border-[var(--pc-hairline)] bg-white text-[var(--pc-ink)] hover:bg-[var(--pc-hairline-soft)] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <Button
                  type="submit"
                  variant="AppPrimary"
                  className="text-xs font-bold"
                >
                  Lưu lịch đặt
                </Button>
              </div>
            </form>
          </div>
        )}

      </div>
    </Tooltip.Provider>
  );
}
