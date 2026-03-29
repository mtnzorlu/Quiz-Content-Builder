# Quiz Content Builder - Başlangıç Rehberi

## 🚀 Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**
   
   ```bash
   npm install
   ```

2. **Geliştirme sunucusunu başlatın:**
   
   ```bash
   npm run dev
   ```

3. **Tarayıcınızda açın:**
   Sunucu başladığında, genellikle `http://localhost:5173` adresinde çalışır.

## 📖 Kullanım Kılavuzu

### 1. Yeni Proje Oluşturma

1. Sağ üstteki **"Yeni Proje"** butonuna tıklayın
2. Proje bilgilerini doldurun:
   - **Başlık**: Proje adı (zorunlu)
   - **Açıklama**: Proje hakkında kısa bilgi
   - **Kategori**: Proje kategorisi (örn: "Dil Öğrenimi")
3. **"Oluştur"** butonuna tıklayın

### 2. Soru Ekleme

1. Sol panelden bir proje seçin
2. **"Yeni Soru"** butonuna tıklayın
3. Soru bilgilerini girin:
   - **Soru**: Soru metni (zorunlu)
   - **Cevap**: Cevap metni (zorunlu)
   - **Kategori**: Sorunun kategorisi (opsiyonel)
   - **Zorluk**: Kolay, Orta veya Zor
   - **Açıklama**: Ek bilgi veya ipucu (opsiyonel)
4. **"Ekle"** butonuna tıklayın

### 3. Soru Düzenleme

1. Bir sorunun üzerindeki **düzenle (kalem)** ikonuna tıklayın
2. Değişikliklerinizi yapın
3. **"Güncelle"** butonuna tıklayın

### 4. JSON Export

1. Bir proje seçin
2. **"JSON İndir"** butonuna tıklayın
3. JSON önizlemesi açılır
4. İsterseniz:
   - **"JSON Dosyası İndir"**: Dosya olarak indirin
   - **"Panoya Kopyala"**: Kopyalayıp başka yerde kullanın

### 5. Proje Silme

1. Sol panelde bir projenin üzerindeki **çöp kutusu** ikonuna tıklayın
2. Onaylayın

## 📁 Export Edilen JSON Formatı

Export ettiğiniz JSON dosyaları şu formatta olacaktır:

```json
{
  "meta": {
    "title": "Proje Başlığı",
    "description": "Proje açıklaması",
    "category": "Kategori",
    "createdAt": "2025-12-18T10:00:00.000Z",
    "updatedAt": "2025-12-18T15:30:00.000Z",
    "totalQuestions": 10
  },
  "questions": [
    {
      "id": 1,
      "question": "Soru metni?",
      "answer": "Cevap metni",
      "category": "Alt Kategori",
      "difficulty": "medium",
      "explanation": "Ek açıklama"
    }
  ]
}
```

## 🎯 Quiz Uygulamasında Kullanım

Export ettiğiniz JSON'u quiz uygulamanızda şu şekilde kullanabilirsiniz:

```javascript
// JSON dosyasını yükle
fetch('data/quiz.json')
  .then(response => response.json())
  .then(data => {
    console.log('Proje:', data.meta.title);
    console.log('Toplam Soru:', data.meta.totalQuestions);

    // Soruları kullan
    data.questions.forEach(q => {
      console.log(`${q.question} -> ${q.answer}`);
    });
  });
```

## 💾 Veri Saklama

- Tüm projeler **LocalStorage**'da otomatik olarak saklanır
- Tarayıcınızı kapatıp açsanız bile verileriniz korunur
- Farklı tarayıcılar farklı LocalStorage kullanır
- LocalStorage temizlenirse veriler kaybolabilir (yedekleme yapın!)

## 🔧 Geliştirme

### Proje Yapısı

```
src/
├── App.vue                 # Ana uygulama
├── main.js                 # Giriş noktası
├── assets/
│   └── style.css          # Global stiller
├── components/
│   ├── ProjectList.vue    # Proje listesi
│   ├── ProjectEditor.vue  # Proje düzenleyici
│   ├── QuestionList.vue   # Soru listesi
│   ├── QuestionForm.vue   # Soru formu
│   └── JsonPreview.vue    # JSON önizleme
├── composables/
│   └── useLocalStorage.js # LocalStorage helper
└── stores/
    └── projectStore.js    # Global state
```

### Build

Production build için:

```bash
npm run build
```

Build edilen dosyalar `dist/` klasöründe olacaktır.

## 🎨 Özelleştirme

- Renkler: `tailwind.config.js` dosyasından
- Stiller: `src/assets/style.css` dosyasından
- Component'ler: `src/components/` klasöründen

## ❓ Sık Sorulan Sorular

**S: Verilerim nerede saklanıyor?**
C: Tarayıcınızın LocalStorage'ında. Sunucuya hiçbir veri gönderilmez.

**S: Verileri farklı bilgisayarlarda kullanabilir miyim?**
C: JSON export yapıp başka bilgisayarda import etmeniz gerekir (şimdilik manuel).

**S: Resim veya video ekleyebilir miyim?**
C: Şu anda sadece metin destekleniyor. URL olarak ekleyebilirsiniz.

**S: Çoktan seçmeli soru eklenebilir mi?**
C: Bu versionda sadece soru-cevap formatı var. Gelecek versiyonlarda eklenecek.

## 🤝 Katkıda Bulunma

Bu projeyi geliştirmek için:

1. Yeni özellikler ekleyin
2. Hataları düzeltin
3. Dokümantasyonu iyileştirin

## 📝 Lisans

Bu proje MIT lisanslıdır.
