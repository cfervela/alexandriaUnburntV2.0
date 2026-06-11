import { NavLink } from "react-router";
import './NavBar.css'

const navLinkClass = ({ isActive }) =>
  isActive ? "nav-link-active" : "nav-link-default";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
      <nav className="navbar-main">
        <NavLink to="/" className="navbar-brand">
          Alexandria Unburnt
        </NavLink>

        <NavLink to="/catalogue" className={navLinkClass}>
          Catalogue
        </NavLink>

        {user.role === "admin" && (
          <>
            <NavLink to="/booksAdmin" className={navLinkClass}>
              Books
            </NavLink>
            {user.permissionLevel === "superadmin" && (
              <NavLink to="/usersAdmin" className={navLinkClass}>
                Users
              </NavLink>
            )}
          </>
        )}

        {!user.role && (
          <NavLink to="/register" className={navLinkClass}>
            Register
          </NavLink>
        )}
      </nav>
  );
};

export default Navbar;