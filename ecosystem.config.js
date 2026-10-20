
module.exports = {
  apps: [
    {
      name: "main-site",
      cwd: "/var/www/wxstore-frontend", // CHANGE THIS to your absolute path
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1, // Use 1 to prevent resource exhaustion on small VPS
      exec_mode: "fork",
      max_memory_restart: "800M", // Restarts if it leaks memory
      node_args: "--max-old-space-size=768", // Limits heap to 768MB
      env: {
        NODE_ENV: "production",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXT_PUBLIC_API_URL: 'https://api.wxstoreid.com/api',
      },
    },
  ],
};