/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? true : false,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Allow all hostnames
            },
        ],
    },
}




module.exports = nextConfig
