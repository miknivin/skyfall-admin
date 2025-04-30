import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";
import cors from "cors";

// Use CORS middleware to allow requests from frontend URL
const allowedOrigins = process.env.FRONTEND_URL.split(",").map((url) =>
  url.trim()
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin || true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

import path from "path";
// import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught expection");
  process.exit(1);
});

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(cookieParser());

// Import all routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import propertiesRoutes from "./routes/properties.js";
import { fileURLToPath } from "url";

app.use("/api/v1", authRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1", propertiesRoutes);
if (process.env.NODE_ENV === "PRODUCTION") {
  console.log("server");

  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  console.log(path.join(__dirname, "../frontend/dist"));
  app.get("*", (req, res, next) => {
    try {
      console.log("Serving index.html for", req.url);
      res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    } catch (err) {
      console.error("Catch-All Error:", err);
      next(err);
    }
  });
}
app.use(express.urlencoded({ extended: false }));

// Using error middleware
app.use(errorMiddleware);

// Connecting to database and starting server
connectDatabase(() => {
  // console.log("Connected to database successfully!");
  const server = app.listen(process.env.PORT, () => {
    console.log(
      `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
    );
  });

  // Handle Unhandled Promise rejections
  process.on("unhandledRejection", (err) => {
    console.log(`ERROR: ${err}`);
    console.log("Shutting down server due to Unhandled Promise Rejection");
    server.close(() => {
      process.exit(1);
    });
  });
});
