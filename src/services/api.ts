import type { AnimeSearchResponse, AnimeDetailResponse } from '../types/anime';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const DEFAULT_LIMIT = 25; // Default items per page

export interface SearchAnimeParams {
  query: string;
  limit?: number;
  page?: number;
  signal?: AbortSignal;
}

export const searchAnime = async ({ query, limit = DEFAULT_LIMIT, page = 1, signal }: SearchAnimeParams): Promise<AnimeSearchResponse> => {
  // Jikan API uses 'limit' and 'page' parameters
  const url = new URL(`${JIKAN_BASE_URL}/anime`);
  url.searchParams.append('q', query);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('page', page.toString());
  
  const response = await fetch(url.toString(), {
    signal,
  });
  
  if (!response.ok) {
    throw new Error(`Failed to search anime: ${response.statusText}`);
  }
  
  return response.json();
};

export const getAnimeDetail = async (id: number): Promise<AnimeDetailResponse> => {
  const response = await fetch(`${JIKAN_BASE_URL}/anime/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch anime details: ${response.statusText}`);
  }
  
  return response.json();
};

export const getTopAnime = async (limit: number = 10, page: number = 1): Promise<AnimeSearchResponse> => {
  const url = new URL(`${JIKAN_BASE_URL}/top/anime`);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('page', page.toString());
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Failed to fetch top anime: ${response.statusText}`);
  }
  
  return response.json();
};

