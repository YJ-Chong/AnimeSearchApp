import { useState, useMemo, useEffect } from 'react';
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
} from '@mui/material';
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import type { Anime } from '../types/anime';

export type SortOption = 'rating-high' | 'rating-low' | 'name-az' | 'name-za' | 'newest' | 'oldest';
export type ViewMode = 'grid' | 'list';

interface FilterBarProps {
  animeList: Anime[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
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
  onSortChange,
  onGenreFilterChange,
  onViewModeChange,
  sortValue,
  selectedGenres,
  viewMode,
}: FilterBarProps) => {
  const [showFilters, setShowFilters] = useState(true);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);

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

  const handleGenreToggle = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    onGenreFilterChange(newGenres);
  };

  const handleClearFilters = () => {
    onGenreFilterChange([]);
    onSortChange('rating-high');
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
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
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon sx={{ color: 'var(--accent-primary)' }} />
          <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
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

          {/* Sort and View Mode Controls */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <FormControl
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
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

            <ButtonGroup
              variant="outlined"
              sx={{
                '& .MuiButton-root': {
                  borderColor: 'var(--border-hover)',
                  color: 'var(--text-primary)',
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
                startIcon={<GridViewIcon />}
                sx={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                startIcon={<ListViewIcon />}
                sx={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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

            {(selectedGenres.length > 0 || sortValue !== 'rating-high') && (
              <Button
                onClick={handleClearFilters}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: 'var(--border-hover)',
                  color: 'var(--accent-error)',
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
                  sx={{ color: 'var(--text-secondary)', mb: 1.5, fontWeight: 600 }}
                >
                  Genres
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
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
  );
};

export default FilterBar;

