import React from "react";
import { Button } from "./button";

export interface VenueCardProps {
  name: string;
  image: string;
  sport: string;
  rating: number;
  reviewCount?: number;
  openingHours?: string;
  onScheduleClick?: () => void;
  layout?: "grid" | "wide";
}

function getVenueImageSrc(image: string) {
  if (!image) return "/images/venue-placeholder.svg";
  try {
    const url = new URL(image);
    if (url.hostname === "picsum.photos") return "/images/venue-placeholder.svg";
  } catch {
    // relative URL or invalid
  }
  return image;
}

export function VenueCard({
  name,
  image,
  sport,
  rating,
  reviewCount,
  openingHours,
  onScheduleClick,
  layout = "grid",
}: VenueCardProps) {
  const isWide = layout === "wide";

  const imgSrc = getVenueImageSrc(image);

  return (
    <div
      className={`border border-[var(--pc-hairline)] rounded-[12px] bg-white overflow-hidden shadow-sm flex hover:border-[var(--pc-faint)] transition-colors group duration-300 ${
        isWide ? "flex-col md:flex-row md:items-stretch" : "flex-col"
      }`}
    >
      {/* Aspect Ratio Image Container */}
      <div
        className={`overflow-hidden relative bg-neutral-50 shrink-0 ${
          isWide
            ? "w-full md:w-[260px] aspect-[16/9] md:aspect-auto border-b md:border-b-0 md:border-r border-[var(--pc-hairline)]"
            : "aspect-[16/9] border-b border-[var(--pc-hairline)]"
        }`}
      >
        <img
          src={imgSrc}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/venue-placeholder.svg";
          }}
        />
      </div>

      {/* Content Container */}
      <div
        className={`p-4 flex flex-col gap-2.5 flex-grow ${
          isWide ? "md:justify-between" : ""
        }`}
      >
        <div className="flex flex-col gap-2">
          {/* Sport Mono-eyebrow */}
          <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--pc-mute)] font-semibold">
            {sport}
          </span>

          {/* Name & Rating */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-base font-bold text-[var(--pc-ink)] line-clamp-1 group-hover:text-[var(--pc-green-800)] transition-colors">
              {name}
            </h3>
            {rating > 0 ? (
              <div className="flex items-center gap-1 text-sm font-semibold text-[var(--pc-ink)] shrink-0 bg-[var(--pc-hairline-soft)] px-1.5 py-0.5 rounded-[4px]">
                <svg
                  className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>
                  {rating.toFixed(1)}
                  {reviewCount !== undefined ? ` (${reviewCount})` : ""}
                </span>
              </div>
            ) : (
              <span className="text-xs text-[var(--pc-mute)] shrink-0">
                Chưa có đánh giá
              </span>
            )}
          </div>

          {/* Opening Hours Chip */}
          <div className="flex flex-col gap-1 my-1">
            <span className="text-[11px] font-medium text-[var(--pc-mute)]">
              Giờ hoạt động hôm nay:
            </span>
            <div className="inline-flex self-start items-center px-2 py-0.5 rounded-[4px] bg-[var(--pc-green-50)] text-[var(--pc-green-800)] border border-[var(--pc-green-200)] text-xs font-semibold">
              <svg
                className="w-3.5 h-3.5 mr-1 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{openingHours || "Chưa cập nhật giờ hoạt động"}</span>
            </div>
          </div>
        </div>

        {/* "Xem sân" Button */}
        <div className={isWide ? "md:flex md:justify-end md:mt-2" : "w-full mt-auto"}>
          <Button
            variant="Secondary"
            onClick={onScheduleClick}
            className={`font-semibold text-xs border-[var(--pc-hairline)] hover:border-[var(--pc-faint)] ${
              isWide ? "w-full md:w-36 py-2" : "w-full py-1.5"
            }`}
          >
            Xem sân
          </Button>
        </div>
      </div>
    </div>
  );
}
