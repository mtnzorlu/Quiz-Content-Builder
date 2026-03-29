# COMPONENT_MAP.md

## Proje Ana Mimarisi & Komponent Haritası

Bu dosya, projenizin temel Vue bileşenlerini ve uygulamadaki rollerini özetler. Ayrıca proje boyunca yapılan önemli arayüz/yapı değişikliklerinin hangi komponenti etkilediğini de belirtir.

---

### Genel Akış

- **App.vue**: Ana çerçeve. Header kısmında "Yeni Proje", "Yeni Soru", "JSON İndir" ve "İçe Aktar" butonları; alt tarafta ise sol panelde ProjectList, sağ panelde ProjectEditor. Tüm modal yönetimi App.vue tarafından yapılır.

---

### Ana Komponentler

#### 1. **App.vue**

- Ana sayfanın iskeleti.
- Uygulama başlığı ve tüm ana butonlar burada ("Yeni Proje", "İçe Aktar", **Yeni Soru** & **JSON İndir** header'da).
- Soru ekleme/önizleme modal yönetimi burada.
- Sol panelde ProjectList, sağda ProjectEditor.
- Soruların eklenmesi/düzenlenmesi ve json export artık buradan kontrol ediliyor.

#### 2. **ProjectList.vue**

- Sol panel. Kullanıcının tüm projelerini listeler.
- Proje başlığı, kısa açıklama, toplam soru sayısı ve "Projeyi Sil".
- Proje seçimi burada gerçekleşir.

#### 3. **ProjectEditor.vue**

- Sağ panelde seçili projenin başlığını, açıklamasını ve (varsa) kategori bilgisini gösterir.
- Eski versiyonda burada yer alan "Yeni Soru" ve "JSON İndir" butonları kaldırıldı.
- Sadece edit/düzenle butonu ile proje başlığı/açıklaması değiştirilebiliyor.
- Soru edit event'i yukarı (App.vue'ya) iletiliyor.
- Kartlar (soru kutuları) içerik bölümünde, QuestionList ile görünür.

#### 4. **QuestionList.vue**

- Seçili projeye ait tüm soruların kart şeklinde sıralandığı alan.
- Kartlar sadece soruyu önde gösterir, tıklanınca alt blokta cevap ve açıklama (renkli kutuda) görünür, etiket ve zorluk ise kartın altında.
- Her kartta "Düzenle" ve "Sil" aksiyonları.

#### 5. **QuestionForm.vue**

- Modal olarak açılır.
- Soru eklemek/düzenlemek için kullanılır.
- Artık doğrudan ProjectEditor değil, App.vue'dan kontrol edilir.

#### 6. **JsonPreview.vue**

- Seçili projenin JSON çıktısını modal ile gösterir.
- App.vue üzerinden açılır.

#### 7. **useLocalStorage.js / projectStore.js**

- Merkezî veri saklama ve localStorage entegrasyonu.

#### 8. **Diğer Dosyalar**

- `index.html`, `main.js`: Giriş ve mount noktası.
- `style.css`, Tailwind ayarları: Global stil ve tema.

---

## Son Değişiklik Haritası

- **App.vue**: "Yeni Soru" ve "JSON İndir" butonları header'a taşındı, modal kontrolü burada. Artık tek merkez.
- **ProjectEditor.vue**: Bu butonlar çıkarıldı, sadece başlık, açıklama ve edit kaldı.
- **QuestionList.vue**: Kart yapısı sadeleşti, soruya tıklayınca cevap & açıklama açılır ve zorluk rozeti alt bölüme taşındı.
- **QuestionForm.vue, JsonPreview.vue**: Modal olarak App.vue üzerinden açılıyor.

---

## Bileşen İlişkileri (Özet Şema)

```
App.vue
├── ProjectList.vue
└── ProjectEditor.vue
    └── QuestionList.vue

App.vue
├── QuestionForm.vue (modal)
└── JsonPreview.vue (modal)
```

Her sorunuzda ya da özellikle bir bileşenin detayında tekrar bu dosyada açıklama yapabilirsiniz.