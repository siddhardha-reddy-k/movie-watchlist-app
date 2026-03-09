import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";
import authRoutes from "./auth.js";
import watchlistRoutes from "./watchlist.js";

dotenv.config();

// Routes

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173", // only allow your React app
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

// app.get("/test-db", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     res.json({
//       message: "Database connected!",
//       time: result.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Test route
// app.get("/test-movies", async (req, res) => {
//   try {
//     // 1. Define the keyword you want to search
//     const keyword = req.query.query || "Inception";

//     // 2. Use the SEARCH endpoint, add your API Key, and add your keyword
//     const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${keyword}`;
//     // 3. Make the fetch request
//     const response = await fetch(tmdbUrl, {
//       method: "GET",
//       headers: {
//         accept: "application/json",
//       },
//     });
//     // 4. Convert the response to JSON
//     const data = await response.json();

//     // 5. Build a "parsed" version containing only the fields you actually need
//     const parsedMovies = data.results.map((movie) => ({
//       id: movie.id,
//       title: movie.title,
//       overview: movie.overview,
//       releaseDate: movie.release_date,
//       rating: movie.vote_average,
//       posterUrl: movie.poster_path
//         ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//         : null,
//     }));
//     console.log(parsedMovies);
//     // 6. Send the parsed movies back to the browser or Postman
//     res.json({
//       success: true,
//       searchTerm: keyword,
//       totalResults: data.total_results,
//       movies: parsedMovies,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to fetch movies" });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
