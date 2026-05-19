import type { ReactNode } from 'react';
import { BottomNav } from '@/components/BottomNav';

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <main className="page">{children}</main>
      <BottomNav />
    </>
  );
}
