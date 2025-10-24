import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs/textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Exception: Allow Escape to work even in inputs (to close modals)
        if (e.key !== 'Escape') {
          return;
        }
      }

      // Check each shortcut
      for (const shortcut of shortcuts) {
        const ctrlOrCmd = e.ctrlKey || e.metaKey; // Support both Ctrl (Windows) and Cmd (Mac)
        
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlKey || shortcut.metaKey 
          ? ctrlOrCmd 
          : !ctrlOrCmd;
        const shiftMatches = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;

        if (keyMatches && ctrlMatches && shiftMatches) {
          e.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Helper to get OS-specific modifier key name
export function getModifierKey(): string {
  return navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl';
}