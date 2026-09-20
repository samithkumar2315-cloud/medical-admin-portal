import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff, FiShield, FiAlertCircle, FiActivity } from 'react-icons/fi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(username, password);
      if (user.role === 'Administrator') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'SubAdministrator') {
        navigate('/subadmin/dashboard', { replace: true });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Invalid username or password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
    setLoading(true);
    try {
      const user = await login(u, p);
      if (user.role === 'Administrator') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'SubAdministrator') {
        navigate('/subadmin/dashboard', { replace: true });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Invalid username or password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" id="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <FiActivity />
          </div>
          <h1>Medical Administration Portal</h1>
          <p>Secure Healthcare Data Management</p>
        </div>

        {error && (
          <div className="login-error" id="login-error">
            <FiAlertCircle /> {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="remember-row">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" className="login-btn" disabled={loading} id="login-submit-btn">
            {loading && <span className="btn-spinner"></span>}
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="demo-credentials-card" id="demo-credentials">
          <span className="demo-credentials-title">Demo Accounts (Click to Instant Login):</span>
          <div className="demo-credentials-buttons">
            <button
              type="button"
              className="demo-badge-btn"
              onClick={() => handleQuickLogin('admin', 'Admin@123')}
            >
              <span className="demo-role admin">Administrator</span>
              <code>admin / Admin@123</code>
            </button>
            <button
              type="button"
              className="demo-badge-btn"
              onClick={() => handleQuickLogin('subadmin', 'SubAdmin@123')}
            >
              <span className="demo-role subadmin">Sup Administrator</span>
              <code>subadmin / SubAdmin@123</code>
            </button>
          </div>
        </div>

        <div className="login-footer">
          <FiShield size={14} />
          <span>Secure role-based access</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
