import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <header>
        <ul>
            <li><NavLink to="/">Startsida</NavLink></li>
            
            {user && (
              <li><NavLink to="/profile">Min profil</NavLink></li>
            )}

            {!user ? (
              <>
                <li><NavLink to="/loggain">Logga in</NavLink></li>
                <li><NavLink to="/registrera">Registrera</NavLink></li>
              </>
            ) : (
              <li>
                <button onClick={handleLogout}>Logga ut</button>
              </li>
            )}      
        </ul>
    </header>
  )
}

export default Header