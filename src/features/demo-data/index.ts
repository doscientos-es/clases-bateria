export {
  DemoDataProvider,
  demoDataQueryKey,
  useDemoCommand,
  useDemoRepositories,
  useDemoSnapshot,
  useStudentLibrary,
} from './application/demo-data-context'
export type {
  ClassRepository,
  CreateClassInput,
  CreateDocumentInput,
  CreateStudentInput,
  CreateTeacherInput,
  DemoRepositories,
  DocumentFilters,
  DocumentRepository,
  ShareResult,
  StudentFilters,
  StudentRepository,
  TeacherRepository,
  UpdateClassInput,
  UpdateDocumentInput,
  UpdateStudentInput,
  UpdateTeacherInput,
} from './application/repositories'
export {
  buildStudentLibrary,
  classIdsForStudent,
  directShareDocumentIds,
  documentVisibility,
  visibleDocumentIds,
} from './domain/access'
export type {
  ClassDetail,
  ClassPathEntry,
  ClassPathItem,
  DemoData,
  DocumentAccessSource,
  DocumentItem,
  DocumentStatus,
  EntityStatus,
  ProgressEntry,
  School,
  SchoolClass,
  Student,
  Teacher,
  VisibleDocument,
} from './domain/entities'
export { DemoError, describeError } from './domain/errors'
export type { DemoErrorCode } from './domain/errors'
export {
  classPathEntries,
  classPathItems,
  movedDocumentOrder,
  nextPathPosition,
} from './domain/itinerary'
