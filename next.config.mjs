/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    webpack: (config, context) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };
        config.resolve.alias["node-fetch"] = false;
        return config;
    },
};

export default nextConfig;
