import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./auth.js";
import watchlistRoutes from "./watchlist.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://movies.siddhardhareddy.com"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);

app.get("/movies", async (req, res) => {
  const { query } = req.query;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}`,
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
