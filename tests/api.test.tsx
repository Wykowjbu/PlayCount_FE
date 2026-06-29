import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, fetchVenues } from "../src/lib/api/client";

describe("Client API Wrapper Tests", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("fetches paged venues from backend API", async () => {
    const response = {
      success: true,
      message: "ok",
      data: [{ id: "10", name: "Sân Test Online" }],
      errors: [],
      totalCount: 1,
      totalPages: 1,
      pageIndex: 1,
      pageSize: 12,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(response),
    } as unknown as Response);

    const result = await fetchVenues({ Keyword: "test", PageIndex: 1, PageSize: 12 });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/Venues?Keyword=test&PageIndex=1&PageSize=12"), expect.any(Object));
    expect(result).toEqual(response);
  });

  it("does not fallback to local mock data when fetch throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError("fetch failed"));
    await expect(fetchVenues({ SportId: 1 })).rejects.toThrow("fetch failed");
  });

  it("throws normalized ApiError when backend returns a non-ok status", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({ success: false, message: "Not found", errors: ["missing"] }),
    } as unknown as Response);

    await expect(fetchVenues({ PageIndex: 1 })).rejects.toMatchObject({
      status: 404,
      message: "Not found",
      errors: ["missing"],
    } satisfies Partial<ApiError>);
  });
});
