import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { OwnerSidebar } from "@/components/layouts/owner-sidebar";

const { venuesMy } = vi.hoisted(() => ({
  venuesMy: vi.fn().mockResolvedValue({ success: true, message: "ok", data: [] }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/kyc",
}));

vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
      React.createElement("a", { href, ...props }, children),
  };
});

vi.mock("@/lib/auth", () => ({
  authService: {
    getCurrentUser: () => ({ id: 1, role: "Admin", email: "admin@gmail.com" }),
  },
}));

vi.mock("@/lib/api/client", () => ({
  api: {
    venues: {
      my: venuesMy,
    },
  },
}));

function renderSidebar() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <OwnerSidebar />
    </QueryClientProvider>,
  );
}

describe("OwnerSidebar admin behavior", () => {
  it("does not fetch owner venues for admin users", async () => {
    renderSidebar();

    expect(screen.getByText("Duyệt chủ sân")).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(venuesMy).not.toHaveBeenCalled();
  });
});
