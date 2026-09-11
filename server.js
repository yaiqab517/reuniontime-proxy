// Minimal reverse proxy: makes reuniontimeapp.com transparently serve the
// already-built and tested Reunion Time app hosted at reuniontime.pplx.app.
// All requests (including cookies, POST bodies, and API calls) pass through
// unmodified, so the app behaves identically -- only the domain in the
// browser's address bar changes.
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const TARGET = "https://reuniontime.pplx.app";
const PORT = process.env.PORT || 10000;

const app = express();

app.use(
  "/",
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    ws: true,
    secure: true,
    xfwd: true,
    on: {
      proxyReq: (proxyReq) => {
        // Ensure the upstream sees a normal browser-origin request.
        proxyReq.setHeader("host", "reuniontime.pplx.app");
      },
    },
  })
);

app.listen(PORT, () => {
  console.log(`Reunion Time proxy listening on port ${PORT}, forwarding to ${TARGET}`);
});
