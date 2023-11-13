import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { ApiError } from "./Utils/ApiError.js";
import userRouter from "./Routes/user_router";
import { DB_NAME } from "../Constants";
import mongoose from "mongoose";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.set("trust proxy", 1);
//? rendering static images in the site
app.use(express.static("public"));
//? So, by using app.use(express.json()), you're telling your Express application to parse JSON data automatically from incoming requests, making it easy to work with JSON data in your route handlers or controllers.
app.use(express.json());
//?Immediate Availability: Loading environment variables at the beginning of your application's execution ensures that they are available when you need them, especially in other parts of your code that depend on these variables.
dotenv.config();

const port = process.env.PORT || 4010;
//? we are getting an promises from the mongoose.connect and after the promises we need to listen to the port and if there is any error in that then go to catch section
mongoose
  .connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
  .then(() => {
    app.listen(port, () => {
      console.log("Server connected to port " + port);
    });
    console.log("Database connected");
  })
  .catch((e) => {
    console.log(e);
  });

//? Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

// app.use(limiter);
app.use("/api/v1/users", userRouter);
