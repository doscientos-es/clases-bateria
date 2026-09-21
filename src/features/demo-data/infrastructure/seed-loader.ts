import seed from '../../../../mock-data.json'
import type {
  ClassPathEntry,
  DemoData,
  DirectShare,
  DocumentItem,
  DocumentStatus,
  EntityStatus,
  PaymentMethod,
  ProgressEntry,
  SchoolClass,
  Student,
  StudentPayment,
  Teacher,
} from '../domain/entities'

function entityStatus(value: string): EntityStatus {
  return value === 'archived' ? 'archived' : 'active'
}

function documentStatus(value: string): DocumentStatus {
  if (value === 'draft') return 'draft'
  if (value === 'archived') return 'archived'
  return 'published'
}

function paymentMethod(value: string): PaymentMethod {
  if (value === 'cash' || value === 'card' || value === 'other') return value
  return 'transfer'
}

/** Deep copy of the seed shipped with the demo. Never mutated in place. */
export function loadSeed(): DemoData {
  const teachers: Teacher[] = seed.teachers.map((teacher) => ({
    id: teacher.id,
    name: teacher.name,
    email: teacher.email,
    specialty: teacher.specialty,
    status: entityStatus(teacher.status),
    joinedOn: '',
  }))

  const students: Student[] = seed.students.map((student) => ({
    id: student.id,
    name: student.name,
    email: student.email,
    phone: '',
    notes: '',
    status: entityStatus(student.status),
    enrolledOn: '',
  }))

  const payments: StudentPayment[] = (seed.payments ?? []).map((payment) => ({
    id: payment.id,
    studentId: payment.studentId,
    amount: payment.amount,
    paidOn: payment.paidOn,
    method: paymentMethod(payment.method),
    note: payment.note ?? '',
  }))

  const classes: SchoolClass[] = seed.classes.map((schoolClass) => ({
    id: schoolClass.id,
    name: schoolClass.name,
    description: '',
    level: '',
    teacherIds: [...schoolClass.teacherIds],
    studentIds: [...schoolClass.studentIds],
    scheduledAt: schoolClass.scheduledAt ?? null,
    status: entityStatus(schoolClass.status),
  }))

  const documents: DocumentItem[] = seed.documents.map((document) => ({
    id: document.id,
    title: document.title,
    description: document.description ?? '',
    category: document.category,
    level: document.level,
    status: documentStatus(document.status),
    fileName: document.fileName,
  }))

  const classDocumentPaths: ClassPathEntry[] = seed.classDocumentPaths.map((entry) => ({
    classId: entry.classId,
    documentId: entry.documentId,
    position: entry.position,
    shared: entry.shared,
  }))

  const directShares: DirectShare[] = seed.directShares.map((share) => ({
    documentId: share.documentId,
    studentId: share.studentId,
  }))

  const progress: ProgressEntry[] = seed.progress.map((entry) => ({
    documentId: entry.documentId,
    studentId: entry.studentId,
    viewed: entry.viewed,
    completed: entry.completed,
  }))

  return {
    school: { id: seed.school.id, name: seed.school.name },
    teachers,
    students,
    payments,
    classes,
    documents,
    classDocumentPaths,
    directShares,
    progress,
  }
}
