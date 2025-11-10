import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAnimeDetail } from '../store/slices/animeSlice';
import SkeletonDetail from '../components/SkeletonDetail';
import { getAnimeImageUrl, getPlaceholderImage } from '../utils/imageUtils';
import { getRandomAnime } from '../services/api';
import {
  Container,
  Box,
  Typography,
  Paper,
  Alert,
  Button,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import ShuffleIcon from '@mui/icons-material/Shuffle';

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedAnime, loading, error } = useAppSelector((state) => state.anime);
  const [randomAnimeLoading, setRandomAnimeLoading] = useState(false);
  const [randomAnimeError, setRandomAnimeError] = useState<string | null>(null);
  const [lastRandomClick, setLastRandomClick] = useState<number>(0);
  const lastFetchedIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (id) {
      const animeId = parseInt(id, 10);
      if (!isNaN(animeId)) {
        // Only fetch if this is a different ID than what we last fetched
        // This prevents unnecessary refetches when the component re-renders
        if (lastFetchedIdRef.current !== animeId) {
          lastFetchedIdRef.current = animeId;
          dispatch(fetchAnimeDetail(animeId));
        }
      }
    }
    // Note: We don't clear selectedAnime on unmount to allow proper back navigation
    // Each page will fetch its own data when needed
  }, [id, dispatch]);

  const handleBack = () => {
    navigate('/');
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

  if (loading && !selectedAnime) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: { xs: 2, sm: 3 },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Button
            startIcon={<ArrowBackIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />}
            onClick={handleBack}
            variant="outlined"
            disabled
            fullWidth
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              animation: 'fadeInUp 0.5s ease-out',
              opacity: 0.5,
              minHeight: { xs: '44px', sm: '40px' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              padding: { xs: '10px 16px', sm: '8px 20px' },
            }}
          >
            Back to Search
          </Button>
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
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'fadeInUp 0.5s ease-out',
              minHeight: { xs: '44px', sm: '40px' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              padding: { xs: '10px 16px', sm: '8px 20px' },
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
        <SkeletonDetail />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: { xs: 2, sm: 2.5, md: 3 },
            animation: 'fadeInUp 0.5s ease-out',
            background: 'var(--bg-hover-secondary)',
            border: '1px solid var(--border-hover)',
            borderRadius: 3,
            color: 'var(--text-primary)',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '& .MuiAlert-icon': {
              color: 'var(--accent-error)',
            },
          }}
        >
          {error}
        </Alert>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Button 
            startIcon={<ArrowBackIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />} 
            onClick={handleBack} 
            variant="contained"
            fullWidth
            sx={{
              width: { xs: '100%', sm: 'auto' },
              animation: 'fadeInUp 0.6s ease-out',
              minHeight: { xs: '44px', sm: '40px' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              padding: { xs: '10px 16px', sm: '8px 20px' },
            }}
          >
            Back to Search
          </Button>
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
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'fadeInUp 0.6s ease-out',
              minHeight: { xs: '44px', sm: '40px' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              padding: { xs: '10px 16px', sm: '8px 20px' },
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
      </Container>
    );
  }

  // Only show "not found" if we have an ID, we're not loading, and there's no error
  // This means the fetch completed but returned nothing
  if (!selectedAnime && !loading && id && !error) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
        <Alert 
          severity="info" 
          sx={{ 
            mb: { xs: 2, sm: 2.5, md: 3 },
            animation: 'fadeInUp 0.5s ease-out',
            background: 'var(--bg-hover-secondary)',
            border: '1px solid var(--border-hover)',
            borderRadius: 3,
            color: 'var(--text-primary)',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '& .MuiAlert-icon': {
              color: 'var(--accent-info)',
            },
          }}
        >
          Anime not found
        </Alert>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Button 
            startIcon={<ArrowBackIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />} 
            onClick={handleBack} 
            variant="contained"
            fullWidth
            sx={{
              width: { xs: '100%', sm: 'auto' },
              animation: 'fadeInUp 0.6s ease-out',
              minHeight: { xs: '44px', sm: '40px' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              padding: { xs: '10px 16px', sm: '8px 20px' },
            }}
          >
            Back to Search
          </Button>
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
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'fadeInUp 0.6s ease-out',
              minHeight: { xs: '44px', sm: '40px' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              padding: { xs: '10px 16px', sm: '8px 20px' },
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
      </Container>
    );
  }

  // Guard: ensure we have selectedAnime before rendering main content
  // This should never happen due to early returns above, but TypeScript needs this
  if (!selectedAnime) {
    return null;
  }

  const imageUrl = getAnimeImageUrl(selectedAnime, true);

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
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: { xs: 2, sm: 3 },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />}
          onClick={handleBack}
          variant="outlined"
          fullWidth
          sx={{
            width: { xs: '100%', sm: 'auto' }, 
            animation: 'fadeInUp 0.5s ease-out',
            minHeight: { xs: '44px', sm: '40px' },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            padding: { xs: '10px 16px', sm: '8px 20px' },
          }}
        >
          Back to Search
        </Button>
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
            animation: 'fadeInUp 0.5s ease-out',
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

      <Paper 
        elevation={3} 
        className="content-fade-in"
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          background: 'var(--gradient-paper)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={imageUrl}
              alt={selectedAnime.title}
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
                width: '100%',
                height: 'auto',
                borderRadius: 3,
                boxShadow: `0 20px 60px var(--shadow-glow), 0 0 40px var(--shadow-accent)`,
                border: '2px solid var(--border-secondary)',
                transition: 'all 0.3s ease',
                backgroundColor: 'var(--bg-active)',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 25px 70px var(--shadow-glow-hover), 0 0 50px var(--shadow-accent)`,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.5rem' },
                fontWeight: 900,
                background: 'var(--gradient-secondary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: { xs: 1.5, sm: 2 },
                lineHeight: { xs: 1.3, sm: 1.4 },
              }}
            >
              {selectedAnime.title}
            </Typography>
            {selectedAnime.title_english && (
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                  mb: { xs: 0.75, sm: 1 },
                }}
                gutterBottom
              >
                {selectedAnime.title_english}
              </Typography>
            )}
            {selectedAnime.title_japanese && (
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'var(--text-tertiary)',
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                }}
                gutterBottom
              >
                {selectedAnime.title_japanese}
              </Typography>
            )}

            <Divider 
              sx={{ 
                my: { xs: 2, sm: 2.5, md: 3 },
                borderColor: 'var(--border-secondary)',
                borderWidth: 1,
              }} 
            />

            <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, sm: 3 } }}>
              {selectedAnime.score && (
                <Grid item xs={12} sm={6}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={1}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      background: 'var(--bg-active)',
                      border: '1px solid var(--border-secondary)',
                      transition: 'all 0.3s ease',
                      minHeight: { xs: '48px', sm: 'auto' },
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateX(5px)' },
                        borderColor: 'var(--border-hover)',
                        boxShadow: '0 4px 15px var(--shadow-glow)',
                      },
                    }}
                  >
                    <StarIcon sx={{ color: 'var(--accent-primary)', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      <strong>Score:</strong> {selectedAnime.score} / 10
                    </Typography>
                  </Box>
                </Grid>
              )}
              {selectedAnime.episodes && (
                <Grid item xs={12} sm={6}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'var(--bg-active)',
                      border: '1px solid var(--border-secondary)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(5px)',
                        borderColor: 'var(--border-hover)',
                        boxShadow: '0 4px 15px var(--shadow-glow)',
                      },
                    }}
                  >
                    <PlayCircleOutlineIcon sx={{ color: 'var(--accent-tertiary)', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      <strong>Episodes:</strong> {selectedAnime.episodes}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {selectedAnime.rating && (
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      background: 'var(--bg-active)',
                      border: '1px solid var(--border-secondary)',
                      transition: 'all 0.3s ease',
                      minHeight: { xs: '48px', sm: 'auto' },
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateX(5px)' },
                        borderColor: 'var(--border-hover)',
                        boxShadow: '0 4px 15px var(--shadow-glow)',
                      },
                    }}
                  >
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      <strong>Rating:</strong> {selectedAnime.rating}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {selectedAnime.status && (
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      background: 'var(--bg-active)',
                      border: '1px solid var(--border-secondary)',
                      transition: 'all 0.3s ease',
                      minHeight: { xs: '48px', sm: 'auto' },
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateX(5px)' },
                        borderColor: 'var(--border-hover)',
                        boxShadow: '0 4px 15px var(--shadow-glow)',
                      },
                    }}
                  >
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      <strong>Status:</strong> {selectedAnime.status}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {selectedAnime.type && (
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      background: 'var(--bg-active)',
                      border: '1px solid var(--border-secondary)',
                      transition: 'all 0.3s ease',
                      minHeight: { xs: '48px', sm: 'auto' },
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateX(5px)' },
                        borderColor: 'var(--border-hover)',
                        boxShadow: '0 4px 15px var(--shadow-glow)',
                      },
                    }}
                  >
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      <strong>Type:</strong> {selectedAnime.type}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {selectedAnime.duration && (
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      background: 'var(--bg-active)',
                      border: '1px solid var(--border-secondary)',
                      transition: 'all 0.3s ease',
                      minHeight: { xs: '48px', sm: 'auto' },
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateX(5px)' },
                        borderColor: 'var(--border-hover)',
                        boxShadow: '0 4px 15px var(--shadow-glow)',
                      },
                    }}
                  >
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      <strong>Duration:</strong> {selectedAnime.duration}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>

            {selectedAnime.aired && selectedAnime.aired.string && (
              <Box 
                display="flex" 
                alignItems="center" 
                gap={1} 
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 2,
                  background: 'var(--bg-active)',
                  border: '1px solid var(--border-secondary)',
                  transition: 'all 0.3s ease',
                  minHeight: { xs: '48px', sm: 'auto' },
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateX(5px)' },
                    borderColor: 'var(--border-hover)',
                    boxShadow: '0 4px 15px var(--shadow-glow)',
                  },
                }}
              >
                <CalendarTodayIcon sx={{ color: 'var(--accent-tertiary)', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  <strong>Air Dates:</strong> {selectedAnime.aired.string}
                </Typography>
              </Box>
            )}

            {selectedAnime.genres && selectedAnime.genres.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' },
                  }}
                >
                  Genres:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {selectedAnime.genres.map((genre) => (
                    <Chip 
                      key={genre.mal_id} 
                      label={genre.name} 
                      sx={{
                        background: 'var(--bg-active)',
                        border: '1px solid var(--border-secondary)',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9rem' },
                        height: { xs: '28px', sm: '32px', md: '36px' },
                        padding: { xs: '0 8px', sm: '0 10px', md: '0 12px' },
                        '&:hover': {
                          transform: { xs: 'scale(1.05)', sm: 'scale(1.1)' },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {selectedAnime.studios && selectedAnime.studios.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' },
                  }}
                >
                  Studios:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {selectedAnime.studios.map((studio) => (
                    <Chip 
                      key={studio.mal_id} 
                      label={studio.name}
                      sx={{
                        background: 'var(--bg-active)',
                        border: '1px solid var(--border-secondary)',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9rem' },
                        height: { xs: '28px', sm: '32px', md: '36px' },
                        padding: { xs: '0 8px', sm: '0 10px', md: '0 12px' },
                        '&:hover': {
                          transform: { xs: 'scale(1.05)', sm: 'scale(1.1)' },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {selectedAnime.synopsis && (
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 3,
                  background: 'var(--gradient-paper)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' },
                  }}
                >
                  Synopsis:
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{
                    color: 'var(--text-secondary)',
                    lineHeight: { xs: 1.6, sm: 1.8 },
                    fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                  }}
                >
                  {selectedAnime.synopsis}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
    </>
  );
};

export default DetailPage;

