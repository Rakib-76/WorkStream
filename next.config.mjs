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
                hostname: "i.ibb.co", // Added this to allow your avatar image
            },
        ],
        domains: ['i.ibb.co']
    },
};

export default nextConfig;
