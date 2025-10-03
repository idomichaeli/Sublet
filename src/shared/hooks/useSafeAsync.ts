import { useEffect, useRef } from 'react';

/**
 * Hook to safely manage async operations and prevent state updates after component unmount
 * This prevents crashes from trying to update state on unmounted components
 */
export function useSafeAsync() {
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeAsyncOperation = async <T>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: any) => void
  ): Promise<T | null> => {
    try {
      const result = await operation();
      
      // Only call success callback if component is still mounted
      if (isMountedRef.current && onSuccess) {
        onSuccess(result);
      }
      
      return isMountedRef.current ? result : null;
    } catch (error) {
      // Only call error callback if component is still mounted
      if (isMountedRef.current && onError) {
        onError(error);
      }
      return null;
    }
  };

  const executeIfMounted = (callback: () => void) => {
    if (isMountedRef.current) {
      callback();
    }
  };

  return {
    safeAsyncOperation,
    executeIfMounted,
    isMounted: isMountedRef.current,
  };
}
