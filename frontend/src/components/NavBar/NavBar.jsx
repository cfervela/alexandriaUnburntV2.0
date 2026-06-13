import { NavLink } from "react-router";
import { useCart } from "../../context/CartContext";
import './NavBar.css'

const navLinkClass = ({ isActive }) =>
  isActive ? "nav-link-active" : "nav-link-default";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { totalItems } = useCart();

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

        <div className="navbar-right">
          <NavLink to="/cart" className={navLinkClass}>
            <i className="bi bi-cart"></i>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </NavLink>

          {!user.role && (
            <NavLink to="/register" className={navLinkClass}>
              Register
            </NavLink>
          )}
        </div>
      </nav>
  );
};

export default Navbar;