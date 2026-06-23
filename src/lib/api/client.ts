export interface Venue {
  id: string;
  name: string;
  image: string;
  sport: string;
  rating: number;
  nearestSlot: string;
  price: number; // price per hour in VND, e.g. 100000
  distance: number; // distance in km, e.g. 1.2
  amenities: string[]; // e.g. ["Wifi", "Parking", "Shower", "Drinks"]
  location: string; // e.g. "Quận 10, TP. HCM"
}

export interface VenueFilters {
  location?: string;
  sport?: string;
  date?: string;
  distance?: number; // max distance in km
  priceMin?: number;
  priceMax?: number;
  amenities?: string[];
}

export const MOCK_VENUES: Venue[] = [
  {
    id: "1",
    name: "Sân Cầu Lông Kỳ Hòa",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=60",
    sport: "Badminton",
    rating: 4.8,
    nearestSlot: "18:00 - 20:00 Hôm nay",
    price: 100000,
    distance: 1.2,
    amenities: ["Wifi", "Parking", "Shower"],
    location: "Quận 10, TP. HCM",
  },
  {
    id: "2",
    name: "Sân Tennis Hồ Xuân Hương",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
    sport: "Tennis",
    rating: 4.6,
    nearestSlot: "08:00 - 10:00 Ngày mai",
    price: 200000,
    distance: 2.5,
    amenities: ["Parking", "Drinks"],
    location: "Quận 3, TP. HCM",
  },
  {
    id: "3",
    name: "Sân Bóng Đá Phú Thọ",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60",
    sport: "Football",
    rating: 4.5,
    nearestSlot: "19:00 - 21:00 Hôm nay",
    price: 350000,
    distance: 3.1,
    amenities: ["Parking", "Shower", "Drinks"],
    location: "Quận 11, TP. HCM",
  },
  {
    id: "4",
    name: "Sân Bóng Rổ Phan Đình Phùng",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60",
    sport: "Basketball",
    rating: 4.7,
    nearestSlot: "17:00 - 19:00 Ngày mai",
    price: 150000,
    distance: 1.8,
    amenities: ["Wifi", "Drinks"],
    location: "Quận 3, TP. HCM",
  },
  {
    id: "5",
    name: "Sân Cầu Lông Viettel",
    image: "https://images.unsplash.com/photo-1521537634199-673cf82ca3d6?w=800&auto=format&fit=crop&q=60",
    sport: "Badminton",
    rating: 4.4,
    nearestSlot: "20:00 - 22:00 Hôm nay",
    price: 80000,
    distance: 0.8,
    amenities: ["Wifi", "Parking"],
    location: "Quận 10, TP. HCM",
  },
];

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5187";

export async function fetchVenues(filters: VenueFilters = {}): Promise<Venue[]> {
  try {
    const params = new URLSearchParams();
    if (filters.location) params.append("location", filters.location);
    if (filters.sport) params.append("sport", filters.sport);
    if (filters.date) params.append("date", filters.date);
    if (filters.distance !== undefined) params.append("distance", filters.distance.toString());
    if (filters.priceMin !== undefined) params.append("priceMin", filters.priceMin.toString());
    if (filters.priceMax !== undefined) params.append("priceMax", filters.priceMax.toString());
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach((amenity) => params.append("amenities", amenity));
    }

    const response = await fetch(`${BASE_URL}/api/venues?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(2000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("Backend API not reachable or failed, falling back to mock data.", error);
    return filterMockData(MOCK_VENUES, filters);
  }
}

export async function fetchVenueById(id: string): Promise<Venue | undefined> {
  try {
    const response = await fetch(`${BASE_URL}/api/venues/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(2000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("Backend API failed, falling back to mock venue details.", error);
    return MOCK_VENUES.find((v) => v.id === id);
  }
}

function filterMockData(data: Venue[], filters: VenueFilters): Venue[] {
  return data.filter((venue) => {
    if (filters.location && !venue.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.sport && filters.sport !== "Tất cả" && venue.sport.toLowerCase() !== filters.sport.toLowerCase()) {
      return false;
    }
    if (filters.distance !== undefined && venue.distance > filters.distance) {
      return false;
    }
    if (filters.priceMin !== undefined && venue.price < filters.priceMin) {
      return false;
    }
    if (filters.priceMax !== undefined && venue.price > filters.priceMax) {
      return false;
    }
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) =>
        venue.amenities.some((a) => a.toLowerCase() === amenity.toLowerCase())
      );
      if (!hasAllAmenities) return false;
    }
    return true;
  });
}