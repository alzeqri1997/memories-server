import { config } from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

// Deceleration of .env variables
config();

import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/user.js";

// app config
const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Routes
app.use("/posts", postRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.redirect("/posts");
});

app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

function errorHandler(error, request, response, next) {
  return response.status(error.status || 500).json({
    error: {
      message: error.message || "Something went wrong . Reload the page ,or try again later ",
    },
  });
}

app.use(errorHandler);

const CONNECTION_URL = process.env.MONGO_DB;
const PORT = process.env.PORT || 5000;

// mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose
  .connect(CONNECTION_URL, { useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`)))
  .catch(error => {
    console.log(`
        error occurred
      ${error}`);
  });

// Connecting to local mongoDB
// mongoose
//   .connect('mongodb://localhost/memo', {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     keepAlive: true,
//   })
//   .then(() =>
//     app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`))
//   )
//   .catch((error) => {
//     console.log(`
//         error occurred
//       ${error}`);
//   });
