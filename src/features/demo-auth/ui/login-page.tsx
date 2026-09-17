import { Badge, Button, Card, CardContent } from '@doscientos/ui'
import { Link, useNavigate } from '@tanstack/react-router'
import { GraduationCap, UserRound } from 'lucide-react'

import { useDemoSnapshot } from '@/features/demo-data'

import { useDemoSession } from '../application/session-context'
import type { DemoIdentity } from '../domain/identities'

export function LoginPage() {
  const snapshot = useDemoSnapshot()
  const { identities, signIn } = useDemoSession()
  const navigate = useNavigate()

  function enterAs(identity: DemoIdentity) {
    signIn(identity.id)
    void navigate({ to: identity.role === 'student' ? '/alumno' : '/' })
  }

  const teachers = identities.filter((identity) => identity.role === 'teacher')
  const students = identities.filter((identity) => identity.role === 'student')

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-4xl flex-col justify-center gap-8 p-6">
      <header className="space-y-2">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.08em] uppercase">
          {snapshot.data?.school.name ?? 'Aula'}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Inicia sesión</h1>
        <p className="text-muted-foreground text-sm">
          Selecciona tu perfil para acceder al espacio de gestión o al portal del alumno.
        </p>
      </header>

      {snapshot.isPending ? (
        <p className="text-muted-foreground text-sm" role="status">
          Cargando perfiles…
        </p>
      ) : null}
      {snapshot.isError ? (
        <div className="space-y-3" role="alert">
          <p className="text-destructive text-sm">No se han podido cargar los perfiles.</p>
          <Button variant="outline" onPress={() => void snapshot.refetch()}>
            Reintentar
          </Button>
        </div>
      ) : null}

      <IdentityGroup
        title="Profesorado"
        description="Acceso al backoffice: clases, biblioteca e itinerarios."
        identities={teachers}
        onSelect={enterAs}
      />
      <IdentityGroup
        title="Alumnado"
        description="Portal del alumno con sus clases y documentos visibles."
        identities={students}
        onSelect={enterAs}
      />

      <footer className="text-muted-foreground flex flex-wrap gap-4 text-sm">
        <Link to="/registro" className="underline">
          Crear cuenta
        </Link>
        <Link to="/recuperar-contrasena" className="underline">
          He olvidado mi contraseña
        </Link>
      </footer>
    </main>
  )
}

function IdentityGroup({
  title,
  description,
  identities,
  onSelect,
}: {
  title: string
  description: string
  identities: DemoIdentity[]
  onSelect: (identity: DemoIdentity) => void
}) {
  if (identities.length === 0) return null
  return (
    <section className="space-y-3" aria-label={title}>
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <div className="card-grid">
        {identities.map((identity) => (
          <Card key={identity.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{identity.name}</p>
                  <p className="text-muted-foreground truncate text-xs">{identity.email}</p>
                </div>
                <Badge variant={identity.role === 'teacher' ? 'secondary' : 'outline'}>
                  {identity.role === 'teacher' ? (
                    <GraduationCap aria-hidden className="size-3.5" />
                  ) : (
                    <UserRound aria-hidden className="size-3.5" />
                  )}
                  {identity.role === 'teacher' ? 'Profesor' : 'Alumno'}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">{identity.detail}</p>
              <Button className="w-full" onPress={() => onSelect(identity)}>
                Entrar como {identity.name.split(' ')[0]}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
