import type { Anime, AnimeSearchResponse, AnimeDetailResponse } from '../types/anime';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const DEFAULT_LIMIT = 25; // Default items per page

export interface SearchAnimeParams {
  query?: string;
  limit?: number;
  page?: number;
  signal?: AbortSignal;
}

export const searchAnime = async ({ query, limit = DEFAULT_LIMIT, page = 1, signal }: SearchAnimeParams): Promise<AnimeSearchResponse> => {
  // Jikan API uses 'limit' and 'page' parameters
  const url = new URL(`${JIKAN_BASE_URL}/anime`);
  
  // Only add query parameter if provided (for text search)
  if (query && query.trim()) {
    url.searchParams.append('q', query.trim());
  }
  
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('page', page.toString());
  
  const response = await fetch(url.toString(), {
    signal,
  });
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Too Many Requests');
    }
    throw new Error(`Failed to search anime: ${response.statusText}`);
  }
  
  return response.json();
};

export const getAnimeDetail = async (id: number): Promise<AnimeDetailResponse> => {
  const response = await fetch(`${JIKAN_BASE_URL}/anime/${id}`);
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Too Many Requests');
    }
    throw new Error(`Failed to fetch anime details: ${response.statusText}`);
  }
  
  return response.json();
};

export const getTopAnime = async (limit: number = 10, page: number = 1, signal?: AbortSignal): Promise<AnimeSearchResponse> => {
  const url = new URL(`${JIKAN_BASE_URL}/top/anime`);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('page', page.toString());
  
  const response = await fetch(url.toString(), {
    signal,
  });
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Too Many Requests');
    }
    throw new Error(`Failed to fetch top anime: ${response.statusText}`);
  }
  
  return response.json();
};

// Rate limiting: Jikan API allows 3 requests per second
// Add a small delay to respect rate limits
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getRandomAnime = async (): Promise<Anime> => {
  // Use a more efficient approach: fetch a single random page
  // This reduces API calls and respects rate limits better
  const randomPage = Math.floor(Math.random() * 50) + 1;
  
  try {
    // Add a small delay to respect rate limits (400ms = ~2.5 requests/second)
    await delay(400);
    
    const response = await getTopAnime(25, randomPage);
    const nonHentaiAnime = response.data.filter(
      (anime) =>
        !anime.genres.some((g) => g.name.toLowerCase() === 'hentai') &&
        !anime.explicit_genres.some((g) => g.name.toLowerCase() === 'hentai')
    );
    
    if (nonHentaiAnime.length > 0) {
      // Return a random anime from the filtered list
      const randomIndex = Math.floor(Math.random() * nonHentaiAnime.length);
      return nonHentaiAnime[randomIndex];
    }
    
    // If no non-hentai anime found on this page, try page 1 (most popular)
    if (randomPage !== 1) {
      await delay(400);
      const fallbackResponse = await getTopAnime(25, 1);
      const fallbackNonHentai = fallbackResponse.data.filter(
        (anime) =>
          !anime.genres.some((g) => g.name.toLowerCase() === 'hentai') &&
          !anime.explicit_genres.some((g) => g.name.toLowerCase() === 'hentai')
      );
      
      if (fallbackNonHentai.length > 0) {
        const randomIndex = Math.floor(Math.random() * fallbackNonHentai.length);
        return fallbackNonHentai[randomIndex];
      }
    }
    
    // If still no results, throw an error
    throw new Error('No suitable anime found. Please try again.');
  } catch (error) {
    // Check if it's a rate limit error
    if (error instanceof Error) {
      if (error.message.includes('Too Many Requests') || error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
      }
      // Re-throw the original error
      throw error;
    }
    throw new Error('Failed to fetch random anime. Please try again.');
  }
};

