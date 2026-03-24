/**
 * Resume composable - client-side resume builder state
 * Persists to localStorage (no backend service for resume yet)
 */
export interface ResumeSection {
  id: string
  type: 'summary' | 'experience' | 'education' | 'skills' | 'projects'
  title: string
  content: string
  items?: ResumeItem[]
}

export interface ResumeItem {
  id: string
  title: string
  subtitle?: string
  description?: string
  dates?: string
  bullets?: string[]
}

export interface Resume {
  id: string
  name: string
  email: string
  phone?: string
  linkedin?: string
  github?: string
  template: 'minimal' | 'professional' | 'modern'
  sections: ResumeSection[]
  updatedAt: string
}

const STORAGE_KEY = 'autoforge-resumes'

const defaultSections: ResumeSection[] = [
  { id: 's1', type: 'summary', title: 'Summary', content: '' },
  { id: 's2', type: 'experience', title: 'Experience', content: '', items: [] },
  { id: 's3', type: 'education', title: 'Education', content: '', items: [] },
  { id: 's4', type: 'skills', title: 'Skills', content: '' },
  { id: 's5', type: 'projects', title: 'Projects', content: '', items: [] },
]

export function useResume() {
  const resumes = ref<Resume[]>([])

  function loadFromStorage() {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Resume[]
        resumes.value = parsed
        return parsed
      }
    } catch {}
    resumes.value = []
    return []
  }

  function saveToStorage() {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes.value))
    } catch {}
  }

  function createResume(name = 'Untitled Resume'): Resume {
    const id = `res_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    const resume: Resume = {
      id,
      name,
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      template: 'professional',
      sections: defaultSections.map((s) => ({ ...s, id: `${s.id}_${id.slice(-6)}` })),
      updatedAt: new Date().toISOString(),
    }
    resumes.value = [resume, ...resumes.value]
    saveToStorage()
    return resume
  }

  function getResume(id: string): Resume | undefined {
    return resumes.value.find((r) => r.id === id)
  }

  function updateResume(id: string, updates: Partial<Resume>) {
    const idx = resumes.value.findIndex((r) => r.id === id)
    if (idx >= 0) {
      resumes.value[idx] = { ...resumes.value[idx], ...updates, updatedAt: new Date().toISOString() }
      saveToStorage()
    }
  }

  function deleteResume(id: string) {
    resumes.value = resumes.value.filter((r) => r.id !== id)
    saveToStorage()
  }

  function addSectionItem(resumeId: string, sectionId: string, item: Omit<ResumeItem, 'id'>) {
    const resume = getResume(resumeId)
    if (!resume) return
    const section = resume.sections.find((s) => s.id === sectionId)
    if (!section) return
    const newItem: ResumeItem = { ...item, id: `item_${Date.now()}` }
    section.items = [...(section.items || []), newItem]
    updateResume(resumeId, { sections: resume.sections })
  }

  function updateSectionItem(resumeId: string, sectionId: string, itemId: string, updates: Partial<ResumeItem>) {
    const resume = getResume(resumeId)
    if (!resume) return
    const section = resume.sections.find((s) => s.id === sectionId)
    if (!section?.items) return
    const idx = section.items.findIndex((i) => i.id === itemId)
    if (idx >= 0) {
      section.items[idx] = { ...section.items[idx], ...updates }
      updateResume(resumeId, { sections: resume.sections })
    }
  }

  function removeSectionItem(resumeId: string, sectionId: string, itemId: string) {
    const resume = getResume(resumeId)
    if (!resume) return
    const section = resume.sections.find((s) => s.id === sectionId)
    if (!section?.items) return
    section.items = section.items.filter((i) => i.id !== itemId)
    updateResume(resumeId, { sections: resume.sections })
  }

  onMounted(loadFromStorage)

  return {
    resumes,
    loadFromStorage,
    createResume,
    getResume,
    updateResume,
    deleteResume,
    addSectionItem,
    updateSectionItem,
    removeSectionItem,
  }
}
