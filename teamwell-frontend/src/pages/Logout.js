import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Șterge datele utilizatorului din localStorage
    localStorage.removeItem('user');

    // Redirecționează către pagina de login
    navigate('/login');
  }, [navigate]);

  return null;
}

export default Logout;
