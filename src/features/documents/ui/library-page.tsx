import {
  Badge,
  Button,
  Checkbox,
  Input,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
  PageStack,
  Select,
  SelectContent,
  SelectItem,
  SelectList,
  SelectTrigger,
  SelectValue,
  SelectionToolbar,
} from '@doscientos/ui'
import { FileText, Share2 } from 'lucide-react'
import { useState } from 'react'

import {
  useDemoSnapshot,
  studentIdsWithDocument,
  type DocumentItem,
  type DocumentStatus,
  type ShareResult,
} from '@/features/demo-data'
import { EmptyBlock, ErrorBlock, LoadingBlock } from '@/shared/ui/data-state'
import { PersonAvatarGroup } from '@/shared/ui/person-avatar'

import { useArchiveDocument, useDocuments } from '../application/document-hooks'
import { describeVisibility, documentCategories, documentLevels } from '../domain/visibility'
import { DocumentFormDialog } from './document-form-dialog'
import { ShareDocumentsDialog } from './share-documents-dialog'

const statusFilters = [
  { id: 'all', label: 'Todos los estados' },
  { id: 'draft', label: 'Borrador' },
  { id: 'published', label: 'Publicado' },
  { id: 'archived', label: 'Archivado' },
] as const

const statusLabels: Record<DocumentStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
  archived: 'Archivado',
}

