import { useState } from "react";
import toast from "react-hot-toast";
import API_URL from "../config.js";

function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false); // add this

  const handleSearch = async () => {
    if (!query) {
      toast.error("Please enter a movie name!");
      return;
    }

    setLoading(true); // start loading
    try {
      const response = await fetch(`${API_URL}/movies?query=${query}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setMovies(data);
        if (data.length === 0) {
          toast.error("No movies found!");
        }
      } else {
        setMovies([]);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false); // stop loading whether success or error
    }
  };

  // search on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddToWatchlist = async (movie) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first!");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`${API_URL}/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({
          movie_id: movie.id,
          movie_title: movie.title,
          poster_path: movie.poster_path,
        }),
      });

      const data = await response.json();
      toast.success(`${movie.title} added to watchlist!`);
    } catch (error) {
      toast.error("Failed to add movie!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Find Your Next Movie
        </h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 border border-gray-700 bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:border-yellow-400"
            placeholder="Search for a movie..."
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mt-20">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Movie Results */}
      {!loading && (
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
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
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1 text-white">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-xs mb-3">
                  {movie.release_date?.split("-")[0]}
                </p>
                <button
                  onClick={() => handleAddToWatchlist(movie)}
                  className="w-full bg-yellow-400 text-gray-900 font-bold py-1 rounded hover:bg-yellow-500 transition-colors text-sm"
                >
                  + Watchlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
