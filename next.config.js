/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['cdn.sanity.io'], // Whitelist Sanity's CDN domain
    },
  };
  
  module.exports = nextConfig;
  