export function LibraryPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [editing, setEditing] = useState<DocumentItem | null>(null)
  const [isFormOpen, setFormOpen] = useState(false)
  const [isShareOpen, setShareOpen] = useState(false)
  const [shareSummary, setShareSummary] = useState<ShareResult | null>(null)

  const snapshot = useDemoSnapshot()
  const documents = useDocuments({
    search,
    category: category === 'all' ? undefined : category,
    level: level === 'all' ? undefined : level,
    status: status === 'all' ? undefined : (status as DocumentStatus),
  })
  const archive = useArchiveDocument()
  const categories = snapshot.data ? documentCategories(snapshot.data) : []
  const levels = snapshot.data ? documentLevels(snapshot.data) : []
  const accessStudentIdsByDocument =
    snapshot.data && documents.data
      ? new Map(
          documents.data.map((document) => [
            document.id,
            new Set(studentIdsWithDocument(snapshot.data, document.id)),
          ]),
        )
      : null
  const filtersAreActive = Boolean(
    search.trim() || category !== 'all' || level !== 'all' || status !== 'all',
  )

  function toggle(documentId: string, isSelected: boolean) {
    setSelected((current) =>
      isSelected ? [...current, documentId] : current.filter((item) => item !== documentId),
    )
  }

  function openForm(document: DocumentItem | null) {
    setEditing(document)
    setFormOpen(true)
  }

  function clearFilters() {
    setSearch('')
    setCategory('all')
    setLevel('all')
    setStatus('all')
  }

  return (
    <PageStack>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Biblioteca</PageHeaderTitle>
          <PageHeaderDescription>
            Todo documento nace privado. Comparte con una clase desde su itinerario o con alumnos
            concretos desde aquí.
          </PageHeaderDescription>
        </PageHeaderHeading>
        <PageHeaderActions>
          <Button onPress={() => openForm(null)}>Subir documento</Button>
        </PageHeaderActions>
      </PageHeader>

      <div className="page-filter-bar">
        <Input
          aria-label="Buscar documentos"
          placeholder="Buscar por título o descripción"
          value={search}
          className="max-w-xs"
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          aria-label="Filtrar por materia"
          selectedKey={category}
          onSelectionChange={(key) => setCategory(String(key))}
          className="w-52"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectList>
              <SelectItem id="all">Todas las materias</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item} id={item} textValue={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectList>
          </SelectContent>
        </Select>
        <Select
          aria-label="Filtrar por nivel"
          selectedKey={level}
          onSelectionChange={(key) => setLevel(String(key))}
          className="w-48"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectList>
              <SelectItem id="all">Todos los niveles</SelectItem>
              {levels.map((item) => (
                <SelectItem key={item} id={item} textValue={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectList>
          </SelectContent>
        </Select>
        <Select
          aria-label="Filtrar por estado"
          selectedKey={status}
          onSelectionChange={(key) => setStatus(String(key))}
          className="w-48"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectList>
              {statusFilters.map((item) => (
                <SelectItem key={item.id} id={item.id} textValue={item.label}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectList>
          </SelectContent>
        </Select>
        {filtersAreActive ? (
          <Button variant="ghost" onPress={clearFilters}>
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      {documents.data ? (
        <p className="page-filter-summary">
          Mostrando {documents.data.length} documento{documents.data.length === 1 ? '' : 's'}
        </p>
      ) : null}

      {selected.length > 0 ? (
        <SelectionToolbar count={selected.length}>
          <Button size="sm" onPress={() => setShareOpen(true)}>
            Compartir
          </Button>
          <Button size="sm" variant="ghost" onPress={() => setSelected([])}>
            Quitar selección
          </Button>
        </SelectionToolbar>
      ) : null}

      {shareSummary ? (
        <p className="text-muted-foreground text-sm" role="status">
          Se han actualizado {shareSummary.documentCount} documento(s) para{' '}
          {shareSummary.studentCount} alumno(s): {shareSummary.createdShares} acceso(s) nuevo(s).
        </p>
      ) : null}

      {documents.isPending ? <LoadingBlock label="Cargando biblioteca…" /> : null}
      {documents.isError ? <ErrorBlock onRetry={() => void documents.refetch()} /> : null}
      {documents.data?.length === 0 ? (
        <EmptyBlock
          title="Sin documentos que mostrar"
          description="Ajusta la búsqueda o los filtros, o sube un documento nuevo."
          action={<Button onPress={() => openForm(null)}>Subir documento</Button>}
        />
      ) : null}

      {documents.data && documents.data.length > 0 ? (
        <div className="document-visual-grid">
          {documents.data.map((document) => (
            <article className="document-card" key={document.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Checkbox
                    aria-label={`Seleccionar ${document.title}`}
                    isSelected={selected.includes(document.id)}
                    onChange={(isSelected) => toggle(document.id, isSelected)}
                  />
                  <Badge variant={document.status === 'published' ? 'secondary' : 'outline'}>
                    {statusLabels[document.status]}
                  </Badge>
                </div>
                <div className="document-thumb" aria-hidden>
                  <FileText />
                </div>
                <div>
                  <h2 className="font-semibold">{document.title}</h2>
                  <p className="text-muted-foreground mt-1 text-xs">{document.fileName}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{document.category}</Badge>
                  <Badge variant="outline">{document.level || 'Inicial'}</Badge>
                </div>
                <div className="document-access-meta">
                  <p className="text-muted-foreground text-xs">
                    {snapshot.data ? describeVisibility(snapshot.data, document.id) : 'Privado'}
                  </p>
                  {snapshot.data ? (
                    <PersonAvatarGroup
                      size={24}
                      people={snapshot.data.students.filter(
                        (student) =>
                          accessStudentIdsByDocument?.get(document.id)?.has(student.id) ?? false,
                      )}
                    />
                  ) : null}
                </div>
              </div>
              <div className="border-border mt-4 flex items-center justify-between gap-2 border-t pt-3">
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onPress={() => openForm(document)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    onPress={() => {
                      setSelected([document.id])
                      setShareOpen(true)
                    }}
                  >
                    <Share2 aria-hidden /> Compartir
                  </Button>
                  {document.status === 'archived' ? null : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onPress={() => archive.mutate(document.id)}
                      isDisabled={archive.isPending}
                    >
                      Archivar
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <DocumentFormDialog document={editing} isOpen={isFormOpen} onOpenChange={setFormOpen} />
      <ShareDocumentsDialog
        documentIds={selected}
        isOpen={isShareOpen}
        onOpenChange={setShareOpen}
        onShared={(result) => {
          setShareSummary(result)
          setSelected([])
        }}
      />
    </PageStack>
  )
}
