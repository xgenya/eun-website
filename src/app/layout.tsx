import { Footer, LastUpdated, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'EUN Server',
  icons: [],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navbar = (
    <Navbar
      logo={<span style={{ fontWeight: 700, fontSize: '1.2rem' }}>EUN</span>}
    />
  )

  const footer = <Footer>MIT {new Date().getFullYear()} © EUN Website.</Footer>

  return (
    <html lang="zh" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/xgenya/eun-website/blob/main"
          pageMap={await getPageMap()}
          lastUpdated={<LastUpdated />}
          nextThemes={{ defaultTheme: 'dark', forcedTheme: 'dark' }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
