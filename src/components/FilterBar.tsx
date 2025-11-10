import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Button,
  ButtonGroup,
  Chip,
  Typography,
  Collapse,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Shuffle as ShuffleIcon,
} from '@mui/icons-material';
import type { Anime } from '../types/anime';
import { getRandomAnime } from '../services/api';

export type SortOption = 'rating-high' | 'rating-low' | 'name-az' | 'name-za' | 'newest' | 'oldest';
export type ViewMode = 'grid' | 'list';

interface FilterBarProps {
  animeList: Anime[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  genreSearchQuery: string;
  onGenreSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
  onGenreFilterChange: (genres: string[]) => void;
  onViewModeChange: (mode: ViewMode) => void;
  sortValue: SortOption;
  selectedGenres: string[];
  viewMode: ViewMode;
}

const FilterBar = ({
  animeList,
  searchQuery,
  onSearchChange,
  genreSearchQuery,
  onGenreSearchChange,
  onSortChange,
  onGenreFilterChange,
  onViewModeChange,
  sortValue,
  selectedGenres,
  viewMode,
}: FilterBarProps) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(true);
  const [showAdditionalSearch, setShowAdditionalSearch] = useState(false);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [genreAutocompleteOpen, setGenreAutocompleteOpen] = useState(false);
  const [genreAutocompleteOptions, setGenreAutocompleteOptions] = useState<string[]>([]);
  const [randomAnimeLoading, setRandomAnimeLoading] = useState(false);
  const [randomAnimeError, setRandomAnimeError] = useState<string | null>(null);
  const [lastRandomClick, setLastRandomClick] = useState<number>(0);

  // Extract unique genres from anime list
  const availableGenres = useMemo(() => {
    const genreSet = new Set<string>();
    animeList.forEach((anime) => {
      anime.genres.forEach((genre) => {
        genreSet.add(genre.name);
      });
    });
    return Array.from(genreSet).sort();
  }, [animeList]);


  // Generate autocomplete suggestions from anime titles
  useEffect(() => {
    if (searchQuery.length > 0) {
      const suggestions = animeList
        .map((anime) => [
          anime.title,
          anime.title_english,
          anime.title_japanese,
          ...anime.title_synonyms,
        ])
        .flat()
        .filter((title): title is string => title !== null && title !== undefined)
        .filter((title) =>
          title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 10);
      setAutocompleteOptions(suggestions);
    } else {
      setAutocompleteOptions([]);
    }
  }, [searchQuery, animeList]);

  // Generate autocomplete suggestions for genres
  useEffect(() => {
    if (genreSearchQuery.length > 0) {
      const suggestions = availableGenres
        .filter((genre) =>
          genre.toLowerCase().includes(genreSearchQuery.toLowerCase())
        )
        .slice(0, 10);
      setGenreAutocompleteOptions(suggestions);
    } else {
      setGenreAutocompleteOptions([]);
    }
  }, [genreSearchQuery, availableGenres]);


