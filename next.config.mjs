/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/amr-ai-dashboard" : "",
  images: { unoptimized: true },
};
export default nextConfig;
