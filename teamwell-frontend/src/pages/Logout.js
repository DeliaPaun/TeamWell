import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  return null;
}

export default Logout;
