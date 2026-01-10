import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure webpack for @xenova/transformers
  webpack: (config) => {
    // See https://github.com/xenova/transformers.js/issues/77
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
    };
    return config;
  },
  
  // Ensure WASM files are served correctly
  async headers() {
    return [
      {
        source: "/:path*.wasm",
        headers: [
          {
            key: "Content-Type",
            value: "application/wasm",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
