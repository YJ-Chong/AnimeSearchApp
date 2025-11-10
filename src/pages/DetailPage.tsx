import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAnimeDetail, clearSelectedAnime } from '../store/slices/animeSlice';
import SkeletonDetail from '../components/SkeletonDetail';
import { getAnimeImageUrl, getPlaceholderImage } from '../utils/imageUtils';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StarIcon from '@mui/icons-material/Star';

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedAnime, loading, error } = useAppSelector((state) => state.anime);

  useEffect(() => {
    if (id) {
      const animeId = parseInt(id, 10);
      if (!isNaN(animeId)) {
        dispatch(fetchAnimeDetail(animeId));
      }
    }

    return () => {
      dispatch(clearSelectedAnime());
    };
  }, [id, dispatch]);

  const handleBack = () => {
    navigate('/');
  };

  if (loading && !selectedAnime) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          variant="outlined"
          disabled
          sx={{ 
            mb: 3,
            animation: 'fadeInUp 0.5s ease-out',
            opacity: 0.5,
          }}
        >
          Back to Search
        </Button>
        <SkeletonDetail />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
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
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack} 
          variant="contained"
          sx={{
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          Back to Search
        </Button>
      </Container>
    );
  }

  if (!selectedAnime) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            animation: 'fadeInUp 0.5s ease-out',
            background: 'var(--bg-hover-secondary)',
            border: '1px solid var(--border-hover)',
            borderRadius: 3,
            color: 'var(--text-primary)',
            '& .MuiAlert-icon': {
              color: 'var(--accent-info)',
            },
          }}
        >
          Anime not found
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack} 
          variant="contained"
          sx={{
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          Back to Search
        </Button>
      </Container>
    );
  }

  const imageUrl = getAnimeImageUrl(selectedAnime, true);

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        variant="outlined"
        sx={{ 
          mb: 3,
          animation: 'fadeInUp 0.5s ease-out',
        }}
      >
        Back to Search
      </Button>

      <Paper 
        elevation={3} 
        className="content-fade-in"
        sx={{ 
          p: 4,
          background: 'var(--gradient-paper)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={imageUrl}
              alt={selectedAnime.title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== getPlaceholderImage()) {
                  target.src = getPlaceholderImage();
                }
              }}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 3,
                boxShadow: `0 20px 60px var(--shadow-glow), 0 0 40px var(--shadow-accent)`,
                border: '2px solid var(--border-secondary)',
                transition: 'all 0.3s ease',
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
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                fontWeight: 900,
                background: 'var(--gradient-secondary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 2,
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
                  mb: 1,
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
                }}
                gutterBottom
              >
                {selectedAnime.title_japanese}
              </Typography>
            )}

            <Divider 
              sx={{ 
                my: 3,
                borderColor: 'var(--border-secondary)',
                borderWidth: 1,
              }} 
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {selectedAnime.score && (
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
                    <StarIcon sx={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }} />
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
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
                    <PlayCircleOutlineIcon sx={{ color: 'var(--accent-tertiary)', fontSize: '1.5rem' }} />
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <strong>Episodes:</strong> {selectedAnime.episodes}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {selectedAnime.rating && (
                <Grid item xs={12} sm={6}>
                  <Box
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
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <strong>Rating:</strong> {selectedAnime.rating}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {selectedAnime.status && (
                <Grid item xs={12} sm={6}>
                  <Box
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
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <strong>Status:</strong> {selectedAnime.status}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {selectedAnime.type && (
                <Grid item xs={12} sm={6}>
                  <Box
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
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <strong>Type:</strong> {selectedAnime.type}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {selectedAnime.duration && (
                <Grid item xs={12} sm={6}>
                  <Box
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
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
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
                  mb: 3,
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
                <CalendarTodayIcon sx={{ color: 'var(--accent-tertiary)', fontSize: '1.5rem' }} />
                <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
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
                    mb: 2,
                    fontSize: '1.3rem',
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
                        fontSize: '0.9rem',
                        '&:hover': {
                          transform: 'scale(1.1)',
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
                    mb: 2,
                    fontSize: '1.3rem',
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
                        fontSize: '0.9rem',
                        '&:hover': {
                          transform: 'scale(1.1)',
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
                  p: 3,
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
                    mb: 2,
                    fontSize: '1.3rem',
                  }}
                >
                  Synopsis:
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                    fontSize: '1rem',
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
  );
};

export default DetailPage;

