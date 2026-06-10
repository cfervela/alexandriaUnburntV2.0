import { NavLink } from "react-router";
//import './Navbar.css'

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <nav className="navbar-main">
      <NavLink to="/catalogue" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Catalogue
      </NavLink>

      {user.role === 'admin' && (
        <>
          <NavLink to="/booksAdmin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Books
          </NavLink>
          {user.permissionLevel === 'superadmin' && (
            <NavLink to="/usersAdmin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Users
            </NavLink>
          )}
        </>
      )}

      {!user.role && (
        <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Register
        </NavLink>
      )}
    </nav>
  )
}

export default Navbar