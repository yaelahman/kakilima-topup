'use client';

import Link, { LinkProps } from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { NProgress } from '@/lib/nprogress';
import React from 'react';

export const CustomLink = React.forwardRef<
    HTMLAnchorElement,
    LinkProps & { children: React.ReactNode; className?: string }
>(({ children, href, onClick, className, ...props }, ref) => {
    const router = useRouter();
    const pathname = usePathname();
    const isActive = pathname === href;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const currentPath = window.location.pathname;
        const newPath = href.toString();
        if (currentPath === newPath || newPath.startsWith('#')) {
            if (onClick) onClick(e);
            return;
        }

        if (onClick) onClick(e);

        if (!e.defaultPrevented) {
            e.preventDefault();
            NProgress.start();
            router.push(href.toString());
        }
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className={`${className || ''} ${isActive ? 'active' : ''}`}
            {...props}
            ref={ref}
        >
            {children}
        </Link>
    );
});

CustomLink.displayName = 'CustomLink';