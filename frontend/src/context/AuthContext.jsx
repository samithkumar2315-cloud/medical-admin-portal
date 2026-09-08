import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = authService.getToken();
    const savedUser = authService.getUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await authService.login(username, password);
    authService.setAuth(response.token, response.user);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => user?.role === 'Administrator';
  const isSubAdmin = () => user?.role === 'SubAdministrator';

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const getBasePath = () => {
    if (isAdmin()) return '/admin';
    if (isSubAdmin()) return '/subadmin';
    return '/';
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isSubAdmin,
    hasPermission,
    getBasePath,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
