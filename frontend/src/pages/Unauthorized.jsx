import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShield } from 'react-icons/fi';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { getBasePath, isAuthenticated } = useAuth();

  const handleGoBack = () => {
    if (isAuthenticated) {
      navigate(`${getBasePath()}/dashboard`, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="unauthorized-page">
      <div>
        <div className="icon">
          <FiShield />
        </div>
        <h1>403 — Access Denied</h1>
        <p>You do not have permission to access this page.</p>
        <button className="btn btn-primary" onClick={handleGoBack}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
