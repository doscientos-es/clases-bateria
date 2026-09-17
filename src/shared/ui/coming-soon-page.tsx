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

/** Empty state for sections without content yet. */
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
        <DataViewStateTitle>Sin contenido</DataViewStateTitle>
        <DataViewStateDescription>{description}</DataViewStateDescription>
      </DataViewState>
    </PageStack>
  )
}
