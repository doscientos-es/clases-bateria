import { createFileRoute } from '@tanstack/react-router'

import { TeacherDetailPage } from '@/features/teachers'

function TeacherDetailRoute() {
  return <TeacherDetailPage teacherId={Route.useParams().teacherId} />
}

export const Route = createFileRoute('/profesores/$teacherId')({ component: TeacherDetailRoute })
