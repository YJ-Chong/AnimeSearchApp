import { Box, Card, CardContent, Skeleton } from '@mui/material';

interface SkeletonCardProps {
  index?: number;
}

const SkeletonCard = ({}: SkeletonCardProps) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--gradient-paper)',
        border: '1px solid var(--border-secondary)',
        borderRadius: 2,
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
      
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: 300,
          background: 'var(--bg-active)',
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            bgcolor: 'var(--bg-active)',
            borderRadius: 0,
          }}
        />
        {/* Score badge skeleton */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'var(--bg-active)',
            borderRadius: '12px',
            px: 1.5,
            py: 0.5,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Skeleton
            variant="text"
            width={50}
            height={20}
            animation="wave"
            sx={{
              bgcolor: 'var(--bg-hover-secondary)',
            }}
          />
        </Box>
      </Box>
      
      <CardContent
        sx={{
          flexGrow: 1,
          background: 'var(--gradient-paper)',
          position: 'relative',
        }}
      >
        {/* Title skeleton */}
        <Skeleton
          variant="text"
          width="90%"
          height={28}
          animation="wave"
          sx={{
            bgcolor: 'var(--bg-active)',
            mb: 1.5,
            borderRadius: 1,
          }}
        />
        {/* Subtitle skeleton */}
        <Skeleton
          variant="text"
          width="70%"
          height={20}
          animation="wave"
          sx={{
            bgcolor: 'var(--bg-hover-secondary)',
            borderRadius: 1,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;

