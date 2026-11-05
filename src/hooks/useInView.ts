import { useEffect, useRef, useState } from 'react';
import { observeInView } from './inViewObserver';

/**
 * Returns [ref, isInView]. Tracks whether element is currently in the viewport.
 * By default, it will only animate once when the element enters the screen to improve performance.
 */
export function useInView(threshold = 0.12, triggerOnce = true): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return observeInView(el, threshold, setInView, triggerOnce);
  }, [threshold, triggerOnce]);

  return [ref, inView];
}
