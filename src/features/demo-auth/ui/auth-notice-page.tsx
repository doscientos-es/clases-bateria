import { Link } from '@tanstack/react-router'

/** Informative screen for account actions managed by the school. */
export function AuthNoticePage({ title, description }: { title: string; description: string }) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
      <Link to="/login" className="text-sm underline">
        Volver a iniciar sesión
      </Link>
    </main>
  )
}
