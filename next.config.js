/** @type {import('next').NextConfig} */
const nextConfig = {

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    // Suppress Handlebars webpack warnings
    config.ignoreWarnings = [
      /require\.extensions is not supported by webpack/,
    ];
    
    return config;
  },
}

module.exports = nextConfig
