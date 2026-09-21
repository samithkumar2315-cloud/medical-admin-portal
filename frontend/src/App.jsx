import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Patients from './pages/Patients';
import Reports from './pages/Reports';
import StaffManagement from './pages/StaffManagement';
import Unauthorized from './pages/Unauthorized';
import LoadingSpinner from './components/LoadingSpinner';

const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === 'Administrator') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'SubAdministrator') return <Navigate to="/subadmin/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

const LoginGuard = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  if (isAuthenticated) {
    if (user?.role === 'Administrator') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'SubAdministrator') return <Navigate to="/subadmin/dashboard" replace />;
  }

  return <Login />;
};

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginGuard />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Root redirect */}
              <Route path="/" element={<RootRedirect />} />

              {/* Administrator routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['Administrator']}>
                      <Dashboard />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/medical-records"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['Administrator']}>
                      <Dashboard />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/patients"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['Administrator']}>
                      <Patients />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['Administrator']}>
                      <Reports />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/staff"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['Administrator']}>
                      <StaffManagement />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['Administrator']}>
                      <Profile />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />

              {/* SubAdministrator routes */}
              <Route
                path="/subadmin/dashboard"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['SubAdministrator']}>
                      <Dashboard />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subadmin/medical-records"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['SubAdministrator']}>
                      <Dashboard />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subadmin/patients"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['SubAdministrator']}>
                      <Patients />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subadmin/reports"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['SubAdministrator']}>
                      <Reports />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subadmin/profile"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['SubAdministrator']}>
                      <Profile />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
