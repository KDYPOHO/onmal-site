import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ViewerProps {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDialogElement>) => void;
  children: ReactNode;
}

/**
 * A native modal <dialog>. The browser traps focus, closes on Esc and returns
 * focus to the button that opened it, so no custom focus code is needed.
 */
export function Viewer({ open, title, closeLabel, onClose, onKeyDown, children }: ViewerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="viewer"
      aria-label={title}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        // A click on the backdrop lands on the <dialog> element itself.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {open && (
        <>
          <div className="viewer-bar">
            <h2>{title}</h2>
            <button type="button" className="icon-btn" onClick={onClose} aria-label={closeLabel}>
              <X aria-hidden="true" />
            </button>
          </div>
          {children}
        </>
      )}
    </dialog>
  );
}
