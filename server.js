import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";

const publicBasePath = "";

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js").catch((err) => {
        console.error(
          "Failed to load production build. Did you run `npm run build`?",
          err.message
        );
        process.exit(1);
      }),
});

const app = express();

app.use(compression());

app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "DENY");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.set("Content-Security-Policy",
    "default-src 'self'; media-src 'self' https://imissmycafe.com; " +
    "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
    "font-src https://fonts.gstatic.com; script-src 'self'");
  res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.set("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
}

app.use("/", express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

app.all("*", remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}/`)
);
