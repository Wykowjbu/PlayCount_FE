'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: string[]
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();

    useEffect(() => {
      const isAuthenticated = authService.isAuthenticated();

      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (allowedRoles) {
        const user = authService.getCurrentUser();
        if (!user || !allowedRoles.includes(user.role)) {
          router.push('/login');
        }
      }
    }, [router]);

    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) return null;

    if (allowedRoles) {
      const user = authService.getCurrentUser();
      if (!user || !allowedRoles.includes(user.role)) return null;
    }

    return <Component {...props} />;
  };
}
