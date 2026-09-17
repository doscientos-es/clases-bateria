import { describe, expect, it } from 'vitest'

import { loadSeed } from '../infrastructure/seed-loader'
import { buildStudentLibrary, studentIdsWithDocument, visibleDocumentIds } from './access'

describe('student document visibility', () => {
  it('unites class grants and direct grants without exposing private documents', () => {
    const data = loadSeed()

    expect(visibleDocumentIds(data, 'student-lucia')).toEqual([
      'doc-coordinacion',
      'doc-ritmo-subdivision',
      'doc-lectura-basica',
    ])
    expect(visibleDocumentIds(data, 'student-nora')).not.toContain('doc-coordinacion')
  })

  it('deduplicates a document received through both access sources', () => {
    const data = loadSeed()
    data.classDocumentPaths = data.classDocumentPaths.map((entry) =>
      entry.documentId === 'doc-coordinacion' ? { ...entry, shared: true } : entry,
    )

    const library = buildStudentLibrary(data, 'student-lucia')
    const coordination = library.find((item) => item.document.id === 'doc-coordinacion')

    expect(library.filter((item) => item.document.id === 'doc-coordinacion')).toHaveLength(1)
    expect(coordination?.source).toBe('both')
  })

  it('returns progress independently from access origin', () => {
    const library = buildStudentLibrary(loadSeed(), 'student-lucia')
    const completed = library.find((item) => item.document.id === 'doc-ritmo-subdivision')
    const pending = library.find((item) => item.document.id === 'doc-coordinacion')

    expect(completed).toMatchObject({ viewed: true, completed: true })
    expect(pending).toMatchObject({ viewed: false, completed: false })
  })

  it('combines direct and class recipients for a document', () => {
    const data = loadSeed()

    expect(studentIdsWithDocument(data, 'doc-ritmo-subdivision')).toEqual([
      'student-lucia',
      'student-marcos',
      'student-nora',
    ])
  })
})
