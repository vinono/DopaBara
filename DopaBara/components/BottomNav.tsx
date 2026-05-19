'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '今日' },
  { href: '/check-in', label: '记录' },
  { href: '/history', label: '历史' },
  { href: '/insights', label: '洞察' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottomNav" aria-label="主导航">
      {navItems.map((item) => (
        <Link className={pathname === item.href ? 'navItem activeNavItem' : 'navItem'} href={item.href} key={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
