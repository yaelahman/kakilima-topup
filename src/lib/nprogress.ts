import NProgress from 'nprogress';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Configure NProgress
NProgress.configure({
  showSpinner: true,
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
});

// Custom styles for NProgress
const nprogressStyles = `
  #nprogress {
    pointer-events: none;
  }
  
  #nprogress .bar {
    background: var(--primary);
    position: fixed;
    z-index: 1031;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
  }
  
  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 10px var(--primary), 0 0 5px var(--primary);
    opacity: 1.0;
    transform: rotate(3deg) translate(0px, -4px);
  }
  
  #nprogress .spinner {
    display: block;
    position: fixed;
    z-index: 1031;
    top: 15px;
    right: 15px;
  }

  #nprogress .spinner-icon {
    width: 18px;
    height: 18px;
    box-sizing: border-box;
    border: solid 2px transparent;
    border-top-color: var(--primary);
    border-left-color: var(--primary);
    border-radius: 50%;
    animation: nprogress-spinner 400ms linear infinite;
  }

  @keyframes nprogress-spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Hook to handle route changes
export function useNProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.done();
    };
  }, [pathname, searchParams]);
}

// Function to inject styles
export function injectNProgressStyles() {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = nprogressStyles;
    document.head.appendChild(style);
  }
}

// Export NProgress instance for direct use
export { NProgress };