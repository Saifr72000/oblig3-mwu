/**
 * Image helper utilities
 * Maps external API image URLs to local optimized WebP versions
 */

import imageMapping from './image-mapping.json';

type ImageMapping = {
  [filmId: string]: {
    poster?: string;
    banner?: string;
  };
};

const mapping = imageMapping as ImageMapping;

/**
 * Get optimized local image path for a film poster
 * Falls back to original URL if not found
 */
export function getFilmPoster(filmId: string, fallbackUrl: string): string {
  return mapping[filmId]?.poster || fallbackUrl;
}

/**
 * Get optimized local image path for a film banner
 * Falls back to original URL if not found
 */
export function getFilmBanner(filmId: string, fallbackUrl: string): string {
  return mapping[filmId]?.banner || fallbackUrl;
}

