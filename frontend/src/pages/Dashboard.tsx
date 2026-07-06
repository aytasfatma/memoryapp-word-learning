import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

interface MenuCard {
  title: string;
  description: string;
  icon: string;
  path: string;
  color: 'primary' | 'accent' | 'success' | 'info';
}

const menuCards: MenuCard[] = [
  {
    title: 'Kelimeleri Yönet',
    description: 'Yeni kelime ekle, var olanları düzenle veya sil',
    icon: '📚',
    path: '/words',
    color: 'primary',
  },
  {
    title: 'Sınava Gir',
    description: 'Günlük sınav soruları, spaced-repetition ile öğren',
    icon: '✏️',
    path: '/quiz',
    color: 'accent',
  },
  {
    title: 'Ayarlar',
    description: 'Günlük yeni kelime sayısını ayarla',
    icon: '⚙️',
    path: '/settings',
    color: 'success',
  },
  {
    title: 'Analiz Raporu',
    description: 'Konu bazlı başarı yüzdeleri ve ilerleme',
    icon: '📊',
    path: '/analytics',
    color: 'info',
  },
  {
    title: 'Bulmacalar',
    description: 'Eşleştirme, Anagram, Kelime Avı oyunları',
    icon: '🎮',
    path: '/puzzle',
    color: 'primary',
  },
  {
    title: 'Hafıza Çivisi',
    description: 'Kelimelerine özel hatırlatma ipuçları',
    icon: '💡',
    path: '/mnemonics',
    color: 'accent',
  },
];

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Hoş geldin, {user?.userName}!</h1>
        <p>Kelime öğrenme yolculuğuna devam et</p>
      </div>
      <div className="menu-grid">
        {menuCards.map((menu) => (
          <Link key={menu.path} to={menu.path} className={`menu-link color-${menu.color}`}>
            <Card>
              <div className="menu-card">
                <span className="menu-icon">{menu.icon}</span>
                <h2>{menu.title}</h2>
                <p>{menu.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
