import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import "./Header.css";

const Header = () => {
  // Hämtar användare och logout-funktion från zustand store
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // State för mobilmeny (öppen/stängd)
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // tömmer store, navigerar till startsida, stänger meny
  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header>
      <div className="header-inner">

        <NavLink to="/" className="logo" onClick={closeMenu}>
          <BookOpen size={32} />
        </NavLink>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Meny"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <ul>
            <li><NavLink to="/" onClick={closeMenu}>Startsida</NavLink></li>

            {user && (
              <li><NavLink to="/profile" onClick={closeMenu}>Min profil</NavLink></li>
            )}

            {!user ? (
              <>
                <li><NavLink to="/loggain" onClick={closeMenu}>Logga in</NavLink></li>
                <li><NavLink to="/registrera" onClick={closeMenu}>Registrera</NavLink></li>
              </>
            ) : (
              <li><button onClick={handleLogout}>Logga ut</button></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;