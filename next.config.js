/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "isomorphic-furyroad.s3.amazonaws.com",
      "another-domain.com",
      "utfs.io",  // Add this domain to allow images from utfs.io
    ],
  },
  // webpack(config) {
  //   config.module.rules.push({
  //     // test: /\.svg$/,
  //     // use: ['@svgr/webpack'],
  //     test: /\.(png|jpg|jpeg|gif|svg)$/,
  //     use: ['file-loader'],
  //   });

  //   return config;
  // },
};

module.exports = nextConfig;
