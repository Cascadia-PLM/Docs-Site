import React from 'react';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface ScreenshotProps {
  /** Base name without -light/-dark suffix (e.g., "parts-list") */
  name: string;
  /** Alt text for accessibility */
  alt: string;
  /** Subdirectory under /img/screenshots/ (e.g., "user-guide") */
  category?: string;
  /** Optional width constraint */
  width?: string | number;
}

/**
 * Theme-aware screenshot component for documentation.
 * Automatically loads light/dark variants based on current theme.
 *
 * @example
 * <Screenshot
 *   name="parts-list"
 *   alt="Parts list view"
 *   category="user-guide"
 * />
 */
export default function Screenshot({
  name,
  alt,
  category,
  width
}: ScreenshotProps): React.ReactElement {
  const basePath = category
    ? `/img/screenshots/${category}/${name}`
    : `/img/screenshots/${name}`;

  return (
    <ThemedImage
      alt={alt}
      sources={{
        light: useBaseUrl(`${basePath}-light.png`),
        dark: useBaseUrl(`${basePath}-dark.png`),
      }}
      className="screenshot"
      style={width ? { width, maxWidth: '100%' } : undefined}
    />
  );
}
