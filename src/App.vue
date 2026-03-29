<script setup>
import { ref, computed } from 'vue'
import ProjectList from './components/ProjectList.vue'
import ProjectEditor from './components/ProjectEditor.vue'
import QuestionForm from './components/QuestionForm.vue'
import JsonPreview from './components/JsonPreview.vue'
import { projectStore } from './stores/projectStore'
import introProject from './assets/intro-questions.json'

const showNewProjectModal = ref(false)
const showQuestionForm = ref(false)
const showJsonPreview = ref(false)
const editingQuestion = ref(null)
const newProjectForm = ref({
  title: '',
  description: '',
  category: '',
})
const fileInput = ref(null)

const selectedProject = computed(() => projectStore.selectedProject)

function createNewProject() {
  if (!newProjectForm.value.title.trim()) {
    alert('Proje başlığı gereklidir!')
    return
  }
  
  projectStore.createProject(newProjectForm.value)
  
  // Formu temizle ve modalı kapat
  newProjectForm.value = { title: '', description: '', category: '' }
  showNewProjectModal.value = false
}

function cancelNewProject() {
  newProjectForm.value = { title: '', description: '', category: '' }
  showNewProjectModal.value = false
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const data = JSON.parse(text)
    
    // JSON formatını kontrol et
    if (!data.meta || !data.questions || !Array.isArray(data.questions)) {
      alert('Geçersiz JSON formatı! Doğru formatta bir dosya yükleyin.')
      return
    }
    
    // Projeyi store'a aktar
    const importedProject = projectStore.importProject(data)
    
    alert(`"${importedProject.meta.title}" başarıyla içe aktarıldı! (${importedProject.meta.totalQuestions} soru)`)
    
  } catch (error) {
    console.error('JSON yükleme hatası:', error)
    alert('Dosya yüklenirken hata oluştu! Lütfen geçerli bir JSON dosyası seçin.')
  } finally {
    // Input'u temizle (aynı dosyayı tekrar yükleyebilmek için)
    event.target.value = ''
  }
}

function openQuestionForm() {
  editingQuestion.value = null
  showQuestionForm.value = true
}

function openEditQuestion(question) {
  editingQuestion.value = question
  showQuestionForm.value = true
}

function closeQuestionForm() {
  showQuestionForm.value = false
  editingQuestion.value = null
}

function exportJson() {
  showJsonPreview.value = true
}

function importIntroProject() {
  try {
    const importedProject = projectStore.importProject(introProject)
    alert(`"${importedProject.meta.title}" tanıtım projesi eklendi! (${importedProject.meta.totalQuestions} soru)`)
  } catch (error) {
    console.error('Tanıtım projesi yüklenirken hata:', error)
    alert('Tanıtım projesi yüklenirken bir hata oluştu.')
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Quiz Content Builder</h1>
            <p class="text-sm text-gray-600 mt-1">Eğitim uygulamaları için içerik üreticisi</p>
          </div>
          <div class="flex gap-3">
            <button
              @click="importIntroProject"
              class="btn btn-secondary flex items-center gap-2"
              title="Uygulamanın tanıtım sorularını yeni bir proje olarak ekle"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a2 2 0 011.414.586l3.414 3.414A2 2 0 0118 9.414V18a2 2 0 01-2 2z" />
              </svg>
              <span class="hidden sm:inline">Tanıtım Soruları</span>
            </button>
            <button 
              @click="triggerFileInput"
              class="btn btn-secondary flex items-center gap-2"
              title="JSON dosyası yükle"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span class="hidden sm:inline">İçe Aktar</span>
            </button>
            <button 
              @click="showNewProjectModal = true"
              class="btn btn-primary flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Yeni Proje
            </button>
            <template v-if="selectedProject">
              <button
                @click="openQuestionForm"
                class="btn btn-primary flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Yeni Soru
              </button>
              <button
                @click="exportJson"
                class="btn btn-red flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                JSON İndir
              </button>
            </template>
            <!-- Gizli dosya input -->
            <input
              ref="fileInput"
              type="file"
              accept=".json,application/json"
              @change="handleFileUpload"
              class="hidden"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        <!-- Sol Panel - Projeler -->
        <div class="lg:col-span-3">
          <ProjectList />
        </div>

        <!-- Sağ Panel - Proje Editörü -->
        <div class="lg:col-span-9">
          <ProjectEditor @edit="openEditQuestion" />
        </div>
      </div>
    </main>

    <!-- Yeni Proje Modal -->
    <div 
      v-if="showNewProjectModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="cancelNewProject"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Yeni Proje Oluştur</h2>
        
        <form @submit.prevent="createNewProject" class="space-y-4">
          <div>
            <label class="label">Proje Başlığı *</label>
            <input 
              v-model="newProjectForm.title"
              type="text" 
              class="input"
              placeholder="Örn: Osmanlı Türkçesi Quiz"
              required
            />
          </div>

          <div>
            <label class="label">Açıklama</label>
            <textarea 
              v-model="newProjectForm.description"
              class="input"
              rows="3"
              placeholder="Proje hakkında kısa bir açıklama..."
            ></textarea>
          </div>

          <div>
            <label class="label">Kategori</label>
            <input 
              v-model="newProjectForm.category"
              type="text" 
              class="input"
              placeholder="Örn: Dil Öğrenimi"
            />
          </div>

          <div class="flex gap-3 pt-2">
            <button type="submit" class="btn btn-primary flex-1">
              Oluştur
            </button>
            <button 
              type="button" 
              @click="cancelNewProject"
              class="btn btn-secondary flex-1"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Soru Form Modal -->
    <QuestionForm
      v-if="showQuestionForm && selectedProject"
      :project-id="selectedProject.id"
      :question="editingQuestion"
      @close="closeQuestionForm"
    />

    <!-- JSON Preview Modal -->
    <JsonPreview
      v-if="showJsonPreview && selectedProject"
      :project="selectedProject"
      @close="showJsonPreview = false"
    />
  </div>
</template>

