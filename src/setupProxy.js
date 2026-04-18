const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const target = "http://localhost:" + (process.env.BACKEND_PORT || 8000);

  // Proxy all /api HTTP calls
  app.use(
    ["/auth", "/emails", "/send-email", "/contacts", "/storage", "/logo", "/signatures", "/labels", "/snooze", "/debug"],
    createProxyMiddleware({ target, changeOrigin: true })
  );

  // Proxy the WebSocket for real-time email notifications
  app.use(
    "/mail-events",
    createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
    })
  );
};
