/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Form,
  useLocation,
  useNavigation,
  useRouteLoaderData,
} from '@remix-run/react'
import { useLayoutEffect, useMemo } from 'react'
import type { loader as rootLoader } from '~/root'

export function useTheme() {
  const theme = useRouteLoaderData<typeof rootLoader>('root')
  const navigation = useNavigation()
  const savedTheme = navigation.formData?.has('theme')
    ? navigation.formData.get('theme')
    : null
  return savedTheme || theme
}

export function ThemeScript() {
  const theme = useTheme()
  const script = useMemo(
    () => `
	const theme = ${JSON.stringify(theme)}
if (theme === "system") {
	const systemColor = window.matchMedia("(prefers-color-scheme: dark)")
	if(systemColor.matches) document.documentElement.classList.add("dark")
}
`,
    [], // eslint-disable-line
  )

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line
    useLayoutEffect(() => {
      function set(color: MediaQueryList) {
        if (color.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      if (theme === 'system') {
        const systemColor = window.matchMedia('(prefers-color-scheme: dark)')
        if (systemColor.matches) document.documentElement.classList.add('dark')
        set(systemColor)
        // @ts-ignore
        systemColor.addEventListener('change', set)
        // @ts-ignore
        return () => systemColor.removeEventListener('change', set)
      }
      if (theme === 'dark') document.documentElement.classList.add('dark')
      if (theme === 'light') document.documentElement.classList.remove('dark')
    }, [theme])
  }

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

export function ThemeButton() {
  const location = useLocation()
  const theme = useTheme()
  const systemIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  )

  const lightIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  )

  const darkIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  )

  const switchIcon =
    theme === 'system' ? lightIcon : theme === 'light' ? darkIcon : systemIcon
  const nextMode =
    theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'

  return (
    <Form method="POST" action="/set-theme" replace preventScrollReset>
      <input
        type="hidden"
        name="redirectTo"
        value={location.pathname + location.search}
      />
      <button name="theme" value={nextMode}>
        {switchIcon}
      </button>
    </Form>
  )
}
