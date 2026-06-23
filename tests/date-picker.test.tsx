import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatePicker } from "../src/components/playcourt/date-picker";
import { vi, describe, it, expect } from "vitest";

describe("DatePicker Component Tests", () => {
  it("renders correctly with placeholder", () => {
    render(<DatePicker placeholder="Chọn ngày thi đấu" />);
    expect(screen.getByText("Chọn ngày thi đấu")).toBeInTheDocument();
  });

  it("renders selectedDate correctly formatted as DD/MM/YYYY", () => {
    const selectedDate = new Date(2026, 5, 23); // 23 June 2026
    render(<DatePicker selectedDate={selectedDate} />);
    expect(screen.getByText("23/06/2026")).toBeInTheDocument();
  });

  it("opens popover when clicked and shows month header", async () => {
    const selectedDate = new Date(2026, 5, 23); // June is month index 5
    render(<DatePicker selectedDate={selectedDate} />);
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    
    expect(screen.getByText("Tháng 6, 2026")).toBeInTheDocument();
  });

  it("triggers onChange when a date is clicked", () => {
    const selectedDate = new Date(2026, 5, 23);
    const onChange = vi.fn();
    render(<DatePicker selectedDate={selectedDate} onChange={onChange} />);
    
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    const dateButtons = screen.getAllByRole("button");
    const button25 = dateButtons.find(btn => btn.textContent === "25");
    expect(button25).toBeDefined();
    if (button25) {
      fireEvent.click(button25);
    }

    expect(onChange).toHaveBeenCalled();
    const calledDate = onChange.mock.calls[0][0] as Date;
    expect(calledDate.getDate()).toBe(25);
    expect(calledDate.getMonth()).toBe(5);
    expect(calledDate.getFullYear()).toBe(2026);
  });
});