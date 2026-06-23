"use client";

import React, { useState, useId } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";

export interface DatePickerProps {
  selectedDate?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  id?: string;
}

export function DatePicker({
  selectedDate,
  onChange,
  placeholder = "Chọn ngày",
  label,
  error,
  className = "",
  id,
}: DatePickerProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  const [isOpen, setIsOpen] = useState(false);
  const [currentViewDate, setCurrentViewDate] = useState(() => selectedDate || new Date());

  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  const monthsVi = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (y: number, m: number) => {
    return new Date(y, m, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const calendarCells: { date: Date; isCurrentMonth: boolean }[] = [];

  const prevMonthIndex = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonthDays = getDaysInMonth(prevMonthYear, prevMonthIndex);
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      date: new Date(prevMonthYear, prevMonthIndex, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push({
      date: new Date(year, month, day),
      isCurrentMonth: true,
    });
  }

  const remainingCells = 42 - calendarCells.length;
  const nextMonthIndex = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  for (let day = 1; day <= remainingCells; day++) {
    calendarCells.push({
      date: new Date(nextMonthYear, nextMonthIndex, day),
      isCurrentMonth: false,
    });
  }

  const handlePrevMonth = () => {
    setCurrentViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(year, month + 1, 1));
  };

  const handleSelectDate = (date: Date) => {
    if (onChange) {
      onChange(date);
    }
    setIsOpen(false);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <Tooltip.Provider>
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-mono font-semibold text-[var(--pc-body)] select-none">
            {label}
          </label>
        )}

        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              id={inputId}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={error ? "true" : "false"}
              className={`flex items-center justify-between px-3 py-2 text-sm bg-white border rounded-[6px] outline-none transition-all text-left cursor-pointer ${
                error
                  ? "border-[var(--pc-error)] focus-visible:ring-[var(--pc-error)] focus-visible:border-[var(--pc-error)]"
                  : "border-[var(--pc-hairline)] focus-visible:ring-[var(--pc-green-600)] focus-visible:border-[var(--pc-green-600)]"
              } focus-visible:ring-2`}
            >
              <span className={selectedDate ? "text-[var(--pc-ink)]" : "text-[var(--pc-faint)]"}>
                {selectedDate ? formatDate(selectedDate) : placeholder}
              </span>
              <svg
                className="w-4 h-4 text-[var(--pc-mute)] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              align="start"
              sideOffset={4}
              className="z-50 p-4 bg-white border border-[var(--pc-hairline)] rounded-[16px] shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)] w-80 animate-in fade-in-50 zoom-in-95 duration-100"
            >
              {/* Header: Prev, Current Month/Year, Next */}
              <div className="flex items-center justify-between mb-4">
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      aria-label="Tháng trước"
                      className="p-1 rounded-[6px] hover:bg-[var(--pc-hairline-soft)] text-[var(--pc-body)] cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      align="center"
                      sideOffset={4}
                      className="z-50 rounded-md bg-[var(--pc-ink)] px-2.5 py-1.5 text-xs font-mono text-[var(--pc-canvas)] shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-150"
                    >
                      Tháng trước
                      <Tooltip.Arrow className="fill-[var(--pc-ink)]" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                <span className="font-semibold text-sm text-[var(--pc-ink)]">
                  {monthsVi[month]}, {year}
                </span>

                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      aria-label="Tháng sau"
                      className="p-1 rounded-[6px] hover:bg-[var(--pc-hairline-soft)] text-[var(--pc-body)] cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      align="center"
                      sideOffset={4}
                      className="z-50 rounded-md bg-[var(--pc-ink)] px-2.5 py-1.5 text-xs font-mono text-[var(--pc-canvas)] shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-150"
                    >
                      Tháng sau
                      <Tooltip.Arrow className="fill-[var(--pc-ink)]" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {daysOfWeek.map((day) => (
                  <span key={day} className="text-xs font-semibold text-[var(--pc-mute)]">
                    {day}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map(({ date, isCurrentMonth }, idx) => {
                  const selected = isSelected(date);
                  const today = isToday(date);

                  return (
                    <button
                      key={`${date.toISOString()}-${idx}`}
                      type="button"
                      onClick={() => handleSelectDate(date)}
                      className={`h-9 w-9 text-xs rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        !isCurrentMonth ? "text-[var(--pc-faint)]" : "text-[var(--pc-ink)]"
                      } ${
                        selected
                          ? "bg-[var(--pc-green-800)] text-white font-bold"
                          : today
                          ? "bg-[var(--pc-green-50)] text-[var(--pc-green-800)] font-bold border border-[var(--pc-green-200)]"
                          : "hover:bg-[var(--pc-hairline-soft)]"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {error && (
          <span id={errorId} className="text-xs text-[var(--pc-error)] font-medium">
            {error}
          </span>
        )}
      </div>
    </Tooltip.Provider>
  );
}