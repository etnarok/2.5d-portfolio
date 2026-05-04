// src/hooks/useControls.js
import { useEffect } from 'react';
import useStore from '../store/useStore';

export function useControls() {
  const setMovement = useStore((state) => state.setMovement);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowRight' || e.code === 'KeyD') setMovement(1);
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') setMovement(-1);
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.code === 'ArrowLeft' || e.code === 'KeyA') {
        setMovement(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setMovement]);
}