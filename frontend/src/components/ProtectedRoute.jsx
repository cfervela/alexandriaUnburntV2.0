import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import PropTypes from "prop-types"

const ProtectedRoute = ({ children, requiredRole, requiredPermission }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  if (requiredPermission && user?.permissionLevel !== requiredPermission) {
    return <Navigate to="/" replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
  requiredPermission: PropTypes.string,
}

export default ProtectedRoute
