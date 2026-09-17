import { createFileRoute } from '@tanstack/react-router'

import { TeachersPage } from '@/features/teachers'

export const Route = createFileRoute('/profesores')({ component: TeachersPage })
