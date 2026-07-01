import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/(public)/page";

const mocks = vi.hoisted(() => ({
  sportsList: vi.fn(),
  fetchVenues: vi.fn(),
  routerPush: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mocks.routerPush,
  }),
}));

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: new Proxy(
    {},
    {
      get:
        (_target, tag: string) =>
        ({ children, ...props }: React.ComponentProps<"div">) =>
          React.createElement(tag, props, children),
    },
  ),
  useReducedMotion: () => true,
}));

vi.mock("@/lib/api/client", () => ({
  api: {
    sports: {
      list: mocks.sportsList,
    },
  },
  fetchVenues: mocks.fetchVenues,
  getVenueImage: () => "",
  getVenueSportName: () => "Thể thao",
}));

describe("HomePage backend errors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();
    mocks.sportsList.mockResolvedValue({ data: [] });
  });

  it("shows the backend message when venue loading fails", async () => {
    mocks.fetchVenues.mockRejectedValue(new Error("Backend venue message"));

    render(<HomePage />);

    expect(await screen.findByText("Backend venue message")).toBeInTheDocument();
  });

  it("keeps current venue cards mounted while a sport filter request is loading", async () => {
    mocks.sportsList.mockResolvedValue({
      data: [{ id: 1, name: "Tennis" }],
    });
    mocks.fetchVenues
      .mockResolvedValueOnce({
        data: [{ id: 10, name: "Sân cũ", rating: 4.5 }],
      })
      .mockReturnValueOnce(new Promise(() => {}));

    render(<HomePage />);

    expect(await screen.findByText("Sân cũ")).toBeInTheDocument();

    await userEvent.click((await screen.findAllByRole("button", { name: "Tennis" }))[0]);

    expect(screen.getByText("Sân cũ")).toBeInTheDocument();
    expect(HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});
