"use client";

import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Chọn...",
  label,
  className = "",
  disabled = false,
}: SelectProps) {
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIdx((prev) => Math.min(prev + 1, options.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIdx((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="text-[10px] font-mono font-bold tracking-wider text-[var(--pc-green-800)] select-none uppercase block mb-1.5">
          {label}
        </label>
      )}
      <DropdownMenu.Root
        modal={false}
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) setHighlightedIdx(-1);
        }}
      >
        <DropdownMenu.Trigger
          type="button"
          role="combobox"
          aria-label={label || placeholder}
          aria-expanded={open}
          disabled={disabled}
          className="flex w-full items-center justify-between gap-2 rounded-[6px] border border-[var(--pc-green-100)] bg-white px-3 text-sm text-[var(--pc-ink)] outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--pc-green-600)] data-[placeholder]:text-[var(--pc-mute)] disabled:cursor-not-allowed disabled:opacity-50 h-[38px] cursor-pointer"
        >
          <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
            {selectedLabel || placeholder}
          </span>
          <span className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
            <ChevronDown className="h-4 w-4 text-[var(--pc-mute)]" aria-hidden="true" />
          </span>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={6}
            align="start"
            collisionPadding={12}
            className="select-content z-50 max-h-[300px] overflow-hidden rounded-[10px] border border-[var(--pc-hairline)] bg-[var(--pc-surface)] shadow-[0_4px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] data-[state=open]:animate-[select-in_170ms_ease-out] data-[state=closed]:animate-[select-out_130ms_ease-in]"
            style={{
              minWidth: "var(--radix-dropdown-menu-trigger-width)",
              width: "max(var(--radix-dropdown-menu-trigger-width), 220px)",
              maxWidth: "calc(100vw - 24px)",
              transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
            }}
            onKeyDown={handleKeyDown}
            onPointerDownOutside={() => setHighlightedIdx(-1)}
          >
            <div className="max-h-64 overflow-y-auto p-1.5">
              {options.map((option, i) => (
                <DropdownMenu.Item
                  key={option.value}
                  className="relative h-10 cursor-pointer select-none rounded-md text-sm outline-none"
                  onPointerEnter={() => setHighlightedIdx(i)}
                  onFocus={() => setHighlightedIdx(i)}
                  onSelect={() => onValueChange(option.value)}
                >
                  <AnimatePresence>
                    {highlightedIdx === i && (
                      <motion.div
                        layoutId="select-highlight"
                        className="absolute inset-0 rounded-md bg-[var(--pc-green-50)]"
                        transition={{ type: "spring", stiffness: 350, damping: 35 }}
                        initial={false}
                      />
                    )}
                  </AnimatePresence>
                  <span className={`relative z-10 flex h-full items-center whitespace-nowrap pl-9 pr-3 text-[var(--pc-body)] ${value === option.value ? "font-semibold" : ""}`}>
                    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
                      {value === option.value && <Check className="h-4 w-4 text-[var(--pc-green-800)]" aria-hidden="true" />}
                    </span>
                    <span className="block min-w-0 truncate whitespace-nowrap text-inherit">
                      {option.label}
                    </span>
                  </span>
                </DropdownMenu.Item>
              ))}
            </div>

          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
