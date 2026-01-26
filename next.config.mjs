/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,
  // Enable compression (gzip/brotli)
  compress: true,
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
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

export default nextConfig
