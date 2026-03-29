<script setup>
import { ref, computed, watch } from 'vue'
import { projectStore } from '../stores/projectStore'
import QuestionList from './QuestionList.vue'

const emit = defineEmits(['edit'])

const selectedProject = computed(() => projectStore.selectedProject)
const editingMeta = ref(false)
const metaForm = ref({
  title: '',
  description: '',
  category: '',
})

watch(selectedProject, (project) => {
  editingMeta.value = false
  if (project) {
    metaForm.value = {
      title: project.meta.title,
      description: project.meta.description,
      category: project.meta.category,
    }
  }
}, { immediate: true })

watch(
  () => projectStore.showProjectMetaEditor,
  (show) => {
    if (show && selectedProject.value) {
      editingMeta.value = true
      metaForm.value = {
        title: selectedProject.value.meta.title,
        description: selectedProject.value.meta.description,
        category: selectedProject.value.meta.category,
      }
    }
  },
)

function openEditQuestion(question) {
  emit('edit', question)
}

function saveProjectMeta() {
  if (selectedProject.value && metaForm.value.title.trim()) {
    projectStore.updateProjectMeta(selectedProject.value.id, metaForm.value)
    editingMeta.value = false
    projectStore.closeProjectMetaEditor()
  }
}

function cancelEditMeta() {
  if (selectedProject.value) {
    metaForm.value = {
      title: selectedProject.value.meta.title,
      description: selectedProject.value.meta.description,
      category: selectedProject.value.meta.category,
    }
  }
  editingMeta.value = false
  projectStore.closeProjectMetaEditor()
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
    <!-- Proje Seçilmemişse -->
    <div v-if="!selectedProject" class="h-full flex items-center justify-center p-8">
      <div class="text-center">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Proje Seçin</h3>
        <p class="text-gray-500">Düzenlemek için sol panelden bir proje seçin</p>
        <p class="text-gray-400 text-sm mt-2">veya yeni bir proje oluşturun</p>
      </div>
    </div>

    <!-- Proje Seçiliyse -->
    <div v-else class="flex flex-col h-full min-h-0">
      <!-- Meta düzenleme (sol listedeki kalem ile açılır) -->
      <div v-if="editingMeta" class="p-6 border-b border-gray-200 shrink-0 space-y-4">
        <div>
          <label class="label">Proje Başlığı *</label>
          <input v-model="metaForm.title" type="text" class="input" required />
        </div>
        <div>
          <label class="label">Açıklama</label>
          <textarea v-model="metaForm.description" class="input" rows="2"></textarea>
        </div>
        <div>
          <label class="label">Kategori</label>
          <input v-model="metaForm.category" type="text" class="input" />
        </div>
        <div class="flex gap-2">
          <button type="button" @click="saveProjectMeta" class="btn btn-primary">Kaydet</button>
          <button type="button" @click="cancelEditMeta" class="btn btn-secondary">İptal</button>
        </div>
      </div>

      <!-- Sorular Bölümü - İçerik Alanı -->
      <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
        <!-- Soru Listesi -->
        <div class="flex-1 min-h-0 overflow-y-auto p-6 custom-scrollbar">
          <QuestionList 
            :project="selectedProject"
            @edit="openEditQuestion"
          />
        </div>
      </div>
    </div>

  </div>
</template>

