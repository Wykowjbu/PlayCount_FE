import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { PlayerHeader } from "@/components/layouts/player-header";
import { PlayerMobileNav } from "@/components/layouts/player-mobile-nav";
import { OwnerSidebar } from "@/components/layouts/owner-sidebar";
import { LayoutWrapper } from "@/components/layouts/layout-wrapper";

// Mock next/navigation with dynamic pathname support
let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Layout Shell Components", () => {
  describe("PlayerHeader", () => {
    it("renders a <header> element", () => {
      const { container } = render(<PlayerHeader />);
      const headerElement = container.querySelector("header");
      expect(headerElement).toBeInTheDocument();
    });

    it("displays the PlayCourt logo", () => {
      render(<PlayerHeader />);
      expect(screen.getByText("PlayCourt")).toBeInTheDocument();
    });

    it("displays the navigation links", () => {
      render(<PlayerHeader />);
      expect(screen.getByText("Tìm sân")).toBeInTheDocument();
      expect(screen.getByText("Tìm trận")).toBeInTheDocument();
      expect(screen.getByText("Booking")).toBeInTheDocument();
    });
  });

  describe("PlayerMobileNav", () => {
    it("renders a <nav> element", () => {
      const { container } = render(<PlayerMobileNav />);
      const navElement = container.querySelector("nav");
      expect(navElement).toBeInTheDocument();
    });

    it("displays the mobile tab labels", () => {
      render(<PlayerMobileNav />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Sân")).toBeInTheDocument();
      expect(screen.getByText("Trận")).toBeInTheDocument();
      expect(screen.getByText("Tôi")).toBeInTheDocument();
    });

    it("renders the central add action button", () => {
      render(<PlayerMobileNav />);
      const addButton = screen.getByRole("button", { name: "Tạo mới nhanh" });
      expect(addButton).toBeInTheDocument();
    });
  });

  describe("OwnerSidebar", () => {
    it("renders an <aside> element", () => {
      const { container } = render(<OwnerSidebar />);
      const asideElement = container.querySelector("aside");
      expect(asideElement).toBeInTheDocument();
    });

    it("contains a venue selector select dropdown", () => {
      render(<OwnerSidebar />);
      const selectElement = screen.getByRole("combobox");
      expect(selectElement).toBeInTheDocument();
    });
  });

  describe("LayoutWrapper", () => {
    it("renders Player layout (Header & MobileNav) on public routes", () => {
      mockPathname = "/courts";
      render(
        <LayoutWrapper>
          <div data-testid="child">Public Content</div>
        </LayoutWrapper>
      );
      
      expect(screen.getByTestId("player-header")).toBeInTheDocument();
      expect(screen.getByTestId("player-mobile-nav")).toBeInTheDocument();
      expect(screen.queryByTestId("owner-sidebar")).not.toBeInTheDocument();
      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("renders Pro layout (OwnerSidebar) on owner routes", () => {
      mockPathname = "/owner/dashboard";
      render(
        <LayoutWrapper>
          <div data-testid="child">Owner Content</div>
        </LayoutWrapper>
      );
      
      expect(screen.queryByTestId("player-header")).not.toBeInTheDocument();
      expect(screen.queryByTestId("player-mobile-nav")).not.toBeInTheDocument();
      expect(screen.getByTestId("owner-sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("child")).toBeInTheDocument();
    });
  });
});
