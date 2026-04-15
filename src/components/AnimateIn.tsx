import { type ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

interface AnimateInProps {
  children: ReactNode;
  /** Extra Tailwind classes on the wrapper */
  className?: string;
  /** Delay in ms before animation plays (for stagger) */
  delay?: number;
  /** Animation variant */
  variant?: 'fade-up' | 'fade-left' | 'fade-right' | 'fade';
}

export default function AnimateIn({
  children,
  className = '',
  delay = 0,
  variant = 'fade-up',
}: AnimateInProps) {
  const [ref, inView] = useInView();

  const variants = {
    'fade-up':    { hidden: 'opacity-0 translate-y-8',  visible: 'opacity-100 translate-y-0' },
    'fade-left':  { hidden: 'opacity-0 -translate-x-8', visible: 'opacity-100 translate-x-0' },
    'fade-right': { hidden: 'opacity-0 translate-x-8',  visible: 'opacity-100 translate-x-0' },
    'fade':       { hidden: 'opacity-0',                visible: 'opacity-100' },
  };

  const { hidden, visible } = variants[variant];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? visible : hidden} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
