import type { DemoData } from '@/features/demo-data'

/** Three indicators of the core, nothing else. */
export type DashboardSummary = {
  activeStudents: number
  activeClasses: number
  libraryDocuments: number
}

export function dashboardSummary(data: DemoData): DashboardSummary {
  return {
    activeStudents: data.students.filter((student) => student.status === 'active').length,
    activeClasses: data.classes.filter((schoolClass) => schoolClass.status === 'active').length,
    libraryDocuments: data.documents.filter((document) => document.status !== 'archived').length,
  }
}
