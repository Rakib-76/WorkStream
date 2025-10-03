/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "i.ibb.co",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com", // ✅ Google OAuth profile images
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com", // ✅ GitHub profile images
            },
        ],
    },
};

export default nextConfig;
