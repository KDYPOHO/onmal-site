/**
 * Ensures `window.fetch` can be safely read and assigned by browser extensions
 * or sandbox scripts even when `Window.prototype.fetch` or `window.fetch`
 * is defined with a getter-only property descriptor.
 */
export function installFetchGuard(target: Record<string, unknown> = typeof window !== 'undefined' ? (window as unknown as Record<string, unknown>) : {}): void {
  if (!target || typeof target !== 'object') return;

  try {
    const existingFetch = typeof target.fetch === 'function'
      ? (target.fetch as (...args: unknown[]) => unknown).bind(target)
      : undefined;
    let currentFetch = existingFetch;

    const ownDesc = Object.getOwnPropertyDescriptor(target, 'fetch');
    if (!ownDesc || ownDesc.configurable) {
      Object.defineProperty(target, 'fetch', {
        configurable: true,
        enumerable: true,
        get() {
          return currentFetch;
        },
        set(nextFetch: unknown) {
          if (typeof nextFetch === 'function') {
            currentFetch = nextFetch as (...args: unknown[]) => unknown;
          }
        },
      });
    }

    const proto = Object.getPrototypeOf(target);
    if (proto && typeof proto === 'object') {
      const protoDesc = Object.getOwnPropertyDescriptor(proto, 'fetch');
      if (protoDesc && protoDesc.get && !protoDesc.set && protoDesc.configurable) {
        Object.defineProperty(proto, 'fetch', {
          configurable: true,
          enumerable: protoDesc.enumerable ?? true,
          get() {
            return currentFetch ?? protoDesc.get?.call(this);
          },
          set(nextFetch: unknown) {
            if (typeof nextFetch === 'function') {
              currentFetch = nextFetch as (...args: unknown[]) => unknown;
            }
          },
        });
      }
    }
  } catch {
    // Ignore if environment locks property definitions
  }
}
