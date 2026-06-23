"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/playcourt/button";
import { DatePicker } from "@/components/playcourt/date-picker";
import { SlotPicker, Slot } from "@/components/playcourt/slot-picker";
import { fetchVenueById, Venue } from "@/lib/api/client";
import { motion, AnimatePresence } from "motion/react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VenueDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [venue, setVenue] = useState<Venue | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const [selectedSport, setSelectedSport] = useState("Badminton");
  const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date());
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [activeAccordion, setActiveAccordion] = useState<string | null>("policy-1");

  useEffect(() => {
    async function loadVenue() {
      setLoading(true);
      const data = await fetchVenueById(id);
      if (data) {
        setVenue(data);
        setSelectedSport(data.sport);
      }
      setLoading(false);
    }
    loadVenue();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-[var(--pc-canvas)] font-semibold text-sm text-[var(--pc-mute)]">
        Đang tải chi tiết sân đấu...
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="text-center py-20 bg-[var(--pc-canvas)] min-h-screen flex flex-col items-center justify-center gap-4">
        <h3 className="text-lg font-bold text-[var(--pc-ink)]">Không tìm thấy sân đấu này</h3>
        <Button variant="Secondary" onClick={() => router.push("/")} className="cursor-pointer">
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  const images = [
    venue.image,
    "https://images.unsplash.com/photo-1545224859-ad2c48a21d8b?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60",
  ];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  const courtNames = ["Sân A1", "Sân A2", "Sân A3"];
  const timeSlots = [
    "06:00 - 07:00",
    "07:00 - 08:00",
    "08:00 - 09:00",
    "09:00 - 10:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00",
  ];

  const generatedSlots: Slot[] = [];
  courtNames.forEach((court) => {
    timeSlots.forEach((time, index) => {
      const hour = parseInt(time.split(":")[0]);
      const isPeak = hour >= 17 && hour <= 20;
      const isBusy = isPeak ? (index % 3 !== 0) : (index % 4 === 0);

      generatedSlots.push({
        id: `${court}-${hour}`,
        courtName: court,
        time: time,
        price: venue.price,
        isBusy: isBusy,
      });
    });
  });

  const handleScrollToGrid = () => {
    document.getElementById("court-slot-picker")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContinueBooking = () => {
    router.push(`/checkout?venue=${venue.id}&slots=${selectedSlotIds.join(",")}`);
  };

  const mockReviews = [
    {
      id: "1",
      name: "Trần Minh Quân",
      avatar: "M",
      rating: 5,
      date: "2 ngày trước",
      comment: "Sân bóng mới hoàn thiện, mặt cỏ nhân tạo rất êm. Đèn chiếu sáng cực kỳ tốt vào buổi tối. Bãi giữ xe rộng rãi.",
    },
    {
      id: "2",
      name: "Nguyễn Thu Trang",
      avatar: "T",
      rating: 4,
      date: "1 tuần trước",
      comment: "Chất lượng sân rất ok, giá cả hợp lý. Nhân viên hỗ trợ nhiệt tình. Tuy nhiên nhà vệ sinh hơi nhỏ một chút.",
    },
  ];

  return (
    <Tooltip.Provider>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8 bg-[var(--pc-canvas)] min-h-screen">
        {/* Gallery Image Carousel with Framer Motion */}
        <div className="relative w-full aspect-[21/9] md:h-[420px] rounded-[16px] overflow-hidden border border-[var(--pc-hairline)] bg-zinc-950 group">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImageIndex}
              src={images[activeImageIndex]}
              alt={venue.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Left Arrow Icon-only Control */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={handlePrevImage}
                  type="button"
                  aria-label="Ảnh trước"
                  className="p-2.5 rounded-full bg-white/80 hover:bg-white border border-[var(--pc-hairline)] text-[var(--pc-ink)] shadow-md transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  sideOffset={4}
                  className="z-50 rounded-md bg-[var(--pc-ink)] px-2.5 py-1.5 text-xs font-mono text-[var(--pc-canvas)] shadow-md animate-in fade-in zoom-in-95 duration-150"
                >
                  Ảnh trước
                  <Tooltip.Arrow className="fill-[var(--pc-ink)]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          {/* Right Arrow Icon-only Control */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={handleNextImage}
                  type="button"
                  aria-label="Ảnh sau"
                  className="p-2.5 rounded-full bg-white/80 hover:bg-white border border-[var(--pc-hairline)] text-[var(--pc-ink)] shadow-md transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  sideOffset={4}
                  className="z-50 rounded-md bg-[var(--pc-ink)] px-2.5 py-1.5 text-xs font-mono text-[var(--pc-canvas)] shadow-md animate-in fade-in zoom-in-95 duration-150"
                >
                  Ảnh sau
                  <Tooltip.Arrow className="fill-[var(--pc-ink)]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          {/* Thumbnails Overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-xs p-1.5 rounded-[12px] border border-white/10 z-10">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-12 h-8 rounded-[4px] overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? "border-[var(--pc-tennis)] scale-105" : "border-transparent opacity-60"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column (Details) */}
          <div className="md:col-span-8 flex flex-col gap-8">
            {/* Header info */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--pc-mute)] font-semibold self-start">
                {venue.sport}
              </span>
              <h1 className="text-3xl font-extrabold text-[var(--pc-ink)] tracking-tight">
                {venue.name}
              </h1>
              <div className="flex items-center gap-4 text-xs font-medium text-[var(--pc-body)]">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <strong className="text-[var(--pc-ink)]">{venue.rating.toFixed(1)}</strong> ({mockReviews.length} đánh giá)
                </span>
                <span>•</span>
                <span>{venue.location}</span>
              </div>
            </div>

            <hr className="border-[var(--pc-hairline)]" />

            {/* Amenities (Tiện ích) */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-[var(--pc-ink)]">Tiện ích sân chơi</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {venue.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 px-3 py-2 bg-white border border-[var(--pc-hairline)] rounded-[8px] text-xs font-semibold text-[var(--pc-body)]">
                    <svg className="w-4 h-4 text-[var(--pc-green-800)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-[var(--pc-hairline)]" />

            {/* Cancellation Policy (Accordion) */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-[var(--pc-ink)]">Chính sách đặt & huỷ sân</h2>
              <div className="flex flex-col gap-2 border border-[var(--pc-hairline)] rounded-[12px] bg-white overflow-hidden">
                {/* Item 1 */}
                <div className="border-b border-[var(--pc-hairline)] last:border-b-0">
                  <button
                    onClick={() => toggleAccordion("policy-1")}
                    className="w-full px-5 py-4 flex justify-between items-center text-left font-bold text-xs text-[var(--pc-ink)] cursor-pointer hover:bg-[var(--pc-hairline-soft)] transition-colors"
                  >
                    <span>Huỷ sân trước 24 giờ chơi</span>
                    <svg className={`w-4 h-4 text-[var(--pc-mute)] transition-transform duration-200 ${activeAccordion === "policy-1" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeAccordion === "policy-1" && (
                    <div className="px-5 pb-4 text-xs text-[var(--pc-body)] leading-relaxed animate-in fade-in duration-200">
                      Nếu quý khách thực hiện huỷ đặt sân trước thời gian thi đấu ít nhất 24 giờ, hệ thống sẽ hoàn trả 100% số tiền đặt cọc hoặc số tiền đã thanh toán trước đó vào tài khoản ví PlayCourt của bạn.
                    </div>
                  )}
                </div>

                {/* Item 2 */}
                <div className="border-b border-[var(--pc-hairline)] last:border-b-0">
                  <button
                    onClick={() => toggleAccordion("policy-2")}
                    className="w-full px-5 py-4 flex justify-between items-center text-left font-bold text-xs text-[var(--pc-ink)] cursor-pointer hover:bg-[var(--pc-hairline-soft)] transition-colors"
                  >
                    <span>Huỷ sân từ 12 - 24 giờ chơi</span>
                    <svg className={`w-4 h-4 text-[var(--pc-mute)] transition-transform duration-200 ${activeAccordion === "policy-2" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeAccordion === "policy-2" && (
                    <div className="px-5 pb-4 text-xs text-[var(--pc-body)] leading-relaxed animate-in fade-in duration-200">
                      Khi huỷ sân trong khoảng từ 12 đến 24 giờ trước giờ thi đấu, quý khách sẽ được hỗ trợ hoàn tiền 50% số tiền cọc hoặc nhận ưu đãi đổi lịch chơi sang một khung giờ khác có mức phí tương đương (nếu còn trống).
                    </div>
                  )}
                </div>

                {/* Item 3 */}
                <div>
                  <button
                    onClick={() => toggleAccordion("policy-3")}
                    className="w-full px-5 py-4 flex justify-between items-center text-left font-bold text-xs text-[var(--pc-ink)] cursor-pointer hover:bg-[var(--pc-hairline-soft)] transition-colors"
                  >
                    <span>Huỷ sân trễ (dưới 12 giờ chơi)</span>
                    <svg className={`w-4 h-4 text-[var(--pc-mute)] transition-transform duration-200 ${activeAccordion === "policy-3" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeAccordion === "policy-3" && (
                    <div className="px-5 pb-4 text-xs text-[var(--pc-body)] leading-relaxed animate-in fade-in duration-200">
                      Mọi yêu cầu huỷ sân thực hiện dưới 12 giờ trước giờ bắt đầu trận đấu sẽ không được hoàn tiền. Chúng tôi khuyến khích quý khách sắp xếp thời gian hợp lý hoặc nhượng lại suất chơi cho bạn bè.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-[var(--pc-hairline)]" />

            {/* Customer Reviews */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-[var(--pc-ink)]">Đánh giá từ người chơi</h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Total Average Card */}
                <div className="md:col-span-4 bg-white border border-[var(--pc-hairline)] rounded-[12px] p-5 text-center flex flex-col items-center justify-center gap-1 shadow-xs">
                  <span className="text-4xl font-extrabold text-[var(--pc-ink)]">{venue.rating.toFixed(1)}</span>
                  <div className="flex justify-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] text-[var(--pc-mute)] uppercase tracking-wider font-mono font-bold mt-1">Độ uy tín cao</span>
                </div>

                {/* Rating List */}
                <div className="md:col-span-8 flex flex-col gap-4">
                  {mockReviews.map((rev) => (
                    <div key={rev.id} className="flex gap-3 bg-white border border-[var(--pc-hairline)] rounded-[12px] p-4 shadow-xs">
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-[var(--pc-green-50)] text-[var(--pc-green-800)] flex items-center justify-center font-bold text-xs shrink-0 select-none">
                        {rev.avatar}
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[var(--pc-ink)]">{rev.name}</span>
                          <span className="text-[10px] text-[var(--pc-mute)] font-mono">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400 gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-xs text-[var(--pc-body)] leading-relaxed mt-1">{rev.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sticky Booking Panel) */}
          <div className="md:col-span-4 md:sticky md:top-20">
            <div className="bg-white border border-[var(--pc-hairline)] rounded-[12px] p-6 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[var(--pc-mute)] uppercase tracking-wider block font-mono">Bảng giá cọc</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[var(--pc-ink)]">{new Intl.NumberFormat("vi-VN").format(venue.price)}đ</span>
                  <span className="text-xs font-semibold text-[var(--pc-mute)]">/ giờ</span>
                </div>
              </div>

              <hr className="border-[var(--pc-hairline)]" />

              {/* Sport Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold tracking-wider text-[var(--pc-mute)] uppercase">Môn thể thao</label>
                <select
                  value={selectedSport}
                  onChange={(e) => {
                    setSelectedSport(e.target.value);
                    setSelectedSlotIds([]);
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-[var(--pc-hairline)] rounded-[6px] text-[var(--pc-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-green-600)] focus-visible:border-[var(--pc-green-600)] transition-all cursor-pointer h-[38px]"
                >
                  <option value="Badminton">Badminton</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                </select>
              </div>

              {/* DatePicker */}
              <div>
                <DatePicker
                  selectedDate={bookingDate}
                  onChange={(d) => {
                    setBookingDate(d);
                    setSelectedSlotIds([]);
                  }}
                  placeholder="Chọn ngày thi đấu"
                  label="Ngày đặt sân"
                  className="[&>button]:bg-white [&>button]:border-[var(--pc-hairline)] [&>button]:h-[38px] [&>button]:text-xs [&>button]:py-1"
                />
              </div>

              {/* CTA button to scroll to SlotPicker Grid */}
              <Button
                variant="AppPrimary"
                onClick={handleScrollToGrid}
                className="w-full py-2.5 bg-[var(--pc-green-800)] hover:bg-[var(--pc-green-700)] text-white font-bold text-xs rounded-[6px] cursor-pointer mt-2"
              >
                Đặt lịch ngay
              </Button>
            </div>
          </div>
        </div>

        <hr className="border-[var(--pc-hairline)] my-4" />

        {/* SlotPicker Section */}
        <section id="court-slot-picker" className="flex flex-col gap-4 scroll-mt-24">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-extrabold text-[var(--pc-ink)] tracking-tight">
              Chọn suất chơi & sân đấu
            </h2>
            <p className="text-xs text-[var(--pc-mute)]">
              Vui lòng nhấp vào các suất giờ trống màu trắng để chọn lịch thi đấu.
            </p>
          </div>

          <SlotPicker
            courtNames={courtNames}
            timeSlots={timeSlots}
            slots={generatedSlots}
            selectedSlotIds={selectedSlotIds}
            onSelectSlots={setSelectedSlotIds}
            onContinue={handleContinueBooking}
          />
        </section>
      </div>
    </Tooltip.Provider>
  );
}