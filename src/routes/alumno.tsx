import { createFileRoute } from '@tanstack/react-router'

import { StudentPortalPage } from '@/features/student-portal'

export const Route = createFileRoute('/alumno')({ component: StudentPortalPage })
