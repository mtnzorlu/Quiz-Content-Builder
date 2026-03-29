import { ref, watch } from 'vue'

/**
 * LocalStorage ile senkronize reactive değer yönetimi
 * @param {string} key - LocalStorage anahtarı
 * @param {*} defaultValue - Varsayılan değer
 * @returns {Ref} - Reactive değer
 */
export function useLocalStorage(key, defaultValue) {
  // LocalStorage'dan değeri oku
  const readValue = () => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`LocalStorage okuma hatası (${key}):`, error)
      return defaultValue
    }
  }

  // Reactive değer oluştur
  const storedValue = ref(readValue())

  // Değer değiştiğinde LocalStorage'a yaz
  watch(
    storedValue,
    (newValue) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`LocalStorage yazma hatası (${key}):`, error)
      }
    },
    { deep: true }
  )

  return storedValue
}

