import { createFileRoute } from '@tanstack/react-router'

import { ClassesPage } from '@/features/classes'

export const Route = createFileRoute('/clases/')({ component: ClassesPage })