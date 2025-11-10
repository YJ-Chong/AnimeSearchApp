import { useEffect, useRef, useState } from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { Box } from '@mui/material';

interface MarqueeTextProps extends Omit<TypographyProps, 'children'> {
  text: string;
  triggerOnHover?: boolean;
  speed?: number; // pixels per second
}

const MarqueeText = ({ 
  text, 
  triggerOnHover = true, 
  speed = 60,
  sx,
  ...typographyProps 
}: MarqueeTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && measureRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const measuredWidth = measureRef.current.offsetWidth;
        const needsScrolling = measuredWidth > containerWidth;
        setNeedsScroll(needsScrolling);
        setTextWidth(measuredWidth);
      }
    };

    // Use multiple checks to ensure DOM is ready
    const timeoutId1 = setTimeout(checkOverflow, 50);
    const timeoutId2 = setTimeout(checkOverflow, 200);
    const timeoutId3 = setTimeout(checkOverflow, 500);
    
    window.addEventListener('resize', checkOverflow);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text]);

  // Auto-scroll if not hover-triggered, or scroll on hover if triggerOnHover is true
  const shouldAnimate = needsScroll && (!triggerOnHover || isHovered);
  // For seamless loop, scroll by text width + gap
  const gap = 30;
  const totalScrollDistance = textWidth + gap;
  const animationDuration = totalScrollDistance > 0 ? totalScrollDistance / speed : 0;

  // Debug: log when animation should trigger
  useEffect(() => {
    if (needsScroll) {
      console.log('MarqueeText Debug:', {
        needsScroll,
        isHovered,
        triggerOnHover,
        shouldAnimate,
        textWidth,
        containerWidth: containerRef.current?.offsetWidth,
        totalScrollDistance,
        animationDuration,
      });
    }
  }, [needsScroll, isHovered, triggerOnHover, shouldAnimate, textWidth, totalScrollDistance, animationDuration]);

  // Generate unique animation name based on text width to avoid conflicts
  // Use useRef to keep animation name stable
  const animationNameRef = useRef<string>(`marquee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const animationName = animationNameRef.current;

  // Inject keyframes dynamically when animation should run
  useEffect(() => {
    if (shouldAnimate && textWidth > 0 && totalScrollDistance > 0) {
      const styleId = `marquee-style-${animationName}`;
      
      // Remove any existing style with same ID
      const existing = document.getElementById(styleId);
      if (existing) {
        existing.remove();
      }

      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        @keyframes ${animationName} {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${totalScrollDistance}px);
          }
        }
      `;
      document.head.appendChild(styleElement);

      return () => {
        const element = document.getElementById(styleId);
        if (element) {
          element.remove();
        }
      };
    }
  }, [shouldAnimate, textWidth, animationName, totalScrollDistance]);

  return (
    <Box
      ref={containerRef}
      onMouseEnter={() => triggerOnHover && setIsHovered(true)}
      onMouseLeave={() => triggerOnHover && setIsHovered(false)}
      sx={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        ...sx,
      }}
    >
      {/* Hidden span to measure text width */}
      <Box
        component="span"
        ref={measureRef}
        sx={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: typographyProps.sx?.fontSize || '1.1rem',
          fontWeight: typographyProps.sx?.fontWeight || 700,
          fontFamily: typographyProps.sx?.fontFamily || 'inherit',
        }}
      >
        {text}
      </Box>
      
      <Box
        ref={textRef}
        sx={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          willChange: shouldAnimate ? 'transform' : 'auto',
          ...(shouldAnimate && textWidth > 0 && totalScrollDistance > 0 && {
            animation: `${animationName} ${animationDuration}s linear infinite`,
          }),
        }}
      >
        <Typography
          {...typographyProps}
          sx={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            ...typographyProps.sx,
          }}
        >
          {text}
        </Typography>
        {needsScroll && (
          <Typography
            {...typographyProps}
            sx={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              marginLeft: `${gap}px`,
              ...typographyProps.sx,
            }}
          >
            {text}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MarqueeText;

