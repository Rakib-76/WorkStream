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
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com", // ✅ Google profile images allowed
            },
        ],
        domains: [
            "i.ibb.co",
            "avatars.githubusercontent.com",
            "lh3.googleusercontent.com", // ✅ Add this domain too
        ],
    },
};

export default nextConfig;
