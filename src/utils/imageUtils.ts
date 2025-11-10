import type { Anime } from '../types/anime';

/**
 * Normalizes an image URL to ensure it's valid
 * Some APIs return relative URLs or URLs without protocol
 */
const normalizeImageUrl = (url: string | null | undefined): string | null => {
  if (!url || url.trim() === '' || url === 'null' || url === 'undefined') {
    return null;
  }

  // If it's already a data URI or absolute URL, return as is
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a relative URL starting with //, add https:
  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  // If it's a relative URL, try to construct absolute URL
  // Note: This assumes the API base URL, but Jikan API should return absolute URLs
  return url;
};

/**
 * Gets a safe image URL from an anime object with multiple fallbacks
 * @param anime - The anime object
 * @param preferLarge - Whether to prefer large images (default: true)
 * @returns A valid image URL or a placeholder
 */
export const getAnimeImageUrl = (anime: Anime | null | undefined, preferLarge: boolean = true): string => {
  if (!anime || !anime.images) {
    return getPlaceholderImage();
  }

  // Try JPG images first
  if (anime.images.jpg) {
    if (preferLarge && anime.images.jpg.large_image_url) {
      const normalized = normalizeImageUrl(anime.images.jpg.large_image_url);
      if (normalized) return normalized;
    }
    if (anime.images.jpg.image_url) {
      const normalized = normalizeImageUrl(anime.images.jpg.image_url);
      if (normalized) return normalized;
    }
    if (anime.images.jpg.small_image_url) {
      const normalized = normalizeImageUrl(anime.images.jpg.small_image_url);
      if (normalized) return normalized;
    }
  }

  // Fallback to WebP images
  if (anime.images.webp) {
    if (preferLarge && anime.images.webp.large_image_url) {
      const normalized = normalizeImageUrl(anime.images.webp.large_image_url);
      if (normalized) return normalized;
    }
    if (anime.images.webp.image_url) {
      const normalized = normalizeImageUrl(anime.images.webp.image_url);
      if (normalized) return normalized;
    }
    if (anime.images.webp.small_image_url) {
      const normalized = normalizeImageUrl(anime.images.webp.small_image_url);
      if (normalized) return normalized;
    }
  }

  return getPlaceholderImage();
};

/**
 * Gets a placeholder image URL
 * Using a data URI for a simple placeholder with anime-themed design
 */
export const getPlaceholderImage = (): string => {
  // Using an SVG placeholder with anime-themed design
  const svg = `
    <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1A1F3A;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#252B4A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1A1F3A;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#grad)"/>
      <circle cx="150" cy="150" r="40" fill="none" stroke="#FF6B9D" stroke-width="2" opacity="0.5"/>
      <circle cx="150" cy="150" r="25" fill="none" stroke="#9B59B6" stroke-width="2" opacity="0.5"/>
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="16" fill="#8B8BA8" text-anchor="middle" dominant-baseline="middle">
        No Image
      </text>
      <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="12" fill="#8B8BA8" text-anchor="middle" dominant-baseline="middle" opacity="0.7">
        🎌
      </text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Checks if an image URL is valid
 * @param url - The image URL to check
 * @returns true if the URL appears valid
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || url.trim() === '') {
    return false;
  }
  
  // Check if it's a valid URL format
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    // If it's a relative URL or data URI, consider it valid
    return url.startsWith('/') || url.startsWith('data:');
  }
};

