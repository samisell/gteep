'use client';

import { useEffect, useCallback, type ReactNode } from 'react';
import { toast } from 'sonner';

interface ContentProtectionProps {
  children: ReactNode;
  enabled?: boolean;
}

export default function ContentProtection({
  children,
  enabled = true,
}: ContentProtectionProps) {
  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (!enabled) return;
      e.preventDefault();
      toast.warning('Content is protected', {
        description: 'Right-click is disabled to protect content.',
        duration: 2000,
      });
    },
    [enabled]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Disable Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        toast.warning('Content is protected', {
          description: 'Saving this page is not allowed.',
          duration: 2000,
        });
        return;
      }

      // Disable Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        toast.warning('Content is protected', {
          description: 'Viewing source is not allowed.',
          duration: 2000,
        });
        return;
      }

      // Disable Ctrl+Shift+I / Cmd+Option+I (Developer Tools)
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.metaKey && e.altKey && e.key === 'I')
      ) {
        e.preventDefault();
        toast.warning('Content is protected', {
          description: 'Developer tools access is restricted.',
          duration: 2000,
        });
        return;
      }

      // Disable F12
      if (e.key === 'F12') {
        e.preventDefault();
        toast.warning('Content is protected', {
          description: 'Developer tools access is restricted.',
          duration: 2000,
        });
        return;
      }

      // Disable Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.metaKey && e.altKey && e.key === 'C')
      ) {
        e.preventDefault();
        toast.warning('Content is protected', {
          description: 'Inspect element is not allowed.',
          duration: 2000,
        });
        return;
      }

      // Disable Ctrl+Shift+J / Cmd+Option+J (Console)
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.metaKey && e.altKey && e.key === 'J')
      ) {
        e.preventDefault();
        toast.warning('Content is protected', {
          description: 'Console access is restricted.',
          duration: 2000,
        });
        return;
      }
    },
    [enabled]
  );

  const handleDragStart = useCallback(
    (e: DragEvent) => {
      if (!enabled) return;
      // Only prevent image dragging
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
      }
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, [enabled, handleContextMenu, handleKeyDown, handleDragStart]);

  return <>{children}</>;
}
