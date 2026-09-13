"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function NavLink({ 
  href, 
  children, 
  className = "", 
  activeClassName = "active",
  exact = false,
  tooltip
}: { 
  href: string, 
  children: React.ReactNode,
  className?: string,
  activeClassName?: string,
  exact?: boolean,
  tooltip?: string
}) {
  const pathname = usePathname();
  // If exact is true, path must match exactly.
  // Otherwise, it checks if it starts with the path (to cover subroutes).
  // Special case: href="/" shouldn't make everything active.
  const isActive = exact 
    ? pathname === href 
    : (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  return (
    <Link 
      href={href} 
      className={`${className} ${isActive ? activeClassName : ''}`.trim()} 
      data-tooltip={tooltip}
    >
      {children}
    </Link>
  );
}
