import { createFileRoute } from '@tanstack/react-router'

import { StudentDetailPage } from '@/features/students'

function StudentDetailRoute() {
  return <StudentDetailPage studentId={Route.useParams().studentId} />
}

export const Route = createFileRoute('/alumnos/$studentId')({ component: StudentDetailRoute })
