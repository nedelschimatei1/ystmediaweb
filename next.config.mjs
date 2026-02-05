/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

const nextConfig = {
  // Note: removed static export so server routes (API) can run
  // trailingSlash kept for legacy exported URLs
  trailingSlash: true,
  
  typescript: {
    // Do not ignore build errors—fail the build on type errors
    ignoreBuildErrors: false,
  },
  // Disable production source maps for smaller production bundles
  productionBrowserSourceMaps: false,
  // Enable compression (gzip/brotli)
  compress: true,
  // Optimize images in production (skip optimization in development)
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'],
    // Use `remotePatterns` (supports protocol/hostname/pathname) instead of deprecated `domains`
    remotePatterns: [
      { protocol: 'https', hostname: 'ystmedia.com' },
      { protocol: 'https', hostname: 'cdn.example.com' },
    ],
  },
  // Experimental features for better performance
  experimental: {
    // Optimize imports to reduce bundle size
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      'date-fns',
    ],
  },
  // Turbopack config (Next.js 16+)
  turbopack: {},
}

export default withBundleAnalyzer(nextConfig)
