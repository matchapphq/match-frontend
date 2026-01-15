import { useEffect, useRef, RefObject } from 'react';

/**
 * Custom hook to detect clicks outside of a component
 * 
 * @param handler - Callback function to execute on outside click
 * @returns Ref to attach to the element
 * 
 * @example
 * const ref = useClickOutside(() => setIsOpen(false));
 * return <div ref={ref}>Content</div>;
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (!element || element.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
}
