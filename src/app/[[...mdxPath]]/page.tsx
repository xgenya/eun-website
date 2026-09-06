import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../mdx-components'
import { notFound } from 'next/navigation'

export const revalidate = 0
export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: {
  params: Promise<{ mdxPath: string[] }>
}) {
  const params = await props.params
  try {
    const { metadata } = await importPage(params.mdxPath)
    return metadata
  } catch (e: any) {
    if (e?.code === 'MODULE_NOT_FOUND') return {}
    throw e
  }
}

const Wrapper = useMDXComponents().wrapper

export default async function Page(props: {
  params: Promise<{ mdxPath: string[] }>
}) {
  const params = await props.params
  let result
  try {
    result = await importPage(params.mdxPath)
  } catch (e: any) {
    if (e?.code === 'MODULE_NOT_FOUND') notFound()
    throw e
  }
  const { default: MDXContent, toc, metadata, sourceCode } = result
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
