import {
  Box,
  Pagination as MuiPagination,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Fade,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  currentPageItems: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  currentPageItems,
  onPageChange,
  loading = false,
}: PaginationProps) => {
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculate the range of items being displayed
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(startItem + currentPageItems - 1, totalItems);

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page or no results
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 4,
        mb: 2,
        animation: 'fadeInUp 0.6s ease-out',
        background: 'var(--gradient-paper)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Progress indicator */}
      <Fade in={loading}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            zIndex: 1,
          }}
        >
          <LinearProgress
            variant="indeterminate"
            sx={{
              height: 4,
              backgroundColor: 'var(--bg-active)',
              '& .MuiLinearProgress-bar': {
                background: 'var(--gradient-primary)',
              },
            }}
          />
        </Box>
      </Fade>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Results Info */}
        <Typography
          variant="body1"
          sx={{
            color: 'var(--text-secondary)',
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 500,
          }}
        >
          Showing <strong style={{ color: 'var(--accent-primary)' }}>{startItem}</strong> to{' '}
          <strong style={{ color: 'var(--accent-primary)' }}>{endItem}</strong> of{' '}
          <strong style={{ color: 'var(--accent-primary)' }}>{totalItems}</strong> results
        </Typography>

        {/* Pagination Controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {/* Previous Button */}
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
            startIcon={<ChevronLeftIcon />}
            variant="outlined"
            sx={{
              borderColor: 'var(--border-hover)',
              color: 'var(--text-primary)',
              '&:hover': {
                borderColor: 'var(--border-focus)',
                backgroundColor: 'var(--bg-hover)',
              },
              '&:disabled': {
                borderColor: 'var(--border-primary)',
                color: 'var(--text-disabled)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Previous
          </Button>

          {/* Page Numbers */}
          <MuiPagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            disabled={loading}
            color="primary"
            size="large"
            siblingCount={1}
            boundaryCount={1}
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'var(--text-primary)',
                borderColor: 'var(--border-secondary)',
                '&:hover': {
                  backgroundColor: 'var(--bg-hover-secondary)',
                  borderColor: 'var(--border-hover)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'var(--bg-active)',
                  borderColor: 'var(--border-focus)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  '&:hover': {
                    backgroundColor: 'var(--bg-hover-secondary)',
                  },
                },
                '&.Mui-disabled': {
                  color: 'var(--text-disabled)',
                  borderColor: 'var(--border-primary)',
                },
              },
              '& .MuiPaginationItem-ellipsis': {
                color: 'var(--text-secondary)',
              },
            }}
          />

          {/* Next Button */}
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            endIcon={<ChevronRightIcon />}
            variant="outlined"
            sx={{
              borderColor: 'var(--border-hover)',
              color: 'var(--text-primary)',
              '&:hover': {
                borderColor: 'var(--border-focus)',
                backgroundColor: 'var(--bg-hover)',
              },
              '&:disabled': {
                borderColor: 'var(--border-primary)',
                color: 'var(--text-disabled)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Next
          </Button>
        </Box>

        {/* Page Info */}
        <Typography
          variant="body2"
          sx={{
            color: 'var(--text-tertiary)',
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 500,
          }}
        >
          Page <strong style={{ color: 'var(--accent-primary)' }}>{currentPage}</strong> of{' '}
          <strong style={{ color: 'var(--accent-primary)' }}>{totalPages}</strong>
        </Typography>
      </Box>
    </Paper>
  );
};

export default Pagination;

