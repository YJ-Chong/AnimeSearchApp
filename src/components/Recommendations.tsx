import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRecommendations } from '../store/slices/animeSlice';
import MarqueeText from './MarqueeText';
import SkeletonCard from './SkeletonCard';
import { getAnimeImageUrl, getPlaceholderImage } from '../utils/imageUtils';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Paper,
} from '@mui/material';

const Recommendations = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { recommendations, recommendationsLoading } = useAppSelector((state) => state.anime);

  useEffect(() => {
    // Fetch recommendations on mount if not already loaded
    if (recommendations.length === 0 && !recommendationsLoading) {
      dispatch(fetchRecommendations({ limit: 12 }));
    }
  }, [dispatch, recommendations.length, recommendationsLoading]);

  const handleCardClick = (id: number) => {
    navigate(`/anime/${id}`);
  };

  if (recommendationsLoading && recommendations.length === 0) {
    return (
      <Box sx={{ mt: 6 }}>
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
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              mb: 3,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              textShadow: '0 0 30px var(--shadow-glow)',
              letterSpacing: '1px',
              color: 'var(--text-primary)',
            }}
          >
            Recommendations
          </Typography>
          <Grid container spacing={3}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={`recommendation-skeleton-${index}`}
                sx={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.03}s both`,
                }}
              >
                <SkeletonCard index={index} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 6 }}>
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
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            mb: 3,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            textShadow: '0 0 30px var(--shadow-glow)',
            letterSpacing: '1px',
            color: 'var(--text-primary)',
          }}
        >
          Recommendations
        </Typography>
        <Grid container spacing={3}>
          {recommendations.map((anime, index) => (
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
                        if (target.src !== placeholder && !target.src.includes('data:image/svg+xml')) {
                          target.src = placeholder;
                          target.onerror = null;
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
      </Paper>
    </Box>
  );
};

export default Recommendations;

