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
        p: { xs: 3, sm: 4, md: 6 },
        textAlign: 'center',
        animation: 'fadeInUp 0.6s ease-out',
        background: 'var(--gradient-paper)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-primary)',
        borderRadius: 4,
        maxWidth: 600,
        mx: 'auto',
        my: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Animated icon/illustration */}
      <Box
        sx={{
          fontSize: { xs: '4rem', sm: '5rem', md: '6rem' },
          mb: { xs: 2, sm: 2.5, md: 3 },
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
          mb: { xs: 1.5, sm: 2 },
          fontWeight: 700,
          background: 'var(--gradient-secondary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem' },
        }}
      >
        {content.title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          mb: { xs: 3, sm: 3.5, md: 4 },
          color: 'var(--text-secondary)',
          fontFamily: '"Poppins", sans-serif',
          fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
          lineHeight: { xs: 1.6, sm: 1.7, md: 1.8 },
          maxWidth: 500,
          mx: 'auto',
          px: { xs: 1, sm: 0 },
        }}
      >
        {content.description}
      </Typography>

      {/* Action buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 2 },
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {content.showClearButton && onClearFilters && (
          <Button
            variant="contained"
            startIcon={<ClearAllIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />}
            onClick={onClearFilters}
            fullWidth={xs => xs ? true : false}
            sx={{
              background: 'var(--gradient-primary)',
              color: 'var(--text-primary)',
              px: { xs: 3, sm: 4 },
              py: { xs: 1.25, sm: 1.5 },
              borderRadius: 3,
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              minHeight: { xs: '44px', sm: '40px' },
              width: { xs: '100%', sm: 'auto' },
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
            startIcon={<SearchOffIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />}
            onClick={onTryDifferent}
            fullWidth={xs => xs ? true : false}
            sx={{
              borderColor: 'var(--border-hover)',
              color: 'var(--text-primary)',
              px: { xs: 3, sm: 4 },
              py: { xs: 1.25, sm: 1.5 },
              borderRadius: 3,
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              minHeight: { xs: '44px', sm: '40px' },
              width: { xs: '100%', sm: 'auto' },
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
            startIcon={<FilterListIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />}
            onClick={onClearFilters}
            fullWidth={xs => xs ? true : false}
            sx={{
              borderColor: 'var(--border-hover)',
              color: 'var(--text-primary)',
              px: { xs: 3, sm: 4 },
              py: { xs: 1.25, sm: 1.5 },
              borderRadius: 3,
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              minHeight: { xs: '44px', sm: '40px' },
              width: { xs: '100%', sm: 'auto' },
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
          mt: { xs: 3, sm: 3.5, md: 4 },
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 1, sm: 1.5, md: 2 },
          opacity: 0.6,
        }}
      >
        {['🎌', '🌸', '⚔️', '🎭', '🌟'].map((emoji, index) => (
          <Box
            key={index}
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.5rem' },
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

