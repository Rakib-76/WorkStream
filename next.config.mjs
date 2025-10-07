/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com"
            },

            {
                protocol: "https",
                hostname: "i.ibb.co",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
        domains: ['i.ibb.co', 'avatars.githubusercontent.com']
    },
};

export default nextConfig;