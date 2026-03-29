<script setup>
import { computed, ref, watch } from 'vue'
import { projectStore } from '../stores/projectStore'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit'])

const questions = computed(() => props.project?.questions || [])
/** Yalnızca bir sorunun cevabı açık kalır (accordion) */
const expandedQuestionId = ref(null)

watch(
  () => props.project?.id,
  () => {
    expandedQuestionId.value = null
  },
)

function toggleAnswer(questionId) {
  expandedQuestionId.value =
    expandedQuestionId.value === questionId ? null : questionId
}

function isAnswerVisible(questionId) {
  return expandedQuestionId.value === questionId
}

function deleteQuestion(questionId) {
  const question = questions.value.find(q => q.id === questionId)
  if (!question) return
  
  if (confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
    projectStore.deleteQuestion(props.project.id, questionId)
  }
}

function getDifficultyColor(difficulty) {
  const colors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  }
  return colors[difficulty] || colors.medium
}

function getDifficultyLabel(difficulty) {
  const labels = {
    easy: 'Kolay',
    medium: 'Orta',
    hard: 'Zor',
  }
  return labels[difficulty] || 'Orta'
}
</script>

<template>
  <!-- Soru Yoksa -->
  <div v-if="questions.length === 0" class="text-center py-12">
    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p class="text-gray-500">Henüz soru eklenmemiş</p>
    <p class="text-gray-400 text-sm mt-1">Başlamak için "Yeni Soru" butonuna tıklayın</p>
  </div>

  <!-- Soru Kartları -->
  <div v-else class="space-y-3">
    <div
      v-for="question in questions"
      :key="question.id"
      class="bg-gray-50 rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200"
      :class="
        isAnswerVisible(question.id)
          ? 'border-2 border-gray-200'
          : 'border border-gray-100'
      "
    >
      <div class="flex items-start justify-between gap-3">
        <button
          class="flex-1 text-left"
          @click="toggleAnswer(question.id)"
        >
          <div class="flex items-start gap-2">
            <span class="mt-0.5 text-xs font-semibold text-gray-500">#{{ question.id }}</span>
            <p class="text-gray-500 font-semibold leading-snug">
              {{ question.question }}
            </p>
          </div>

          <div 
            v-if="isAnswerVisible(question.id)"
            class="mt-3 border-t border-gray-200 pt-3 space-y-2 animate-fadeIn"
          >
            <div class="p-3 bg-green-50 border border-green-100 rounded-lg">
              <div class="text-md text-gray-800">
                <p class="font-semibold text-gray-600 border-b border-gray-200 pb-2 mb-2 ">Cevap:</p>
                <span class="text-gray-800">{{ question.answer }}</span>
              </div>
            </div>
            <div v-if="question.explanation" class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p class="text-md text-gray-700">
                <span class="font-semibold text-gray-600">Açıklama: </span>{{ question.explanation }}
              </p>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-600 pt-2">
              <span class="px-2 py-1 rounded-full" :class="getDifficultyColor(question.difficulty)">
                {{ getDifficultyLabel(question.difficulty) }}
              </span>
              <span v-if="question.category" class="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {{ question.category }}
              </span>
            </div>
        </div>
        </button>

        <!-- Aksiyonlar -->
        <div class="flex gap-1">
          <button
            @click.stop="emit('edit', question)"
            class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Düzenle"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click.stop="deleteQuestion(question.id)"
            class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sil"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
