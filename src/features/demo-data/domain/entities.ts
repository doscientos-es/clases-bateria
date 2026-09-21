/** Logical status shared by people and groups. Removals are always logical. */
export type EntityStatus = 'active' | 'archived'

/** Publication status of a library document. */
export type DocumentStatus = 'draft' | 'published' | 'archived'

export type School = {
  id: string
  name: string
}

export type Teacher = {
  id: string
  name: string
  email: string
  specialty: string
  status: EntityStatus
  joinedOn: string
}

export type Student = {
  id: string
  name: string
  email: string
  phone: string
  notes: string
  status: EntityStatus
  enrolledOn: string
}

export type SchoolClass = {
  id: string
  name: string
  description: string
  level: string
  teacherIds: string[]
  studentIds: string[]
  /** Local date/time in datetime-local format, or null when not scheduled yet. */
  scheduledAt: string | null
  status: EntityStatus
}

export type DocumentItem = {
  id: string
  title: string
  description: string
  category: string
  level: string
  status: DocumentStatus
  fileName: string
}

/** A document placed in the itinerary of a class, with its share check. */
export type ClassPathEntry = {
  classId: string
  documentId: string
  position: number
  shared: boolean
}

export type DirectShare = {
  documentId: string
  studentId: string
}

export type ProgressEntry = {
  documentId: string
  studentId: string
  viewed: boolean
  completed: boolean
}

/** Full demo dataset. The only shape the persistence layer stores. */
export type DemoData = {
  school: School
  teachers: Teacher[]
  students: Student[]
  classes: SchoolClass[]
  documents: DocumentItem[]
  classDocumentPaths: ClassPathEntry[]
  directShares: DirectShare[]
  progress: ProgressEntry[]
}

/** Why a document is visible for a student. */
export type DocumentAccessSource = 'direct' | 'class' | 'both'

export type VisibleDocument = {
  document: DocumentItem
  source: DocumentAccessSource
  classIds: string[]
  position: number | null
  viewed: boolean
  completed: boolean
}

export type ClassDetail = {
  schoolClass: SchoolClass
  teachers: Teacher[]
  students: Student[]
  path: ClassPathItem[]
}

export type ClassPathItem = {
  document: DocumentItem
  position: number
  shared: boolean
}
