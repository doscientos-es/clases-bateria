import type {
  ClassDetail,
  DemoData,
  DocumentItem,
  DocumentStatus,
  EntityStatus,
  SchoolClass,
  Student,
  Teacher,
  VisibleDocument,
} from '../domain/entities'

export type StudentFilters = {
  search?: string | undefined
  classId?: string | undefined
  status?: EntityStatus | undefined
}

export type CreateStudentInput = {
  name: string
  email: string
  phone: string
  notes: string
}

export type UpdateStudentInput = CreateStudentInput

export type CreateTeacherInput = {
  name: string
  email: string
  specialty: string
}

export type UpdateTeacherInput = CreateTeacherInput

export type CreateClassInput = {
  name: string
  description: string
  level: string
  teacherIds: string[]
  studentIds: string[]
  scheduledAt: string | null
}

export type UpdateClassInput = CreateClassInput

export type DocumentFilters = {
  search?: string | undefined
  category?: string | undefined
  level?: string | undefined
  status?: DocumentStatus | undefined
}

export type CreateDocumentInput = {
  title: string
  description: string
  category: string
  level: string
  fileName: string
}

export type UpdateDocumentInput = CreateDocumentInput

export type ShareResult = {
  documentCount: number
  studentCount: number
  createdShares: number
}

/** Loads and resets the whole dataset. The only read the provider performs. */
export interface DemoDataRepository {
  load(): Promise<DemoData>
  reset(): Promise<DemoData>
}

export interface StudentRepository {
  list(filters?: StudentFilters): Promise<Student[]>
  getById(id: string): Promise<Student | null>
  create(input: CreateStudentInput): Promise<Student>
  update(id: string, input: UpdateStudentInput): Promise<Student>
  archive(id: string): Promise<void>
  restore(id: string): Promise<void>
}

export interface TeacherRepository {
  list(): Promise<Teacher[]>
  getById(id: string): Promise<Teacher | null>
  create(input: CreateTeacherInput): Promise<Teacher>
  update(id: string, input: UpdateTeacherInput): Promise<Teacher>
  archive(id: string): Promise<void>
  restore(id: string): Promise<void>
}

export interface ClassRepository {
  list(): Promise<SchoolClass[]>
  getDetail(id: string): Promise<ClassDetail | null>
  create(input: CreateClassInput): Promise<SchoolClass>
  update(id: string, input: UpdateClassInput): Promise<SchoolClass>
  addStudent(classId: string, studentId: string): Promise<void>
  removeStudent(classId: string, studentId: string): Promise<void>
}

export interface DocumentRepository {
  list(filters?: DocumentFilters): Promise<DocumentItem[]>
  create(input: CreateDocumentInput): Promise<DocumentItem>
  update(id: string, input: UpdateDocumentInput): Promise<DocumentItem>
  archive(id: string): Promise<void>
  addToClassPath(classId: string, documentId: string): Promise<void>
  removeFromClassPath(classId: string, documentId: string): Promise<void>
  reorderClassPath(classId: string, orderedDocumentIds: string[]): Promise<void>
  shareWithClass(classId: string, documentId: string, shared: boolean): Promise<void>
  shareWithStudents(documentIds: string[], studentIds: string[]): Promise<ShareResult>
  unshareWithStudent(documentId: string, studentId: string): Promise<void>
  getStudentLibrary(studentId: string): Promise<VisibleDocument[]>
  markDocumentViewed(documentId: string, studentId: string): Promise<void>
  markDocumentCompleted(documentId: string, studentId: string, completed: boolean): Promise<void>
}

/** Single injection point for the whole demo persistence. */
export type DemoRepositories = {
  demoData: DemoDataRepository
  students: StudentRepository
  teachers: TeacherRepository
  classes: ClassRepository
  documents: DocumentRepository
}
