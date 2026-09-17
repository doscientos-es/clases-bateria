import { createFileRoute } from '@tanstack/react-router'

import { LibraryPage } from '@/features/documents'

export const Route = createFileRoute('/biblioteca')({ component: LibraryPage })
