import { Box, Typography, Button, Paper } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import FilterListIcon from '@mui/icons-material/FilterList';

interface EmptyStateProps {
  type: 'no-results' | 'filtered' | 'initial';
  onClearFilters?: () => void;
  onTryDifferent?: () => void;
  hasFilters?: boolean;
}

const EmptyState = ({
  type,
  onClearFilters,
  onTryDifferent,
  hasFilters = false,
}: EmptyStateProps) => {
  const getContent = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: '🔍',
          title: 'No anime found matching your search',
          description: "We couldn't find any anime matching your search term. Try adjusting your keywords or explore different titles.",
          showClearButton: false,
          showTryDifferent: true,
        };
      case 'filtered':
        return {
          icon: '🎭',
          title: 'No results match your filters',
          description: 'The filters you applied are too restrictive. Try adjusting your genre selections or sorting options to see more results.',
          showClearButton: true,
          showTryDifferent: true,
        };
      case 'initial':
        return {
          icon: '✨',
          title: 'Start your anime journey',
          description: 'Search for your favorite anime titles, explore different genres, and discover new series to watch.',
          showClearButton: false,
          showTryDifferent: false,
        };
      default:
        return {
          icon: '🔍',
          title: 'No results found',
          description: 'Try adjusting your search or filters.',
          showClearButton: false,
          showTryDifferent: false,
        };
    }
  };

  const content = getContent();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 6,
        textAlign: 'center',
        animation: 'fadeInUp 0.6s ease-out',
        background: 'var(--gradient-paper)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-primary)',
        borderRadius: 4,
        maxWidth: 600,
        mx: 'auto',
        my: 4,
      }}
    >
      {/* Animated icon/illustration */}
      <Box
        sx={{
          fontSize: '6rem',
          mb: 3,
          animation: 'fadeInUp 0.8s ease-out',
          filter: 'drop-shadow(0 0 20px var(--shadow-glow))',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {content.icon}
      </Box>

      {/* Title */}
      <Typography
        variant="h4"
        component="h2"
        sx={{
          mb: 2,
          fontWeight: 700,
          background: 'var(--gradient-secondary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: { xs: '1.8rem', md: '2.2rem' },
        }}
      >
        {content.title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: 'var(--text-secondary)',
          fontFamily: '"Poppins", sans-serif',
          fontSize: '1.1rem',
          lineHeight: 1.8,
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        {content.description}
      </Typography>

      {/* Action buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {content.showClearButton && onClearFilters && (
          <Button
            variant="contained"
            startIcon={<ClearAllIcon />}
            onClick={onClearFilters}
            sx={{
              background: 'var(--gradient-primary)',
              color: 'var(--text-primary)',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 15px var(--shadow-glow)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px var(--shadow-glow-hover)',
                background: 'var(--gradient-primary-hover)',
              },
            }}
          >
            Clear All Filters
          </Button>
        )}

        {content.showTryDifferent && onTryDifferent && (
          <Button
            variant="outlined"
            startIcon={<SearchOffIcon />}
            onClick={onTryDifferent}
            sx={{
              borderColor: 'var(--border-hover)',
              color: 'var(--text-primary)',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderColor: 'var(--border-focus)',
                backgroundColor: 'var(--bg-hover)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Try Different Search
          </Button>
        )}

        {hasFilters && !content.showClearButton && onClearFilters && (
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={onClearFilters}
            sx={{
              borderColor: 'var(--border-hover)',
              color: 'var(--text-primary)',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderColor: 'var(--border-focus)',
                backgroundColor: 'var(--bg-hover)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {/* Decorative elements */}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          opacity: 0.6,
        }}
      >
        {['🎌', '🌸', '⚔️', '🎭', '🌟'].map((emoji, index) => (
          <Box
            key={index}
            sx={{
              fontSize: '1.5rem',
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
            }}
          >
            {emoji}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default EmptyState;

