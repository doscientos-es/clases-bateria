import {
  DataViewState,
  DataViewStateDescription,
  DataViewStateTitle,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
  PageStack,
} from '@doscientos/ui'

/** Reserved section of the sidebar. Never contains simulated functionality. */
export function ComingSoonPage({ title, description }: { title: string; description: string }) {
  return (
    <PageStack>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>{title}</PageHeaderTitle>
          <PageHeaderDescription>{description}</PageHeaderDescription>
        </PageHeaderHeading>
      </PageHeader>
      <DataViewState>
        <DataViewStateTitle>Próximamente</DataViewStateTitle>
        <DataViewStateDescription>
          Esta sección no forma parte del alcance de la demo.
        </DataViewStateDescription>
      </DataViewState>
    </PageStack>
  )
}
