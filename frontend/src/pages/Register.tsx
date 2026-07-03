import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import './AuthPages.css';

export function Register() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await register(userName, email, password);
      loginUser(result.token, result.userName, result.email);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <h1>Hesap Oluştur</h1>
        <p className="auth-subtitle">Kelime öğrenme yolculuğuna başla</p>
        <form onSubmit={handleSubmit}>
          <Input
            id="userName"
            label="Kullanıcı Adı"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <Input
            id="email"
            label="E-posta"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <p className="auth-error">{error}</p>}
          <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: 16 }}>
            {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
          </Button>
        </form>
        <p className="auth-footer">
          Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
        </p>
      </Card>
    </div>
  );
}
