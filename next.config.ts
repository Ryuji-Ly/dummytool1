import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    config.plugins.push(
      new (require("@module-federation/nextjs-mf").ModuleFederationPlugin)({
        name: "dummytool1",
        filename: "static/chunks/remoteEntry.js",
        exposes: {},
        shared: {
          react: { singleton: true, eager: true, requiredVersion: false },
          "react-dom": { singleton: true, eager: true, requiredVersion: false },
        },
      })
    );
    return config;
  },
};

export default nextConfig;
