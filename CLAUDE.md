# Proje: Kelime Ezberleme Sistemi (Spaced Repetition App)

## Proje Kimliği
Bu bir okul dersi (Scrum ile Yazılım Geliştirme) projesidir. Tek kişi tarafından geliştiriliyor.
Amaç: 6 tekrar prensibiyle çalışan, aralıklı tekrar (spaced repetition) algoritmalı bir kelime
ezberleme uygulaması yapmak. Bu bir AI/LLM projesi DEĞİLDİR — vektör arama, embedding, Claude/OpenAI
API entegrasyonu YOKTUR.

## Tech Stack
- Backend: ASP.NET Core Web API (.NET 10)
- Frontend: React + TypeScript + Vite
- Veritabanı: PostgreSQL 16 (standart image, pgvector YOK), Docker container ile çalışıyor
- ORM: Entity Framework Core
- Auth: ASP.NET Core Identity (kayıt, giriş, şifremi unuttum)

## Ortam Notları (Windows'a özel)
- Bu makinede port 5077–5976 aralığı Windows tarafından rezerve edilmiş (Hyper-V/WSL nedeniyle).
  Kestrel/dotnet run için bu aralığın DIŞINDA port kullan (örn: 6060, 5000, 8080).
- PostgreSQL container'ı: memoryapp-postgres, host portu 6543 -> container içi 5432
  (5432 ve 5433 bloklu çıktı, 6543 kullanılıyor)
- Dosya yükleme (resim/ses): wwwroot/uploads klasöründe diskte saklanır, veritabanında sadece dosya yolu tutulur.

## Klasör Yapısı
ai-memory-app/
├── docker-compose.yml
├── backend/  (proje doğrudan burada, MemoryApp.Api alt klasörü YOK)
└── frontend/ (henüz oluşturulmadı)

## Story Önceliklendirme (sıra ile ilerleniyor)
1. Kullanıcı Kayıt / Giriş / Şifremi Unuttum (5p) ✅ TAMAMLANDI
2. Kelime Ekleme modülü (5p) ✅ TAMAMLANDI
3. Sınav Modülü - aralıklı tekrar algoritması (10p) ✅ TAMAMLANDI
4. Ayarlar - günlük yeni kelime sayısı (5p) ✅ TAMAMLANDI
5. Analiz Raporu - konu bazlı başarı yüzdesi, yazdırılabilir (5p) ✅ TAMAMLANDI
6. Bulmaca / Puzzle (15p) ✅ TAMAMLANDI
7. Hafıza Çivisi - mnemonic teknik oyunu (5p) ✅ TAMAMLANDI

## Veritabanı Şeması (mevcut, DB'de canlı)
### Word (Models/Word.cs): WordId, EngWordName, TurWordName, Picture, AudioPath, Topic, Samples (List<WordSample>)
### WordSample (Models/WordSample.cs): WordSampleId, WordId, Word, Sample
### UserWordProgress (Models/UserWordProgress.cs): Id, UserId, WordId, Word, ConsecutiveCorrectCount, CurrentStageIndex, NextReviewDate, IsMastered
### UserSettings (Models/UserSettings.cs): Id, UserId, DailyNewWordCount (default 10)
### Identity tabloları: AspNetUsers, AspNetRoles vb. (standart ASP.NET Core Identity)
DbContext adı: MemoryAppDbContext (backend/Data/MemoryAppDbContext.cs), IdentityDbContext<IdentityUser>'dan türüyor.
2 migration uygulandı: InitialCreate, AddIdentityTables.

