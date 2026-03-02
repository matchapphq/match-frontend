import { useCallback, useEffect, useRef, useState } from 'react';

export function useUnsavedChangesGuard(hasChanges: boolean) {
  const pendingActionRef = useRef<(() => void) | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!hasChanges) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanges]);

  const handleNavigationAttempt = useCallback((action: () => void) => {
    if (hasChanges) {
      pendingActionRef.current = action;
      setIsDialogOpen(true);
      return;
    }

    action();
  }, [hasChanges]);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);

    if (!open) {
      pendingActionRef.current = null;
    }
  }, []);

  const handleStay = useCallback(() => {
    pendingActionRef.current = null;
    setIsDialogOpen(false);
  }, []);

  const handleConfirmLeave = useCallback(() => {
    const pendingAction = pendingActionRef.current;

    pendingActionRef.current = null;
    setIsDialogOpen(false);
    pendingAction?.();
  }, []);

  return {
    isDialogOpen,
    handleNavigationAttempt,
    handleDialogOpenChange,
    handleStay,
    handleConfirmLeave,
  };
}
