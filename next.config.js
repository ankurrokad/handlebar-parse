/** @type {import('next').NextConfig} */
const nextConfig = {

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; worker-src 'self' blob:; child-src 'self' blob:;"
          }
        ]
      }
    ]
  },

  // Disable static generation for the main page to avoid DOMPurify issues
  experimental: {
    // This ensures the page is rendered on the client side
    // and avoids issues with browser-only APIs during build
    staticPageGenerationTimeout: 0
  },

  // Ensure proper handling of client-side only libraries
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      // Add fallbacks for browser-only APIs
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };
    
    // Suppress Handlebars webpack warnings
    config.ignoreWarnings = [
      /require\.extensions is not supported by webpack/,
    ];

    // Handle client-side only libraries properly
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Ensure these are properly handled for client-side
        net: false,
        tls: false,
      };
      
      // Monaco Editor webpack configuration
      config.module.rules.push({
        test: /\.ttf$/,
        type: 'asset/resource'
      });
      
      // Ensure Monaco Editor web workers are handled properly
      config.output.globalObject = 'self';
    }
    
    return config;
  },
}

module.exports = nextConfig
