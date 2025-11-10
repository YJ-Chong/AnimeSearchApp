import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAnimeSearch } from '../store/slices/animeSlice';
import MarqueeText from '../components/MarqueeText';
import FilterBar, { SortOption, ViewMode } from '../components/FilterBar';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import SkeletonListItem from '../components/SkeletonListItem';
import EmptyState from '../components/EmptyState';
import { getAnimeImageUrl, getPlaceholderImage } from '../utils/imageUtils';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemButton,
} from '@mui/material';

const DEBOUNCE_DELAY = 250; // milliseconds
const ITEMS_PER_PAGE = 25; // Default items per page

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('rating-high');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { searchResults, loading, error, pagination, searchQuery } = useAppSelector((state) => state.anime);
  const debounceTimerRef = useRef<number | null>(null);
  const previousRequestRef = useRef<{ abort: () => void } | null>(null);

  // Restore query from Redux state on mount (for page refresh scenarios)
  // This ensures that if you refresh the page, the query is restored and search is triggered
  useEffect(() => {
    if (searchQuery && !query) {
      setQuery(searchQuery);
      // Trigger search immediately if we have a searchQuery but no results
      if (searchResults.length === 0) {
        dispatch(
          fetchAnimeSearch({
            query: searchQuery,
            limit: ITEMS_PER_PAGE,
            page: 1,
          })
        );
      }
    }
  }, []); // Only run on mount

  // Reset to page 1 when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  // Sync currentPage with server pagination response
  // This handles cases where server corrects invalid page numbers (e.g., page 100 when only 10 pages exist)
  const prevServerPageRef = useRef<number | null>(null);
  useEffect(() => {
    if (pagination && pagination.currentPage !== prevServerPageRef.current) {
      prevServerPageRef.current = pagination.currentPage;
      // Only update if server page differs from our local state (server corrected invalid page)
      if (pagination.currentPage !== currentPage) {
        setCurrentPage(pagination.currentPage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.currentPage]);

  useEffect(() => {
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Cancel any in-flight request using Redux Toolkit's abort capability
    if (previousRequestRef.current) {
      previousRequestRef.current.abort();
      previousRequestRef.current = null;
    }

    const trimmedQuery = query.trim();

    // If query is empty, clear results
    if (!trimmedQuery) {
      return;
    }

    // Set up debounce timer
    debounceTimerRef.current = window.setTimeout(() => {
      // Dispatch search action with pagination parameters
      const requestPromise = dispatch(
        fetchAnimeSearch({
          query: trimmedQuery,
          limit: ITEMS_PER_PAGE,
          page: currentPage,
        })
      );
      const requestAbort = { abort: () => requestPromise.abort() };
      previousRequestRef.current = requestAbort;
      
      // Clear the reference when the request completes, but only if it's still the current request
      requestPromise.finally(() => {
        if (previousRequestRef.current === requestAbort) {
          previousRequestRef.current = null;
        }
      });
    }, DEBOUNCE_DELAY);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (previousRequestRef.current) {
        previousRequestRef.current.abort();
        previousRequestRef.current = null;
      }
    };
  }, [query, currentPage, dispatch]);

  const handleCardClick = (id: number) => {
    navigate(`/anime/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setSortOption('rating-high');
    setQuery('');
    setCurrentPage(1);
  };

  const handleTryDifferent = () => {
    setQuery('');
    setSelectedGenres([]);
    setSortOption('rating-high');
    setCurrentPage(1);
  };

  // Filter and sort anime results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...searchResults];

    // Apply genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((anime) =>
        selectedGenres.some((genre) =>
          anime.genres.some((g) => g.name === genre)
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'rating-high':
          return (b.score || 0) - (a.score || 0);
        case 'rating-low':
          return (a.score || 0) - (b.score || 0);
        case 'name-az':
          return (a.title || '').localeCompare(b.title || '');
        case 'name-za':
          return (b.title || '').localeCompare(a.title || '');
        case 'newest':
          const aYear = a.year || 0;
          const bYear = b.year || 0;
          return bYear - aYear;
        case 'oldest':
          const aYearOld = a.year || 9999;
          const bYearOld = b.year || 9999;
          return aYearOld - bYearOld;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchResults, selectedGenres, sortOption]);

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4,
          animation: 'fadeInUp 0.6s ease-out',
          background: 'var(--gradient-paper)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 3,
            fontSize: { xs: '2rem', md: '3rem' },
            textShadow: '0 0 30px var(--shadow-glow)',
            letterSpacing: '2px',
            color: 'var(--text-primary)',
          }}
        >
           Anime Search 
        </Typography>
      </Paper>

      {/* Filter Bar */}
      <FilterBar
        animeList={searchResults}
        searchQuery={query}
        onSearchChange={setQuery}
        onSortChange={setSortOption}
        onGenreFilterChange={setSelectedGenres}
        onViewModeChange={setViewMode}
        sortValue={sortOption}
        selectedGenres={selectedGenres}
        viewMode={viewMode}
      />

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            animation: 'fadeInUp 0.5s ease-out',
            background: 'var(--bg-hover-secondary)',
            border: '1px solid var(--border-hover)',
            borderRadius: 3,
            color: 'var(--text-primary)',
            '& .MuiAlert-icon': {
              color: 'var(--accent-error)',
            },
          }}
        >
          {error}
        </Alert>
      )}

      {loading && (query || searchQuery) && (
        <Box
          sx={{
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  lg={3} 
                  key={`skeleton-${index}`}
                  sx={{
                    animation: `fadeInUp 0.4s ease-out ${index * 0.03}s both`,
                  }}
                >
                  <SkeletonCard index={index} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <List
              sx={{
                animation: 'fadeIn 0.3s ease-in',
              }}
            >
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <SkeletonListItem key={`skeleton-list-${index}`} index={index} />
              ))}
            </List>
          )}
        </Box>
      )}

      {!loading && filteredAndSortedResults.length > 0 && (
        <Box
          className="content-fade-in"
          sx={{
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {filteredAndSortedResults.map((anime, index) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  lg={3} 
                  key={anime.mal_id}
                  sx={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <Card 
                    className="anime-card"
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <CardActionArea 
                      onClick={() => handleCardClick(anime.mal_id)}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover .anime-image': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          height: 300,
                          background: 'var(--bg-active)',
                        }}
                      >
                        <CardMedia
                          className="anime-image"
                          component="img"
                          height="300"
                          image={getAnimeImageUrl(anime, true)}
                          alt={anime.title}
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const placeholder = getPlaceholderImage();
                            // Only set placeholder if current src is not already the placeholder
                            // This prevents infinite error loops
                            if (target.src !== placeholder && !target.src.includes('data:image/svg+xml')) {
                              target.src = placeholder;
                              target.onerror = null; // Prevent infinite loop
                            }
                          }}
                          sx={{ 
                            objectFit: 'cover',
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            height: '100%',
                            width: '100%',
                            backgroundColor: 'var(--bg-active)',
                          }}
                        />
                        {anime.score && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              background: 'var(--gradient-primary)',
                              borderRadius: '12px',
                              px: 1.5,
                              py: 0.5,
                              backdropFilter: 'blur(10px)',
                              boxShadow: '0 4px 15px var(--shadow-sm)',
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'var(--text-primary)',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              ⭐ {anime.score}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <CardContent 
                        sx={{ 
                          flexGrow: 1,
                          background: 'var(--gradient-paper)',
                        }}
                      >
                        <MarqueeText
                          text={anime.title}
                          variant="h6"
                          component="h2"
                          triggerOnHover={false}
                          speed={50}
                          sx={{
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            fontSize: '1.1rem',
                            mb: 1,
                            lineHeight: 1.4,
                            minHeight: '1.5em',
                          }}
                        />
                        <Typography 
                          variant="body2" 
                          noWrap
                          sx={{ 
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                          }}
                        >
                          {anime.title_english || anime.title_japanese || 'N/A'}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <List
              sx={{
                animation: 'fadeIn 0.5s ease-in',
              }}
            >
              {filteredAndSortedResults.map((anime, index) => (
                <ListItem
                  key={anime.mal_id}
                  disablePadding
                  sx={{
                    mb: 2,
                    animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <Card
                    className="anime-card"
                    sx={{
                      width: '100%',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateX(8px)',
                      },
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleCardClick(anime.mal_id)}
                      sx={{
                        p: 0,
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      <ListItemAvatar
                        sx={{
                          minWidth: 120,
                          height: 180,
                          mr: 2,
                        }}
                      >
                        <Avatar
                          variant="rounded"
                          src={getAnimeImageUrl(anime, true)}
                          alt={anime.title}
                          imgProps={{
                            loading: 'lazy',
                            onError: (e) => {
                              const target = e.target as HTMLImageElement;
                              const placeholder = getPlaceholderImage();
                              // Only set placeholder if current src is not already the placeholder
                              // This prevents infinite error loops
                              if (target.src !== placeholder && !target.src.includes('data:image/svg+xml')) {
                                target.src = placeholder;
                                // Remove the error handler to prevent infinite loop
                                if (target.onerror) {
                                  target.onerror = null;
                                }
                              }
                            },
                          }}
                          sx={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 2,
                            objectFit: 'cover',
                            backgroundColor: 'var(--bg-active)',
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                flex: 1,
                              }}
                            >
                              {anime.title}
                            </Typography>
                            {anime.score && (
                              <Box
                                sx={{
                                  background: 'var(--gradient-primary)',
                                  borderRadius: '12px',
                                  px: 1.5,
                                  py: 0.5,
                                  backdropFilter: 'blur(10px)',
                                  boxShadow: '0 4px 15px var(--shadow-sm)',
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: 'var(--text-primary)',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                  }}
                                >
                                  ⭐ {anime.score}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'var(--text-secondary)',
                                mb: 1,
                              }}
                            >
                              {anime.title_english || anime.title_japanese || 'N/A'}
                            </Typography>
                            {anime.synopsis && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'var(--text-tertiary)',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  mb: 1,
                                }}
                              >
                                {anime.synopsis}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                              {anime.genres.slice(0, 5).map((genre) => (
                                <Typography
                                  key={genre.mal_id}
                                  variant="caption"
                                  sx={{
                                    color: 'var(--accent-primary)',
                                    backgroundColor: 'var(--bg-hover)',
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    border: '1px solid var(--border-secondary)',
                                  }}
                                >
                                  {genre.name}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        }
                        sx={{
                          py: 2,
                          pr: 2,
                        }}
                      />
                    </ListItemButton>
                  </Card>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}

      {/* Pagination Component */}
      {pagination && pagination.lastVisiblePage > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.lastVisiblePage}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          currentPageItems={pagination.currentPageItems}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}

      {/* Empty states - only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Filtered out results - user has filters applied but no matches */}
          {filteredAndSortedResults.length === 0 && query && searchResults.length > 0 && (
            <EmptyState
              type="filtered"
              onClearFilters={handleClearFilters}
              onTryDifferent={handleTryDifferent}
              hasFilters={selectedGenres.length > 0 || sortOption !== 'rating-high'}
            />
          )}

          {/* No search results - user searched but got no results */}
          {searchResults.length === 0 && (query || searchQuery) && (
            <EmptyState
              type="no-results"
              onClearFilters={handleClearFilters}
              onTryDifferent={handleTryDifferent}
              hasFilters={selectedGenres.length > 0 || sortOption !== 'rating-high'}
            />
          )}

          {/* Initial state - no query, no results */}
          {searchResults.length === 0 && !query && !searchQuery && (
            <EmptyState
              type="initial"
              onClearFilters={handleClearFilters}
              onTryDifferent={handleTryDifferent}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default SearchPage;

