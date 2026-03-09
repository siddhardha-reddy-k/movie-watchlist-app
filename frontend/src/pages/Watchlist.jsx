import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API_URL from "../config.js";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/watchlist`, {
        headers: {
          authorization: token,
        },
      });

      const data = await response.json();
      setWatchlist(data);
    } catch (error) {
      toast.error("Failed to fetch watchlist!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${API_URL}/watchlist/${id}`, {
        method: "DELETE",
        headers: {
          authorization: token,
        },
      });

      setWatchlist(watchlist.filter((movie) => movie.id !== id));
      toast.success(`${title} removed from watchlist!`);
    } catch (error) {
      toast.error("Failed to remove movie!");
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
          <a
            href="/search"
            className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            + Add Movies
          </a>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mt-20">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && watchlist.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <p className="text-6xl mb-4">🎬</p>
            <p className="text-xl text-gray-400 mb-4">
              Your watchlist is empty!
            </p>

            <a
              href="/search"
              className="bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Find Movies
            </a>
          </div>
        )}

        {/* Movie Grid */}
        {!loading && watchlist.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {watchlist.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Poster"
                  }
                  alt={movie.movie_title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-1 text-white">
                    {movie.movie_title}
                  </h3>
                  <p className="text-gray-400 text-xs mb-3">
                    Added {new Date(movie.added_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDelete(movie.id, movie.movie_title)}
                    className="w-full bg-red-500 text-white py-1 rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Watchlist;
