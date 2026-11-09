import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export function ProtectedRoute() {
  const auth = useAuthStore()

  useEffect(() => {
    if (!auth.initialized) {
      void auth.initialize()
    }
  }, [auth.initialized, auth.initialize])

  if (!auth.initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-sm font-medium text-stone-500">Checking authentication...</div>
      </div>
    )
  }

  if (!auth.session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
export default ProtectedRoute
