import { Box, Card, ListItem, ListItemAvatar, ListItemText, Skeleton } from '@mui/material';

interface SkeletonListItemProps {
  index?: number;
}

const SkeletonListItem = ({}: SkeletonListItemProps) => {
  return (
    <ListItem
      disablePadding
      sx={{
        mb: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
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
            display: 'flex',
            p: 2,
            position: 'relative',
          }}
        >
          <ListItemAvatar
            sx={{
              minWidth: 120,
              height: 180,
              mr: 2,
            }}
          >
            <Skeleton
              variant="rectangular"
              width={120}
              height={180}
              animation="wave"
              sx={{
                bgcolor: 'var(--bg-active)',
                borderRadius: 2,
              }}
            />
          </ListItemAvatar>
          
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={32}
                  animation="wave"
                  sx={{
                    bgcolor: 'var(--bg-active)',
                    borderRadius: 1,
                  }}
                />
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={28}
                  animation="wave"
                  sx={{
                    bgcolor: 'var(--bg-hover-secondary)',
                    borderRadius: '12px',
                  }}
                />
              </Box>
            }
            secondary={
              <Box>
                <Skeleton
                  variant="text"
                  width="50%"
                  height={20}
                  animation="wave"
                  sx={{
                    bgcolor: 'var(--bg-hover-secondary)',
                    mb: 1,
                    borderRadius: 1,
                  }}
                />
                <Skeleton
                  variant="text"
                  width="100%"
                  height={16}
                  animation="wave"
                  sx={{
                    bgcolor: 'var(--bg-hover-secondary)',
                    mb: 0.5,
                    borderRadius: 1,
                  }}
                />
                <Skeleton
                  variant="text"
                  width="95%"
                  height={16}
                  animation="wave"
                  sx={{
                    bgcolor: 'var(--bg-hover-secondary)',
                    mb: 1,
                    borderRadius: 1,
                  }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      width={60}
                      height={24}
                      animation="wave"
                      sx={{
                        bgcolor: 'var(--bg-active)',
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            }
            sx={{
              py: 2,
              pr: 2,
            }}
          />
        </Box>
      </Card>
    </ListItem>
  );
};

export default SkeletonListItem;

