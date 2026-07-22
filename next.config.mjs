/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/dog-profile", destination: "/profiles", permanent: true },
      { source: "/competitions/:path*", destination: "/", permanent: false },
      { source: "/upload", destination: "/", permanent: false },
      { source: "/results", destination: "/", permanent: false },
      { source: "/winners", destination: "/", permanent: false },
      { source: "/rewards", destination: "/", permanent: false },
      { source: "/calendar-pups", destination: "/", permanent: false },
      { source: "/tricks-and-tails", destination: "/", permanent: false },
      { source: "/peoples-choice-pooch", destination: "/", permanent: false },
      { source: "/mission", destination: "/about", permanent: true },
    ];
  },
};
export default nextConfig;
