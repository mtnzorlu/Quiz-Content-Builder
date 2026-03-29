import { reactive } from 'vue'
import { useLocalStorage } from '../composables/useLocalStorage'

// LocalStorage'dan projeleri al
const projectsRef = useLocalStorage('quiz-projects', [])

// Global state
const state = reactive({
  selectedProjectId: null,
  /** Proje listesindeki “düzenle” ile sağ panelde meta formu açılır */
  showProjectMetaEditor: false,
})

// Store
export const projectStore = {
  // State
  get projects() {
    return projectsRef.value
  },
  
  get selectedProject() {
    return projectsRef.value.find(p => p.id === state.selectedProjectId)
  },

  get selectedProjectId() {
    return state.selectedProjectId
  },

  set selectedProjectId(id) {
    if (state.selectedProjectId !== id) {
      state.showProjectMetaEditor = false
    }
    state.selectedProjectId = id
  },

  get showProjectMetaEditor() {
    return state.showProjectMetaEditor
  },

  openProjectMetaEditor() {
    state.showProjectMetaEditor = true
  },

  closeProjectMetaEditor() {
    state.showProjectMetaEditor = false
  },

  // Actions - Proje Yönetimi
  createProject(meta) {
    const newProject = {
      id: crypto.randomUUID(),
      meta: {
        title: meta.title || 'Yeni Proje',
        description: meta.description || '',
        category: meta.category || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalQuestions: 0,
      },
      questions: [],
    }
    
    projectsRef.value.push(newProject)
    state.selectedProjectId = newProject.id
    state.showProjectMetaEditor = false
    return newProject
  },

  updateProjectMeta(projectId, meta) {
    const project = projectsRef.value.find(p => p.id === projectId)
    if (project) {
      project.meta = {
        ...project.meta,
        ...meta,
        updatedAt: new Date().toISOString(),
      }
    }
  },

  deleteProject(projectId) {
    const index = projectsRef.value.findIndex(p => p.id === projectId)
    if (index !== -1) {
      projectsRef.value.splice(index, 1)
      if (state.selectedProjectId === projectId) {
        state.selectedProjectId = null
        state.showProjectMetaEditor = false
      }
    }
  },

  // Actions - Soru Yönetimi
  addQuestion(projectId, questionData) {
    const project = projectsRef.value.find(p => p.id === projectId)
    if (project) {
      const newQuestion = {
        id: project.questions.length > 0 
          ? Math.max(...project.questions.map(q => q.id)) + 1 
          : 1,
        question: questionData.question,
        answer: questionData.answer,
        category: questionData.category || '',
        difficulty: questionData.difficulty || 'medium',
        explanation: questionData.explanation || '',
      }
      
      project.questions.push(newQuestion)
      project.meta.totalQuestions = project.questions.length
      project.meta.updatedAt = new Date().toISOString()
      return newQuestion
    }
    return null
  },

  updateQuestion(projectId, questionId, questionData) {
    const project = projectsRef.value.find(p => p.id === projectId)
    if (project) {
      const questionIndex = project.questions.findIndex(q => q.id === questionId)
      if (questionIndex !== -1) {
        project.questions[questionIndex] = {
          ...project.questions[questionIndex],
          ...questionData,
        }
        project.meta.updatedAt = new Date().toISOString()
      }
    }
  },

  deleteQuestion(projectId, questionId) {
    const project = projectsRef.value.find(p => p.id === projectId)
    if (project) {
      const index = project.questions.findIndex(q => q.id === questionId)
      if (index !== -1) {
        project.questions.splice(index, 1)
        project.meta.totalQuestions = project.questions.length
        project.meta.updatedAt = new Date().toISOString()
      }
    }
  },

  // Utility
  getProject(projectId) {
    return projectsRef.value.find(p => p.id === projectId)
  },

  // Export için JSON hazırla
  exportProject(projectId) {
    const project = this.getProject(projectId)
    if (!project) return null

    // Zorunlu olmayan alanları boşsa JSON'a yazma (yeni "bölüm" eklemeyi engeller)
    const meta = {
      title: project.meta.title,
      createdAt: project.meta.createdAt,
      updatedAt: project.meta.updatedAt,
      totalQuestions: project.meta.totalQuestions,
    }

    if (project.meta.description) meta.description = project.meta.description
    if (project.meta.category) meta.category = project.meta.category

    const questions = project.questions.map(q => {
      const out = {
        id: q.id,
        question: q.question,
        answer: q.answer,
        difficulty: q.difficulty || 'medium',
      }

      if (q.category) out.category = q.category
      if (q.explanation) out.explanation = q.explanation

      return out
    })

    return { meta, questions }
  },

  // JSON'dan proje içe aktar
  importProject(jsonData) {
    const importedProject = {
      id: crypto.randomUUID(),
      meta: {
        ...jsonData.meta,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalQuestions: jsonData.questions?.length || 0,
      },
      questions: (jsonData.questions || []).map(q => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        category: q.category || '',
        difficulty: q.difficulty || 'medium',
        explanation: q.explanation || '',
      })),
    }
    
    projectsRef.value.push(importedProject)
    state.selectedProjectId = importedProject.id
    state.showProjectMetaEditor = false
    return importedProject
  },
}

