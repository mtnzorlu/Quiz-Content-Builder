<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { projectStore } from '../stores/projectStore'

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
  question: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

const form = ref({
  question: '',
  answer: '',
  category: '',
  difficulty: 'medium',
  explanation: '',
})

const errors = ref({})
const isEditing = ref(false)
const questionInput = ref(null)

// Modal açıldığında soru input'una odaklan
onMounted(() => {
  nextTick(() => {
    if (questionInput.value) {
      questionInput.value.focus()
    }
  })
})

// Düzenleme modundaysa formu doldur
watch(() => props.question, (question) => {
  if (question) {
    isEditing.value = true
    form.value = {
      question: question.question,
      answer: question.answer,
      category: question.category || '',
      difficulty: question.difficulty || 'medium',
      explanation: question.explanation || '',
    }
  } else {
    isEditing.value = false
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.value = {
    question: '',
    answer: '',
    category: '',
    difficulty: 'medium',
    explanation: '',
  }
  errors.value = {}
}

function validateForm() {
  errors.value = {}
  
  if (!form.value.question.trim()) {
    errors.value.question = 'Soru metni gereklidir'
  }
  
  if (!form.value.answer.trim()) {
    errors.value.answer = 'Cevap metni gereklidir'
  }
  
  return Object.keys(errors.value).length === 0
}

function saveQuestion() {
  if (!validateForm()) {
    return
  }
  
  const questionData = {
    question: form.value.question.trim(),
    answer: form.value.answer.trim(),
    category: form.value.category.trim(),
    difficulty: form.value.difficulty,
    explanation: form.value.explanation.trim(),
  }
  
  if (isEditing.value && props.question) {
    projectStore.updateQuestion(props.projectId, props.question.id, questionData)
  } else {
    projectStore.addQuestion(props.projectId, questionData)
  }
  
  emit('close')
}

function cancel() {
  emit('close')
}
</script>

<template>
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    @click.self="cancel"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 animate-fadeIn">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">
          {{ isEditing ? 'Soruyu Düzenle' : 'Yeni Soru Ekle' }}
        </h2>
      </div>

      <form @submit.prevent="saveQuestion" class="p-6 space-y-4">
        <!-- 1. Soru -->
        <div>
          <label class="label">
            Soru *
          </label>
          <textarea 
            ref="questionInput"
            v-model="form.question"
            class="input"
            :class="{ 'border-red-500': errors.question }"
            rows="3"
            placeholder="Soru metnini yazın..."
            required
          ></textarea>
          <p v-if="errors.question" class="text-red-600 text-sm mt-1">{{ errors.question }}</p>
        </div>

        <!-- 2. Cevap -->
        <div>
          <label class="label">
            Cevap *
          </label>
          <textarea 
            v-model="form.answer"
            class="input"
            :class="{ 'border-red-500': errors.answer }"
            rows="3"
            placeholder="Cevap metnini yazın..."
            required
          ></textarea>
          <p v-if="errors.answer" class="text-red-600 text-sm mt-1">{{ errors.answer }}</p>
        </div>

        <!-- 3. Açıklama -->
        <div>
          <label class="label">
            Açıklama
            <span class="text-gray-500 font-normal">(opsiyonel)</span>
          </label>
          <textarea 
            v-model="form.explanation"
            class="input"
            rows="2"
            placeholder="Soruyla ilgili ek açıklama veya ipucu..."
          ></textarea>
        </div>

        <!-- Kategori ve Zorluk (Yan Yana) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="label">Kategori</label>
            <input 
              v-model="form.category"
              type="text" 
              class="input"
              placeholder="Örn: Harfler, Kelimeler"
            />
          </div>

          <div>
            <label class="label">Zorluk Seviyesi</label>
            <select v-model="form.difficulty" class="input">
              <option value="easy">Kolay</option>
              <option value="medium">Orta</option>
              <option value="hard">Zor</option>
            </select>
          </div>
        </div>

        <!-- Butonlar -->
        <div class="flex gap-3 pt-4 border-t border-gray-200">
          <button 
            type="submit" 
            class="btn btn-primary flex-1"
          >
            {{ isEditing ? 'Güncelle' : 'Ekle' }}
          </button>
          <button 
            type="button" 
            @click="cancel"
            class="btn btn-secondary flex-1"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

