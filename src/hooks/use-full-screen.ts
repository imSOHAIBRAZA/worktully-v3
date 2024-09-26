import { useState, useEffect, useCallback } from 'react';

// Custom hook for fullscreen functionality
const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to request fullscreen
  const requestFullscreen = useCallback(async () => {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen(); // For Safari
      } else if (el.msRequestFullscreen) {
        await el.msRequestFullscreen(); // For IE11
      }
      setIsFullscreen(true);
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }
  }, []);

  // Function to exit fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen(); // For Safari
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen(); // For IE11
      }
      setIsFullscreen(false);
    } catch (error) {
      console.error("Failed to exit fullscreen:", error);
    }
  }, []);

  // Toggle fullscreen state
  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      requestFullscreen();
    }
  }, [isFullscreen, requestFullscreen, exitFullscreen]);

  return { isFullscreen, requestFullscreen, exitFullscreen, toggleFullscreen };
};

export default useFullscreen;
