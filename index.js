import { config } from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

// Deceleration of .env variables
config();

// app config
const app = express();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

const CONNECTION_URL = process.env.MONGO_DB;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`))
  )
  .catch((error) => {
    console.log(`
        error occurred
      ${error}`);
  });

// app.listen(PORT, () => {
//   console.log(`server is on ${PORT}`);
// });
