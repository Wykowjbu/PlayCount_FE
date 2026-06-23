import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchVenues, MOCK_VENUES } from "../src/lib/api/client";

describe("Client API Wrapper Tests", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should fetch from backend API successfully when online", async () => {
    const mockApiResponse = [
      {
        id: "10",
        name: "Sân Test Online",
        image: "",
        sport: "Tennis",
        rating: 5.0,
        nearestSlot: "12:00 - 14:00",
        price: 150000,
        distance: 1.0,
        amenities: ["Wifi"],
        location: "Quận 1",
      }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as unknown as Response);

    const result = await fetchVenues({ sport: "Tennis" });
    expect(global.fetch).toHaveBeenCalled();
    expect(result).toEqual(mockApiResponse);
  });

  it("should fallback to local mock data when fetch throws an error (offline)", async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError("fetch failed"));

    const result = await fetchVenues({ sport: "Badminton" });
    expect(global.fetch).toHaveBeenCalled();
    const expected = MOCK_VENUES.filter(v => v.sport.toLowerCase() === "badminton");
    expect(result.length).toBe(expected.length);
    expect(result[0].sport).toBe("Badminton");
  });

  it("should fallback to local mock data when backend returns a non-ok status", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    } as unknown as Response);

    const result = await fetchVenues({ sport: "Tennis" });
    expect(global.fetch).toHaveBeenCalled();
    const expected = MOCK_VENUES.filter(v => v.sport.toLowerCase() === "tennis");
    expect(result.length).toBe(expected.length);
    expect(result[0].sport).toBe("Tennis");
  });

  it("should filter local mock data by multiple options correctly", async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError("offline"));

    const result1 = await fetchVenues({ location: "Quận 10", sport: "Badminton" });
    expect(result1.every(v => v.location.includes("Quận 10") && v.sport === "Badminton")).toBe(true);

    const result2 = await fetchVenues({ priceMin: 90000, priceMax: 120000 });
    expect(result2.every(v => v.price >= 90000 && v.price <= 120000)).toBe(true);

    const result3 = await fetchVenues({ amenities: ["Wifi", "Parking"] });
    expect(result3.every(v => v.amenities.includes("Wifi") && v.amenities.includes("Parking"))).toBe(true);

    const result4 = await fetchVenues({ distance: 1.5 });
    expect(result4.every(v => v.distance <= 1.5)).toBe(true);
  });
});