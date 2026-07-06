import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import './Navbar.css';

export function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate('/login');
  }

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Kelime Öğren
        </Link>
        <div className="navbar-right">
          <span className="navbar-user">Hoş geldin, {user.userName}</span>
          <Button variant="ghost" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </div>
      </div>
    </nav>
  );
}
