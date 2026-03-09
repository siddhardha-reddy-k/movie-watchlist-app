import express from "express";
import pool from "./db.js";
import verifyToken from "./middleware.js";

const router = express.Router();

// GET watchlist - fetch all movies for logged in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const watchlist = await pool.query(
      "SELECT * FROM watchlist WHERE user_id = $1",
      [userId],
    );

    res.json(watchlist.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - add a movie to watchlist
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { movie_id, movie_title, poster_path } = req.body;

    const newMovie = await pool.query(
      "INSERT INTO watchlist (user_id, movie_id, movie_title, poster_path) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, movie_id, movie_title, poster_path],
    );

    res.status(201).json(newMovie.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - remove a movie from watchlist
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await pool.query("DELETE FROM watchlist WHERE id = $1 AND user_id = $2", [
      id,
      userId,
    ]);

    res.json({ message: "Movie removed from watchlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