  const handleGenreToggle = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    onGenreFilterChange(newGenres);
  };

  const handleClearFilters = () => {
    onGenreFilterChange([]);
    onSortChange('rating-high');
    onSearchChange('');
    onGenreSearchChange('');
  };

  const handleRandomAnime = async () => {
    // Rate limiting: prevent clicks too frequently (minimum 1 second between clicks)
    const now = Date.now();
    const timeSinceLastClick = now - lastRandomClick;
    if (timeSinceLastClick < 1000) {
      setRandomAnimeError('Please wait a moment before trying again.');
      setTimeout(() => setRandomAnimeError(null), 3000);
      return;
    }
    
    setLastRandomClick(now);
    setRandomAnimeError(null);
    setRandomAnimeLoading(true);
    
    try {
      const randomAnime = await getRandomAnime();
      // Use replace: false to allow proper browser history navigation
      // This ensures back button works correctly
      navigate(`/anime/${randomAnime.mal_id}`, { replace: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch random anime. Please try again.';
      setRandomAnimeError(errorMessage);
      // Clear error after 5 seconds
      setTimeout(() => setRandomAnimeError(null), 5000);
    } finally {
      setRandomAnimeLoading(false);
    }
  };

  return (
    <>
      <Snackbar
        open={!!randomAnimeError}
        autoHideDuration={5000}
        onClose={() => setRandomAnimeError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setRandomAnimeError(null)}
          severity="error"
          sx={{
            background: 'var(--bg-hover-secondary)',
            border: '1px solid var(--border-hover)',
            color: 'var(--text-primary)',
            '& .MuiAlert-icon': {
              color: 'var(--accent-error)',
            },
          }}
        >
          {randomAnimeError}
        </Alert>
      </Snackbar>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          mb: { xs: 2, sm: 3, md: 4 },
          animation: 'fadeInUp 0.6s ease-out',
          background: 'var(--gradient-paper)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-primary)',
        }}
      >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: { xs: 1.5, sm: 2 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
              <FilterIcon sx={{ color: 'var(--accent-primary)', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Filters & Search
              </Typography>
            </Box>
        <IconButton
          onClick={() => setShowFilters(!showFilters)}
          sx={{
            color: 'var(--accent-primary)',
            '&:hover': {
              backgroundColor: 'var(--bg-hover)',
            },
          }}
        >
          {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={showFilters}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Search with Autocomplete */}
          <Box>
            <Autocomplete
              freeSolo
              open={autocompleteOpen && autocompleteOptions.length > 0}
              onOpen={() => setAutocompleteOpen(true)}
              onClose={() => setAutocompleteOpen(false)}
              options={autocompleteOptions}
              inputValue={searchQuery}
              onInputChange={(_, newValue) => {
                onSearchChange(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search anime"
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      minHeight: { xs: '48px', sm: '56px' },
                      '& fieldset': {
                        borderColor: 'var(--border-secondary)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'var(--border-hover)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'var(--border-focus)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'var(--text-secondary)',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'var(--accent-primary)',
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    backgroundColor: 'var(--bg-paper)',
                    color: 'var(--text-primary)',
                    '&:hover': {
                      backgroundColor: 'var(--bg-hover-secondary)',
                    },
                  }}
                >
                  {option}
                </Box>
              )}
              PaperComponent={({ children, ...other }) => (
                <Paper
                  {...other}
                  sx={{
                    background: 'var(--gradient-paper)',
                    border: '1px solid var(--border-secondary)',
                    mt: 1,
                  }}
                >
                  {children}
                </Paper>
              )}
            />
          </Box>

          <Divider sx={{ borderColor: 'var(--border-divider)' }} />

          {/* Additional Search Toggle */}
          <Box>
            <Button
              onClick={() => setShowAdditionalSearch(!showAdditionalSearch)}
              variant="outlined"
              fullWidth
              sx={{
                borderColor: 'var(--border-hover)',
                color: 'var(--text-primary)',
                textTransform: 'none',
                minHeight: { xs: '44px', sm: '40px' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                padding: { xs: '10px 16px', sm: '8px 20px' },
                '&:hover': {
                  borderColor: 'var(--border-focus)',
                  backgroundColor: 'var(--bg-hover)',
                },
              }}
            >
              {showAdditionalSearch ? 'Hide Additional Search' : 'Additional Search'}
            </Button>
          </Box>

          {/* Additional Search Bars */}
          <Collapse in={showAdditionalSearch}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Genre Search */}
              <Box>
                <Autocomplete
                  freeSolo
                  open={genreAutocompleteOpen && genreAutocompleteOptions.length > 0}
                  onOpen={() => setGenreAutocompleteOpen(true)}
                  onClose={() => setGenreAutocompleteOpen(false)}
                  options={genreAutocompleteOptions}
                  inputValue={genreSearchQuery}
                  onInputChange={(_, newValue) => {
                    onGenreSearchChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search by genre"
                      variant="outlined"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'var(--bg-input)',
                          color: 'var(--text-primary)',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          minHeight: { xs: '48px', sm: '56px' },
                          '& fieldset': {
                            borderColor: 'var(--border-secondary)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--border-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--border-focus)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--text-secondary)',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: 'var(--accent-primary)',
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      sx={{
                        backgroundColor: 'var(--bg-paper)',
                        color: 'var(--text-primary)',
                        '&:hover': {
                          backgroundColor: 'var(--bg-hover-secondary)',
                        },
                      }}
                    >
                      {option}
                    </Box>
                  )}
                  PaperComponent={({ children, ...other }) => (
                    <Paper
                      {...other}
                      sx={{
                        background: 'var(--gradient-paper)',
                        border: '1px solid var(--border-secondary)',
                        mt: 1,
                      }}
                    >
                      {children}
                    </Paper>
                  )}
                />
              </Box>

            </Box>
          </Collapse>

          <Divider sx={{ borderColor: 'var(--border-divider)' }} />

          {/* Sort and View Mode Controls */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              gap: { xs: 1.5, sm: 2 },
              alignItems: { xs: 'stretch', sm: 'center' },
            }}
          >
            <FormControl
              sx={{
                width: { xs: '100%', sm: 'auto' },
                minWidth: { xs: '100%', sm: 200 },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  minHeight: { xs: '48px', sm: '56px' },
                  '& fieldset': {
                    borderColor: 'var(--border-secondary)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--border-hover)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--border-focus)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text-secondary)',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--accent-primary)',
                },
              }}
            >
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortValue}
                label="Sort By"
                onChange={(e) => onSortChange(e.target.value as SortOption)}
              >
                <MenuItem value="rating-high">Rating: High to Low</MenuItem>
                <MenuItem value="rating-low">Rating: Low to High</MenuItem>
                <MenuItem value="name-az">Name: A to Z</MenuItem>
                <MenuItem value="name-za">Name: Z to A</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
              <ButtonGroup
                variant="outlined"
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  '& .MuiButton-root': {
                    borderColor: 'var(--border-hover)',
                    color: 'var(--text-primary)',
                    minHeight: { xs: '44px', sm: '40px' },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    padding: { xs: '10px 16px', sm: '8px 20px' },
                    '&:hover': {
                      borderColor: 'var(--border-focus)',
                      backgroundColor: 'var(--bg-hover)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'var(--bg-active)',
                      borderColor: 'var(--border-focus)',
                      color: 'var(--text-primary)',
                      '&:hover': {
                        backgroundColor: 'var(--bg-hover-secondary)',
                      },
                    },
                  },
                }}
              >
                <Button
                  onClick={() => onViewModeChange('grid')}
                  variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                  startIcon={<GridViewIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />}
                  sx={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    flex: { xs: 1, sm: 'none' },
                    ...(viewMode === 'grid' && {
                      background: 'var(--gradient-primary)',
                      '&:hover': {
                        background: 'var(--gradient-primary-hover)',
                      },
                    }),
                  }}
                >
                  Grid
                </Button>
                <Button
                  onClick={() => onViewModeChange('list')}
                  variant={viewMode === 'list' ? 'contained' : 'outlined'}
                  startIcon={<ListViewIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />}
                  sx={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    flex: { xs: 1, sm: 'none' },
                    ...(viewMode === 'list' && {
                      background: 'var(--gradient-primary)',
                      '&:hover': {
                        background: 'var(--gradient-primary-hover)',
                      },
                    }),
                  }}
                >
                  List
                </Button>
              </ButtonGroup>
              <Button
                onClick={handleRandomAnime}
                variant="outlined"
                fullWidth
                startIcon={randomAnimeLoading ? <CircularProgress size={16} sx={{ color: 'var(--text-primary)' }} /> : <ShuffleIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />}
                disabled={randomAnimeLoading}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  borderColor: 'var(--border-hover)',
                  color: 'var(--text-primary)',
                  minHeight: { xs: '44px', sm: '40px' },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  padding: { xs: '10px 16px', sm: '8px 20px' },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'var(--border-focus)',
                    backgroundColor: 'var(--bg-hover)',
                  },
                  '&:disabled': {
                    borderColor: 'var(--border-secondary)',
                    color: 'var(--text-secondary)',
                  },
                }}
              >
                Random Anime
              </Button>
            </Box>

            {(selectedGenres.length > 0 || sortValue !== 'rating-high' || genreSearchQuery) && (
              <Button
                onClick={handleClearFilters}
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  borderColor: 'var(--border-hover)',
                  color: 'var(--accent-error)',
                  minHeight: { xs: '44px', sm: '36px' },
                  fontSize: { xs: '0.875rem', sm: '0.875rem' },
                  padding: { xs: '8px 16px', sm: '6px 16px' },
                  '&:hover': {
                    borderColor: 'var(--accent-error)',
                    backgroundColor: 'var(--bg-hover)',
                  },
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>

          {/* Genre Checkboxes */}
          {availableGenres.length > 0 && (
            <>
              <Divider sx={{ borderColor: 'var(--border-divider)' }} />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'var(--text-secondary)', mb: { xs: 1, sm: 1.5 }, fontWeight: 600, fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                >
                  Genres
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: { xs: 0.75, sm: 1 },
                  }}
                >
                  {availableGenres.map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      onClick={() => handleGenreToggle(genre)}
                      clickable
                      variant={selectedGenres.includes(genre) ? 'filled' : 'outlined'}
                      sx={{
                        backgroundColor: selectedGenres.includes(genre)
                          ? 'var(--bg-active)'
                          : 'transparent',
                        borderColor: selectedGenres.includes(genre)
                          ? 'var(--border-focus)'
                          : 'var(--border-secondary)',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        height: { xs: '32px', sm: '36px' },
                        padding: { xs: '0 8px', sm: '0 12px' },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          backgroundColor: selectedGenres.includes(genre)
                            ? 'var(--bg-hover-secondary)'
                            : 'var(--bg-hover-secondary)',
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 15px var(--shadow-glow)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Collapse>
    </Paper>
    </>
  );
};

export default FilterBar;

