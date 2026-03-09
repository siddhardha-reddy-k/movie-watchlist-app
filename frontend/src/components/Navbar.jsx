import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const token = localStorage.getItem("token");

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center">
      {/* Logo */}
      <a href="/search" className="text-xl font-bold text-yellow-400">
        🎬 CineList
      </a>

      {/* Links */}
      <div className="flex items-center gap-6">
        <a href="/search" className="hover:text-yellow-400 transition-colors">
          Search
        </a>
        <a
          href="/watchlist"
          className="hover:text-yellow-400 transition-colors"
        >
          My Watchlist
        </a>

        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        ) : (
          <a
            href="/login"
            className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
