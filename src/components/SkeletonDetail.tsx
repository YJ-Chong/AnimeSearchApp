import { Box, Card, Grid, Skeleton, Paper } from '@mui/material';

const SkeletonDetail = () => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4,
        animation: 'fadeInUp 0.6s ease-out',
        background: 'var(--gradient-paper)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="skeleton-card"
    >
      {/* Shimmer overlay */}
      <Box
        className="skeleton-shimmer"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      
      <Grid container spacing={4}>
        {/* Image skeleton */}
        <Grid item xs={12} md={4}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={500}
            animation="wave"
            sx={{
              bgcolor: 'var(--bg-active)',
              borderRadius: 3,
            }}
          />
        </Grid>
        
        {/* Content skeleton */}
        <Grid item xs={12} md={8}>
          {/* Title skeleton */}
          <Skeleton
            variant="text"
            width="80%"
            height={60}
            animation="wave"
            sx={{
              bgcolor: 'var(--bg-active)',
              mb: 2,
              borderRadius: 1,
            }}
          />
          
          {/* Subtitle skeleton */}
          <Skeleton
            variant="text"
            width="60%"
            height={40}
            animation="wave"
            sx={{
              bgcolor: 'var(--bg-hover-secondary)',
              mb: 3,
              borderRadius: 1,
            }}
          />
          
          {/* Info boxes skeleton */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={60}
                  animation="wave"
                  sx={{
                    bgcolor: 'var(--bg-active)',
                    borderRadius: 2,
                  }}
                />
              </Grid>
            ))}
          </Grid>
          
          {/* Genres skeleton */}
          <Box sx={{ mb: 3 }}>
            <Skeleton
              variant="text"
              width={100}
              height={30}
              animation="wave"
              sx={{
                bgcolor: 'var(--bg-active)',
                mb: 2,
                borderRadius: 1,
              }}
            />
            <Box display="flex" flexWrap="wrap" gap={1}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={80}
                  height={32}
                  animation="wave"
                  sx={{
                    bgcolor: 'var(--bg-hover-secondary)',
                    borderRadius: 1,
                  }}
                />
              ))}
            </Box>
          </Box>
          
          {/* Synopsis skeleton */}
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'var(--gradient-paper)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <Skeleton
              variant="text"
              width={120}
              height={30}
              animation="wave"
              sx={{
                bgcolor: 'var(--bg-active)',
                mb: 2,
                borderRadius: 1,
              }}
            />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                variant="text"
                width={i === 5 ? '80%' : '100%'}
                height={20}
                animation="wave"
                sx={{
                  bgcolor: 'var(--bg-hover-secondary)',
                  mb: 1,
                  borderRadius: 1,
                }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SkeletonDetail;

