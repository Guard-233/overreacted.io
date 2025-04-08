/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  trailingSlash: true,
};

// 本地开发时加载 Cloudflare 开发平台
if (process.env.NODE_ENV === "development") {
  try {
    const { setupDevPlatform } = require("@cloudflare/next-on-pages/next-dev");
    setupDevPlatform();
  } catch (e) {
    console.error("Could not setup dev platform:", e);
  }
}
