import { NavLink } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import './NavBar.css'

const navLinkClass = ({ isActive }) =>
  isActive ? "nav-link-active" : "nav-link-default";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
      <nav className="navbar-main">
        <NavLink to="/" className="navbar-brand">
          Alexandria Unburnt
        </NavLink>

        <NavLink to="/catalogue" className={navLinkClass}>
          Catalogue
        </NavLink>

        <NavLink to="/contact" className={navLinkClass}>
          Contact
        </NavLink>

        {user?.role === "admin" && (
          <>
            <NavLink to="/booksAdmin" className={navLinkClass}>
              Books
            </NavLink>
            <NavLink to="/messagesAdmin" className={navLinkClass}>
              Messages
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

          {isAuthenticated ? (
            <>
              <span className="nav-user">{user?.name}</span>
              <button className="nav-logout-btn" onClick={logout}>
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
  );
};

export default Navbar;