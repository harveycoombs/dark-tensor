import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config, { isServer }) => {
        config.resolve.fallback = { 
        fs: false, 
        net: false, 
        tls: false 
        };
        
        config.resolve.extensionAlias = {
        ".js": [".js", ".ts"],
        ".mjs": [".mjs", ".mtjs"]
        };

        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
        };

        config.resolve.experimental = {
            serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
        };

        return config;
    },
    
    serverComponentsExternalPackages: ["@huggingface/transformers"]
  };
  

export default nextConfig;