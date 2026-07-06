# Kelime Öğrenme Uygulaması (Word Learning App)

Spaced-repetition algoritmasıyla İngilizce kelime öğrenme web uygulaması.

## Teknikler

- **Backend:** ASP.NET Core Web API (.NET 10)
- **Frontend:** React + TypeScript + Vite
- **Database:** PostgreSQL 16 (Docker)
- **Auth:** ASP.NET Core Identity + JWT
- **State:** useState + Context API

## Kurulum

### Backend
```bash
cd backend
dotnet restore
dotnet run --urls http://localhost:6060
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # http://localhost:3000
```

### Database
```bash
docker-compose up -d  # PostgreSQL container'ını başlat
```

## Features

- ✅ Kayıt/Giriş (Email, şifre, JWT)
- ✅ Kelime Yönetimi (Ekleme, silme, dosya yükleme)
- ✅ Sınav Modülü (Spaced-repetition, doğru/yanlış feedback)
- ✅ Ayarlar (Günlük kelime sayısı)
- ✅ Analiz Raporu (Konu bazlı başarı, print CSS)
- ✅ 3 Mini-Oyun (Eşleştirme, Anagram, Kelime Avı)

## GitHub

https://github.com/aytasfatma/memoryapp-word-learning
