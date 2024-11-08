/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com', 'firebasestorage.googleapis.com'],
  },
  webpack: (config, { dev, isServer }) => {
    // Widget-specific configuration
    if (!isServer) {
      config.output = {
        ...config.output,
        library: {
          name: 'ChatbotWidget',
          type: 'umd',
          export: 'default'
        },
        globalObject: 'typeof self !== "undefined" ? self : this'
      };

      // Disable webpack's hot reload for the widget
      if (dev) {
        config.optimization = {
          ...config.optimization,
          runtimeChunk: false,
          splitChunks: false
        };
      }
    }
    return config;
  },
  // Ensure the widget can be loaded from other domains
  async headers() {
    return [
      {
        source: '/widget.js',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;