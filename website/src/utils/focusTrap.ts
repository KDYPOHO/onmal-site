import { useEffect, useRef, type RefObject } from 'react';

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Computes the next focusable index when cycling with Tab / Shift+Tab.
 * Returns null if native browser tabbing should proceed without wrapping.
 */
export function getWrappedFocusIndex(
  currentIndex: number,
  totalCount: number,
  shiftKey: boolean
): number | null {
  if (totalCount <= 0) return null;
  if (shiftKey) {
    if (currentIndex <= 0) {
      return totalCount - 1;
    }
    return null;
  } else {
    if (currentIndex === -1 || currentIndex >= totalCount - 1) {
      return 0;
    }
    return null;
  }
}

export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return nodes.filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
  );
}

interface UseDialogFocusOptions {
  isOpen: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
}

export function useDialogFocus({
  isOpen,
  containerRef,
  initialFocusRef,
  onClose,
}: UseDialogFocusOptions): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const containerRefHolder = useRef(containerRef);
  containerRefHolder.current = containerRef;

  const initialFocusRefHolder = useRef(initialFocusRef);
  initialFocusRefHolder.current = initialFocusRef;

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusInitial = () => {
      const initialEl = initialFocusRefHolder.current?.current;
      if (initialEl) {
        initialEl.focus();
        return;
      }
      const focusables = getFocusableElements(containerRefHolder.current.current);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        containerRefHolder.current.current?.focus();
      }
    };

    focusInitial();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (e.key === 'Tab') {
        const container = containerRefHolder.current.current;
        const focusables = getFocusableElements(container);
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const activeEl = document.activeElement as HTMLElement | null;
        const currentIndex = activeEl ? focusables.indexOf(activeEl) : -1;
        const wrappedIndex = getWrappedFocusIndex(
          currentIndex,
          focusables.length,
          e.shiftKey
        );
        if (wrappedIndex !== null) {
          e.preventDefault();
          focusables[wrappedIndex].focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isOpen]);
}
