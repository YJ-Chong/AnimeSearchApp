import type { Anime } from '../types/anime';

/**
 * Normalizes an image URL to ensure it's valid
 * Some APIs return relative URLs or URLs without protocol
 */
const normalizeImageUrl = (url: string | null | undefined): string | null => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  
  // Check for empty or invalid string values
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined' || trimmed === 'N/A') {
    return null;
  }

  // If it's already a data URI or absolute URL, return as is
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it's a relative URL starting with //, add https:
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  // If it's a relative URL starting with /, try to construct absolute URL
  // Jikan API images are typically on cdn.myanimelist.net
  if (trimmed.startsWith('/')) {
    // If it looks like a Jikan/MAL image path, prepend the CDN domain
    if (trimmed.includes('images') || trimmed.includes('anime')) {
      return `https://cdn.myanimelist.net${trimmed}`;
    }
    return trimmed;
  }

  // Return as is if it looks like a valid URL path
  return trimmed;
};

/**
 * Gets a safe image URL from an anime object with multiple fallbacks
 * @param anime - The anime object
 * @param preferLarge - Whether to prefer large images (default: true)
 * @returns A valid image URL or a placeholder
 */
export const getAnimeImageUrl = (anime: Anime | null | undefined, preferLarge: boolean = true): string => {
  if (!anime) {
    return getPlaceholderImage();
  }

  // Check if images object exists and is valid
  if (!anime.images || (typeof anime.images !== 'object')) {
    return getPlaceholderImage();
  }

  // Try JPG images first
  if (anime.images.jpg && typeof anime.images.jpg === 'object') {
    // Try large image first if preferred
    if (preferLarge && anime.images.jpg.large_image_url) {
      const normalized = normalizeImageUrl(anime.images.jpg.large_image_url);
      if (normalized && isValidImageUrl(normalized)) return normalized;
    }
    // Try regular image URL
    if (anime.images.jpg.image_url) {
      const normalized = normalizeImageUrl(anime.images.jpg.image_url);
      if (normalized && isValidImageUrl(normalized)) return normalized;
    }
    // Try small image as last resort
    if (anime.images.jpg.small_image_url) {
      const normalized = normalizeImageUrl(anime.images.jpg.small_image_url);
      if (normalized && isValidImageUrl(normalized)) return normalized;
    }
  }

  // Fallback to WebP images
  if (anime.images.webp && typeof anime.images.webp === 'object') {
    // Try large image first if preferred
    if (preferLarge && anime.images.webp.large_image_url) {
      const normalized = normalizeImageUrl(anime.images.webp.large_image_url);
      if (normalized && isValidImageUrl(normalized)) return normalized;
    }
    // Try regular image URL
    if (anime.images.webp.image_url) {
      const normalized = normalizeImageUrl(anime.images.webp.image_url);
      if (normalized && isValidImageUrl(normalized)) return normalized;
    }
    // Try small image as last resort
    if (anime.images.webp.small_image_url) {
      const normalized = normalizeImageUrl(anime.images.webp.small_image_url);
      if (normalized && isValidImageUrl(normalized)) return normalized;
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
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }
  
  const trimmed = url.trim();
  
  // Data URIs are always valid
  if (trimmed.startsWith('data:')) {
    return true;
  }
  
  // Check if it's a valid URL format
  try {
    const urlObj = new URL(trimmed);
    // Only allow http and https protocols
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    // If it's a relative URL starting with /, consider it potentially valid
    // (though we should normalize it first)
    return trimmed.startsWith('/');
  }
};

