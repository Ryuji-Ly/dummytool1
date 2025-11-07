import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.output.publicPath = 'auto';
      
      config.plugins.push(
        new (require("webpack").container.ModuleFederationPlugin)({
          name: "dummytool1",
          filename: "static/remoteEntry.js",
          exposes: {
            "./HomePage": "./src/app/page.tsx",
            "./UserList": "./src/components/UserList.tsx",
            "./UsersPage": "./src/app/users/page.tsx",
          },
          shared: {
            react: { singleton: true, requiredVersion: false },
            "react-dom": { singleton: true, requiredVersion: false },
          },
        })
      );
    }
    return config;
  },
  // Ensure static files are served correctly
  async rewrites() {
    return [
      {
        source: '/remoteEntry.js',
        destination: '/_next/static/remoteEntry.js',
      },
    ];
  },
};

export default nextConfig;
