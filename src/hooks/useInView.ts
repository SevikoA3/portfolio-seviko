import { useEffect, useRef, useState } from 'react';

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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            observer.unobserve(el);
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce]);

  return [ref, inView];
}
