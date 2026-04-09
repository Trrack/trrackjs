'use client';

import clsx from 'clsx';
import { Anchor } from 'nextra/components';
import { useFSRoute } from 'nextra/hooks';

const NAV_ITEMS = [
  {
    label: 'Documentation',
    href: '/docs/tutorial/getting-started',
    activePrefixes: ['/docs'],
  },
  {
    label: 'Showcase',
    href: '/showcase',
    activePrefixes: ['/showcase'],
  },
  {
    label: 'API Reference',
    href: '/api-reference',
    activePrefixes: ['/api-reference'],
  },
  {
    label: 'About',
    href: '/about',
    activePrefixes: ['/about'],
  },
] as const;

function isCurrentRoute(route: string, activePrefixes: readonly string[]) {
  return activePrefixes.some(
    (prefix) => route === prefix || route.startsWith(`${prefix}/`),
  );
}

export function HeaderNav() {
  const route = useFSRoute().split('#', 1)[0];

  return (
    <div className="x:flex x:gap-4 x:overflow-x-auto nextra-scrollbar x:py-1.5">
      {NAV_ITEMS.map(({ label, href, activePrefixes }) => {
        const isActive = isCurrentRoute(route, activePrefixes);

        return (
          <Anchor
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
              'x:text-sm x:whitespace-nowrap x:ring-inset x:transition-colors',
              'x:text-gray-600 x:hover:text-black',
              'x:dark:text-gray-400 x:dark:hover:text-gray-200',
              'x:contrast-more:text-gray-700 x:contrast-more:dark:text-gray-100',
              isActive && 'x:font-medium x:subpixel-antialiased x:text-current',
            )}
          >
            {label}
          </Anchor>
        );
      })}
    </div>
  );
}
