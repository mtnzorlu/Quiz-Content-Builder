# Quiz & Learning Content Builder

Kendi eğitim setinizi oluşturmak ve JSON formatında dışa aktarmak için modern bir araç.  
Bu araç, eğitim uygulamaları geliştirenler için içerik altyapısı sağlar ve farklı eğitim programlarında tekrar kullanılabilir.

![Screenshoot](/src/assets/Screenshot.png)

---

## Özellikler

- 📝 Soru-cevap içerikleri oluşturma
- 📁 Çoklu proje yönetimi
- 💾 LocalStorage ile otomatik kayıt
- 📤 JSON export (standart format)
- 🎨 Modern ve responsive tasarım
- 🔄 Tekrar kullanılabilir içerik altyapısı
- ⚡ Hızlı ve sezgisel kullanıcı deneyimi

---

## Neden Bu Proje?

Eğitim setleri hazırlamak genellikle manuel ve zaman alıcı bir süreçtir.  
Bu araç, bu süreci basitleştirir, standart JSON formatıyla içerikleri dışa aktarmanızı sağlar ve kendi uygulamalarınızda veya projelerinizde tekrar kullanılabilecek bir altyapı sunar.

---

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

## Kullanım

1. Yeni bir proje oluşturun
2. Soru ve cevaplarınızı ekleyin
3. JSON olarak export edin
4. Export edilen JSON'u kendi uygulamalarınızda kullanın

## Teknolojiler

- Vue 3 (Composition API)
- Vite
- Tailwind CSS
- LocalStorage

## JSON Formatı

Export edilen JSON standart bir yapıya sahiptir:

```json
{
  "meta": {
    "title": "Proje Başlığı",
    "description": "Açıklama",
    "totalQuestions": 10
  },
  "questions": [
    {
      "id": 1,
      "question": "Soru metni",
      "answer": "Cevap metni",
      "category": "Kategori",
      "difficulty": "easy"
    }
  ]
}
```

