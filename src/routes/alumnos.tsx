import { createFileRoute } from '@tanstack/react-router'

import { StudentsPage } from '@/features/students'

export const Route = createFileRoute('/alumnos')({ component: StudentsPage })
