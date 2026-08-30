import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());


app.get('/', (req: Request, res: Response) => {
    res.send('Product Service is Running!');
});

const startServer = async () => {
    try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`User Service is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }


}
startServer();