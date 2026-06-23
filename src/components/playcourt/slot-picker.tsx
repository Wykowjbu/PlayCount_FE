"use client";

import React from "react";
import { Button } from "./button";

export interface Slot {
  id: string;
  courtName: string;
  time: string;
  price: number;
  isBusy: boolean;
}

export interface SlotPickerProps {
  courtNames: string[];
  timeSlots: string[];
  slots: Slot[];
  selectedSlotIds: string[];
  onSelectSlots: (ids: string[]) => void;
  onContinue?: () => void;
}

export function SlotPicker({
  courtNames,
  timeSlots,
  slots,
  selectedSlotIds,
  onSelectSlots,
  onContinue,
}: SlotPickerProps) {
  
  const handleSlotClick = (slot: Slot) => {
    if (slot.isBusy) return;
    
    const isSelected = selectedSlotIds.includes(slot.id);
    let newSelected: string[];
    if (isSelected) {
      newSelected = selectedSlotIds.filter((id) => id !== slot.id);
    } else {
      newSelected = [...selectedSlotIds, slot.id];
    }
    onSelectSlots(newSelected);
  };

  const selectedSlots = slots.filter((s) => selectedSlotIds.includes(s.id));
  const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("vi-VN").format(p) + "đ";
  };

  return (
    <div className="flex flex-col gap-6 w-full bg-white border border-[var(--pc-hairline)] rounded-[12px] p-6 shadow-sm">
      <div className="overflow-x-auto w-full">
        <div className="min-w-[600px] flex flex-col">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-2 border-b border-[var(--pc-hairline)] pb-3 mb-2 font-mono text-xs font-bold text-[var(--pc-mute)] uppercase tracking-wider text-center">
            <div className="col-span-3 text-left">Giờ</div>
            {courtNames.map((court) => {
              const colSpan = Math.floor(9 / courtNames.length);
              return (
                <div key={court} className={`col-span-${colSpan}`}>
                  {court}
                </div>
              );
            })}
          </div>

          {/* Time Slot Rows */}
          <div className="flex flex-col gap-2.5">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-12 gap-2 items-center text-center">
                {/* Time Label */}
                <div className="col-span-3 text-left text-xs font-bold text-[var(--pc-ink)] bg-[var(--pc-hairline-soft)] px-2 py-1.5 rounded-[4px] font-mono">
                  {time}
                </div>

                {/* Slots per Court */}
                {courtNames.map((court) => {
                  const colSpan = Math.floor(9 / courtNames.length);
                  const slot = slots.find((s) => s.courtName === court && s.time === time) || {
                    id: `${court}-${time}`,
                    courtName: court,
                    time: time,
                    price: 100000,
                    isBusy: true,
                  };

                  const isSelected = selectedSlotIds.includes(slot.id);
                  const isBusy = slot.isBusy;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      data-testid={`slot-${slot.id}`}
                      disabled={isBusy}
                      onClick={() => handleSlotClick(slot)}
                      className={`col-span-${colSpan} h-10 text-xs rounded-[6px] transition-all relative overflow-hidden flex flex-col items-center justify-center select-none ${
                        isBusy
                          ? "bg-[var(--pc-hairline-soft)] text-[var(--pc-mute)] border border-[var(--pc-hairline)] cursor-not-allowed bg-[repeating-linear-gradient(45deg,var(--pc-hairline-soft),var(--pc-hairline-soft)_6px,var(--pc-hairline)_6px,var(--pc-hairline)_12px)] opacity-60"
                          : isSelected
                          ? "bg-[var(--pc-green-800)] text-white font-bold border border-[var(--pc-green-900)] cursor-pointer shadow-xs"
                          : "bg-white text-[var(--pc-body)] hover:bg-[var(--pc-green-50)] hover:text-[var(--pc-green-800)] border border-[var(--pc-hairline)] hover:border-[var(--pc-green-200)] cursor-pointer"
                      }`}
                    >
                      <span className="font-semibold">{isBusy ? "Bận" : formatPrice(slot.price)}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {selectedSlots.length > 0 && (
        <div className="border-t border-[var(--pc-hairline)] pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--pc-green-50)]/50 p-4 rounded-[8px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono font-bold text-[var(--pc-green-800)] uppercase tracking-wider">
              Suất sân đã chọn ({selectedSlots.length})
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs text-[var(--pc-body)] font-medium">
              {selectedSlots.map((s) => (
                <span key={s.id} className="bg-white border border-[var(--pc-hairline)] px-2 py-0.5 rounded-[4px] shadow-xs">
                  {s.courtName} ({s.time})
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end shrink-0">
            <div className="text-right">
              <span className="text-[11px] font-bold text-[var(--pc-mute)] uppercase tracking-wider block font-mono">Tổng cộng</span>
              <span className="text-lg font-black text-[var(--pc-ink)] font-sans">{formatPrice(totalPrice)}</span>
            </div>
            <Button
              variant="AppPrimary"
              onClick={onContinue}
              className="bg-[var(--pc-green-800)] hover:bg-[var(--pc-green-700)] text-white font-bold px-6 py-2 rounded-[6px] cursor-pointer text-xs"
            >
              Tiếp tục
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}