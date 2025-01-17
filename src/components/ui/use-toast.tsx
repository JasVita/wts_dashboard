'use client';

import { useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState<{ title: string; description: string; variant: string }[]>(
    []
  );

  const toast = ({ title, description, variant }: { title: string; description: string; variant: string }) => {
    setToasts([...toasts, { title, description, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  };

  return { toast, toasts };
};
