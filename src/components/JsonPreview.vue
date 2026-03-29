<script setup>
import { ref, computed } from 'vue'
import { projectStore } from '../stores/projectStore'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

const copied = ref(false)
const downloading = ref(false)

const jsonData = computed(() => {
  return projectStore.exportProject(props.project.id)
})

const jsonString = computed(() => {
  return JSON.stringify(jsonData.value, null, 2)
})

function copyToClipboard() {
  navigator.clipboard.writeText(jsonString.value)
    .then(() => {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    })
    .catch(err => {
      console.error('Kopyalama hatası:', err)
      alert('Kopyalama başarısız oldu')
    })
}

function downloadJson() {
  downloading.value = true
  
  try {
    const blob = new Blob([jsonString.value], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    // Dosya adını oluştur (başlıktan veya ID'den)
    const fileName = props.project.meta.title
      .toLowerCase()
      .replace(/[^a-z0-9ğüşıöçâîû]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    link.href = url
    link.download = `${fileName || props.project.id}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    setTimeout(() => {
      downloading.value = false
    }, 500)
  } catch (err) {
    console.error('İndirme hatası:', err)
    alert('İndirme başarısız oldu')
    downloading.value = false
  }
}

function close() {
  emit('close')
}
</script>

<template>
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="close"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-fadeIn">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">JSON Önizleme</h2>
          <p class="text-sm text-gray-600 mt-1">{{ project.meta.title }}</p>
        </div>
        <button
          @click="close"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- JSON İçeriği -->
      <div class="flex-1 overflow-y-auto p-6 bg-gray-50 custom-scrollbar">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-sm text-green-400 font-mono">{{ jsonString }}</pre>
        </div>
      </div>

      <!-- Footer - Aksiyonlar -->
      <div class="p-6 border-t border-gray-200 bg-gray-50">
        <div class="flex flex-wrap gap-3">
          <button
            @click="downloadJson"
            :disabled="downloading"
            class="btn btn-primary flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {{ downloading ? 'İndiriliyor...' : 'JSON Dosyası İndir' }}
          </button>

          <button
            @click="copyToClipboard"
            class="btn btn-secondary flex items-center gap-2"
          >
            <svg v-if="!copied" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg v-else class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ copied ? 'Kopyalandı!' : 'Panoya Kopyala' }}
          </button>

          <button
            @click="close"
            class="btn btn-secondary ml-auto"
          >
            Kapat
          </button>
        </div>

        <!-- İstatistikler -->
        <div class="mt-4 flex gap-6 text-sm text-gray-600">
          <div>
            <span class="font-medium">Toplam Soru:</span>
            {{ jsonData.meta.totalQuestions }}
          </div>
          <div>
            <span class="font-medium">Dosya Boyutu:</span>
            {{ (jsonString.length / 1024).toFixed(2) }} KB
          </div>
          <div>
            <span class="font-medium">Oluşturma:</span>
            {{ new Date(jsonData.meta.createdAt).toLocaleDateString('tr-TR') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

