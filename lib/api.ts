// API fetching utilities with error handling
// All data is fetched at build time for static export
import type { Film, Person, Species, Location, Vehicle } from "./types";

const API_BASE = "https://ghibliapi.vercel.app";

/**
 * Fetch all films from the API
 * This will run at build time for static generation
 */
export async function fetchFilms(): Promise<Film[]> {
  try {
    const response = await fetch(`${API_BASE}/films`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch films: ${response.status}`);
    }

    const data: Film[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching films:", error);
    return [];
  }
}

/**
 * Fetch a single film by ID
 */
export async function fetchFilm(id: string): Promise<Film | null> {
  try {
    const response = await fetch(`${API_BASE}/films/${id}`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch film: ${response.status}`);
    }

    const data: Film = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching film ${id}:`, error);
    return null;
  }
}

/**
 * Fetch a person by URL
 */
export async function fetchPerson(url: string): Promise<Person | null> {
  try {
    const response = await fetch(url, {
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch person: ${response.status}`);
    }

    const data: Person = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching person:", error);
    return null;
  }
}

/**
 * Fetch species by ID
 */
export async function fetchSpecies(id: string): Promise<Species | null> {
  try {
    const response = await fetch(`${API_BASE}/species/${id}`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch species: ${response.status}`);
    }

    const data: Species = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching species ${id}:`, error);
    return null;
  }
}

/**
 * Fetch species by URL
 */
export async function fetchSpeciesByUrl(url: string): Promise<Species | null> {
  try {
    const response = await fetch(url, {
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch species: ${response.status}`);
    }

    const data: Species = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching species:", error);
    return null;
  }
}

/**
 * Fetch location by URL
 */
export async function fetchLocation(url: string): Promise<Location | null> {
  try {
    const response = await fetch(url, {
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch location: ${response.status}`);
    }

    const data: Location = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
}

/**
 * Fetch vehicle by URL
 */
export async function fetchVehicle(url: string): Promise<Vehicle | null> {
  try {
    const response = await fetch(url, {
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle: ${response.status}`);
    }

    const data: Vehicle = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return null;
  }
}

/**
 * Fetch film by URL
 */
export async function fetchFilmByUrl(url: string): Promise<Film | null> {
  try {
    const response = await fetch(url, {
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch film: ${response.status}`);
    }

    const data: Film = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching film:", error);
    return null;
  }
}

/**
 * Helper to check if a resource URL is valid
 */
export function isValidResourceUrl(url: string | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const parts = url.split("/").filter((part) => part.length > 0);
  const lastPart = parts[parts.length - 1];
  return !["people", "locations", "species", "vehicles", "films"].includes(
    lastPart
  );
}

/**
 * Helper to extract ID from URL
 */
export function extractIdFromUrl(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1] || parts[parts.length - 2];
}
