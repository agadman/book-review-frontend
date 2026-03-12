import { NavLink } from "react-router-dom"

const Header = () => {
  return (
    <header>
        <ul>
            <li><NavLink to="/">Startsida</NavLink></li>
            <li><NavLink to="/profile">Min profil</NavLink></li>
        </ul>
    </header>
  )
}

export default Header