import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import './tailwind.css'
import { unstable_defineLoader as defineLoader } from '@remix-run/node'
import { parseTheme } from './lib/theme.server'
import { ThemeScript, useTheme } from './components/theme.component'

export const loader = defineLoader(async ({ request }) => {
  const theme = await parseTheme(request)
  return theme
})

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme()

  return (
    <html
      lang="en"
      className={`${theme === 'dark' ? 'dark' : ''}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeScript />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
