/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public'
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  reactStrictMode: true
});

module.exports = withPWA(withBundleAnalyzer({}))