<script setup>
import { computed } from 'vue'
import { projectStore } from '../stores/projectStore'

const projects = computed(() => projectStore.projects)
const selectedProjectId = computed(() => projectStore.selectedProjectId)

function selectProject(projectId) {
  projectStore.selectedProjectId = projectId
}

function deleteProject(projectId, event) {
  event.stopPropagation() // Projeyi seçmemesi için
  
  const project = projectStore.getProject(projectId)
  if (!project) return
  
  if (confirm(`"${project.meta.title}" projesini silmek istediğinizden emin misiniz?`)) {
    projectStore.deleteProject(projectId)
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function openMetaEditor() {
  projectStore.openProjectMetaEditor()
}
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col min-h-0 max-h-[calc(100vh-12rem)]"
  >
    <div class="p-4 border-b border-gray-200 shrink-0">
      <h2 class="text-lg font-semibold text-gray-900">Projelerim</h2>
      <p class="text-sm text-gray-600 mt-1">{{ projects.length }} proje</p>
    </div>

    <!-- Proje Listesi -->
    <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
      <div v-if="projects.length === 0" class="p-8 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500 text-sm">Henüz proje yok</p>
        <p class="text-gray-400 text-xs mt-1">Başlamak için yeni proje oluşturun</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="project in projects"
          :key="project.id"
          @click="selectProject(project.id)"
          class="cursor-pointer transition-colors hover:bg-gray-50"
          :class="{
            'bg-blue-50 border-l-4 border-l-blue-600 py-5 px-4': selectedProjectId === project.id,
            'border-l-4 border-l-transparent p-4': selectedProjectId !== project.id,
          }"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <h3
                class="text-gray-900"
                :class="selectedProjectId === project.id ? 'text-lg font-semibold break-words' : 'font-medium truncate'"
              >
                {{ project.meta.title }}
              </h3>
              <p
                class="text-gray-600 mt-1"
                :class="
                  selectedProjectId === project.id
                    ? 'text-sm whitespace-pre-wrap break-words'
                    : 'text-sm line-clamp-2'
                "
              >
                {{ project.meta.description || 'Açıklama yok' }}
              </p>
              <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ project.meta.totalQuestions }} soru
                </span>
                <span>{{ formatDate(project.meta.updatedAt) }}</span>
              </div>
            </div>

            <div class="flex items-start gap-0.5 shrink-0">
              <button
                v-if="selectedProjectId === project.id"
                type="button"
                @click.stop="openMetaEditor"
                class="text-gray-600 hover:text-gray-900 hover:bg-blue-100 rounded-lg transition-colors p-1"
                title="Proje bilgilerini düzenle"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="deleteProject(project.id, $event)"
                class="text-gray-400 hover:text-red-600 transition-colors p-1"
                title="Projeyi Sil"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="project.meta.category" class="mt-2">
            <span
              class="inline-block px-2 py-1 text-xs rounded-full"
              :class="
                selectedProjectId === project.id
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700'
              "
            >
              {{ project.meta.category }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