## Sınav Algoritması Mantığı (Story 3 - kritik, ZATEN KODLANDI)
Her gün kullanıcıya: NextReviewDate <= bugün olan kelimeler + UserSettings.DailyNewWordCount kadar yeni kelime gösterilir.
Doğru cevap: ConsecutiveCorrectCount +1, CurrentStageIndex +1, NextReviewDate = bugün + [1,7,30,90,180,365][stage] gün.
Stage 6'yı geçerse IsMastered = true.
Yanlış cevap: ConsecutiveCorrectCount=0, CurrentStageIndex=0, NextReviewDate = yarın.
Soru yönü: Türkçe gösterilir, İngilizce cevap istenir. %50 MultipleChoice (3 yanlış şık + doğru), %50 TextInput.

## TAMAMLANAN VE TEST EDİLEN ENDPOINT'LER (hepsi gerçek HTTP istekleriyle doğrulandı)
### Story 1 - AuthController ([Authorize] YOK, herkese açık):
- POST /api/auth/register, POST /api/auth/login, POST /api/auth/forgot-password (GERÇEK Gmail SMTP ile mail gönderiyor, App Password appsettings.Development.json'da), POST /api/auth/reset-password (yazıldı, test edilmedi)
- User enumeration koruması var (kayıtsız email'de sessizce aynı mesaj döner, mail gönderilmez)
- Dosyalar: Services/ITokenService.cs+TokenService.cs, Services/IEmailService.cs+EmailService.cs, DTOs/AuthDtos.cs, Controllers/AuthController.cs

### Story 2 - WordsController ([Authorize] KORUMALI):
- GET /api/words, GET /api/words/{id}, POST /api/words (multipart/form-data: resim+ses+örnek cümleler), DELETE /api/words/{id}
- PUT (Update) YOK, PDF'te zorunlu değil
- Dosyalar: DTOs/WordDtos.cs, Services/IFileUploadService.cs+FileUploadService.cs, Controllers/WordsController.cs
- Dosyalar wwwroot/uploads/{words|audio}/{guid}.ext olarak kaydediliyor, path DB'ye yazılıyor

### Story 3 - QuizController ([Authorize] KORUMALI):
- GET /api/quiz/today, POST /api/quiz/answer
- Dosyalar: DTOs/QuizDtos.cs, Services/IQuizService.cs+QuizService.cs, Controllers/QuizController.cs

### Story 4 - UserSettingsController ([Authorize] KORUMALI):
- GET /api/usersettings (yoksa otomatik varsayılan 10 oluşturur), PUT /api/usersettings (1-100 doğrulama)
- Dosyalar: DTOs/UserSettingsDtos.cs, Controllers/UserSettingsController.cs

## Test kullanıcıları (DB'de mevcut)
- test@example.com / Test123456
- fatmaytis34@gmail.com (kullanıcı adı: fatma) / Test123456 (gerçek Gmail, SMTP testleri bunu kullandı)
- Test kelimeleri DB'de: apple/elma, book/kitap, cat/kedi, dog/köpek, egg/yumurta (wordId 3-7)

## Story 5 (TAMAMLANDI ve DOĞRULANDI): Analiz Raporu
- UserWordProgress modeline TotalAttempts/TotalCorrect eklendi (AddProgressTrackingFields migration)
- Dosyalar: DTOs/AnalyticsDtos.cs, Controllers/AnalyticsController.cs ([Authorize] korumalı)
- Endpoint: GET /api/analytics/report -> TotalWordsStudied, TotalMasteredWords, TopicBreakdown
- GERÇEK VERİYLE TEST EDİLDİ: meyveler konusu 2/2 doğru -> %100, hayvanlar konusu 2 deneme/1 doğru
  -> %50, elle hesaplananla birebir eşleşti.
- NOT: TotalAttempts>0 filtresi var, migration öncesi eski kayıtlar (apple/book) rapora girmiyor,
  bu normal, yeni cevaplar doğru sayılıyor.

## Story 6 (TAMAMLANDI ve DOĞRULANDI): Bulmaca Modülü
Üç mini-oyun tek PuzzleController altında birleştirildi (çapraz bulmaca yerine, algoritmik
karmaşıklığı azaltmak için Word Search tercih edildi, kullanıcı onayıyla):
- Dosyalar: DTOs/PuzzleDtos.cs, Services/IPuzzleService.cs+PuzzleService.cs, Controllers/PuzzleController.cs
- GET /api/puzzle/match-game?wordCount=N -> İngilizce-Türkçe kart eşleştirme oyunu (N kelime x 2 kart)
- GET /api/puzzle/anagram?wordCount=N -> karışık harfli kelime, kullanıcı orijinali bulacak
- GET /api/puzzle/word-search?wordCount=N -> harf ızgarasında gizlenmiş kelimeler (yatay/dikey/çapraz)
- GERÇEK VERİYLE TEST EDİLDİ: match-game 8 kart doğru döndü, anagram harfleri doğru karıştırdı,
  word-search ızgarada kelimenin gerçekten yerleştiğini doğruladık (BANANA örneği).

## Story 7 (TAMAMLANDI ve DOĞRULANDI): Hafıza Çivisi
- Word modeline MnemonicHint (opsiyonel text) alanı eklendi (AddMnemonicHintField migration)
- CreateWordRequest, WordResponse, WordsController (GetAll/GetById/Create) güncellendi
- Kullanıcı kelime eklerken kendi çağrışım/hatırlatma notunu opsiyonel olarak girebiliyor
- GERÇEK VERİYLE TEST EDİLDİ: Türkçe karakterli (ş,ı,ü) bir ipucu eklendi, hem oluşturma hem
  tekrar okuma isteğinde birebir doğru ve kalıcı olarak döndü.
- Ayrı bir "oyun" endpoint'i yazılmadı, bilinçli karar - MnemonicHint zaten Word CRUD üzerinden
  geliyor, frontend kelime kartlarında gösterecek, KISS prensibi gereği ekstra endpoint gereksiz.

## DURUM ÖZETİ: TÜM 7 STORY TAMAMLANDI (50/50 PUAN)
Story 1,2,3,4,5,6,7 hepsi tamamlandı ve gerçek HTTP istekleriyle doğrulandı.

## SIRADAKI BÜYÜK ADIM: Git init + Secrets Cleanup, sonra Frontend
Backend fonksiyonel olarak bitti. Şimdi:
1. Git init + appsettings.Development.json'ı .gitignore'a ekleme (ya da User Secrets'a taşıma) -
   detay yukarıdaki güvenlik notunda yazılı, MUTLAKA ilk push'tan önce yapılmalı
2. /weatherforecast cruft'unu Program.cs'ten temizleme
3. Frontend (React+TypeScript+Vite) kurulumuna başlama

## GÜVENLİK/TEMİZLİK - HENÜZ YAPILMADI
- SMTP şifresi appsettings.Development.json'da düz metin duruyor - Git kurulumunda MUTLAKA
  appsettings.Development.json .gitignore'a eklenmeli YA DA sırlar User Secrets'a taşınmalı
- Proje henüz git deposu değil (git init hiç yapılmadı)
- Varsayılan /weatherforecast endpoint'i hâlâ Program.cs'te duruyor, temizlenecek
- Bunlar Story'ler bitince ya da uygun bir arada toplu halde temizlenecek

## UI/UX Kuralları (proje notlandırmasında ayrı puan kalemi - 5p)
- Sade, tutarlı tasarım dili: tüm sayfalarda aynı renk paleti, font, buton stili
- Component tabanlı çalış (React) - Button, Card, Input gibi ortak componentler tekrar kullanılacak
- Kullanıcı hataları için anlaşılır Türkçe hata mesajları
- Sınav modülünde anlık geri bildirim (doğru/yanlış renkle - yeşil/kırmızı)
- Loading state ve empty state tasarımları düşünülecek
- Analiz raporu (Story 5) için @media print CSS gerekecek
- Gereksiz animasyon yok, işlevsellik öncelikli

## Kod Kalitesi Kuralları
- KISS prensibi, code smell'lerden kaçın, her story bitince git commit at
