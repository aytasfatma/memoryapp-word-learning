import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import './AuthPages.css';

export function Login() {
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
      const result = await login(email, password);
      loginUser(result.token, result.userName, result.email);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <h1>Tekrar Hoş Geldin</h1>
        <p className="auth-subtitle">Kelime öğrenmeye devam etmek için giriş yap</p>
        <form onSubmit={handleSubmit}>
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
          />
          {error && <p className="auth-error">{error}</p>}
          <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: 16 }}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>
        <p className="auth-footer">
          <Link to="/forgot-password">Şifremi unuttum</Link>
        </p>
        <p className="auth-footer">
          Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
        </p>
      </Card>
    </div>
  );
}
