import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SlotPicker, Slot } from "../src/components/playcourt/slot-picker";
import { vi, describe, it, expect } from "vitest";

const mockSlots: Slot[] = [
  { id: "c1-s1", courtName: "Court A", time: "06:00 - 07:00", price: 100000, isBusy: false },
  { id: "c1-s2", courtName: "Court A", time: "07:00 - 08:00", price: 100000, isBusy: true },
  { id: "c1-s3", courtName: "Court A", time: "08:00 - 09:00", price: 100000, isBusy: false },
  { id: "c2-s1", courtName: "Court B", time: "06:00 - 07:00", price: 120000, isBusy: false },
  { id: "c2-s2", courtName: "Court B", time: "07:00 - 08:00", price: 120000, isBusy: false },
  { id: "c2-s3", courtName: "Court B", time: "08:00 - 09:00", price: 120000, isBusy: false },
];

const courtNames = ["Court A", "Court B"];
const timeSlots = ["06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00"];

describe("SlotPicker Component Tests", () => {
  it("renders headers and grid cells correctly", () => {
    render(
      <SlotPicker
        courtNames={courtNames}
        timeSlots={timeSlots}
        slots={mockSlots}
        selectedSlotIds={[]}
        onSelectSlots={() => {}}
      />
    );

    expect(screen.getByText("Court A")).toBeInTheDocument();
    expect(screen.getByText("Court B")).toBeInTheDocument();
    expect(screen.getByText("06:00 - 07:00")).toBeInTheDocument();
  });

  it("prevents selecting a busy slot", () => {
    const onSelectSlots = vi.fn();
    render(
      <SlotPicker
        courtNames={courtNames}
        timeSlots={timeSlots}
        slots={mockSlots}
        selectedSlotIds={[]}
        onSelectSlots={onSelectSlots}
      />
    );

    const busySlot = screen.getByTestId("slot-c1-s2");
    expect(busySlot).toBeInTheDocument();
    
    fireEvent.click(busySlot);
    expect(onSelectSlots).not.toHaveBeenCalled();
  });

  it("selects a free slot when clicked", () => {
    const onSelectSlots = vi.fn();
    render(
      <SlotPicker
        courtNames={courtNames}
        timeSlots={timeSlots}
        slots={mockSlots}
        selectedSlotIds={[]}
        onSelectSlots={onSelectSlots}
      />
    );

    const freeSlot = screen.getByTestId("slot-c1-s1");
    fireEvent.click(freeSlot);
    expect(onSelectSlots).toHaveBeenCalledWith(["c1-s1"]);
  });

  it("calculates total price correctly in summary", () => {
    const onContinue = vi.fn();
    render(
      <SlotPicker
        courtNames={courtNames}
        timeSlots={timeSlots}
        slots={mockSlots}
        selectedSlotIds={["c1-s1", "c2-s2"]}
        onSelectSlots={() => {}}
        onContinue={onContinue}
      />
    );

    expect(screen.getByText(/220\.000/)).toBeInTheDocument();

    const continueBtn = screen.getByRole("button", { name: /tiếp tục/i });
    fireEvent.click(continueBtn);
    expect(onContinue).toHaveBeenCalled();
  });
});