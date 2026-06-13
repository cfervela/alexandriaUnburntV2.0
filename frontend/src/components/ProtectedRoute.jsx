import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"

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

export default ProtectedRoute
