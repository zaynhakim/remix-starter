import {
  createCookie,
  redirect,
  unstable_defineAction as defineAction,
} from '@remix-run/node'

const cookie = createCookie('theme', {
  maxAge: 34560000,
  sameSite: 'lax',
})

export function serializeTheme(theme: string) {
  if (theme === 'system') {
    return cookie.serialize({}, { expires: new Date(0), maxAge: 0 })
  } else {
    return cookie.serialize({ theme })
  }
}

export async function parseTheme(request: Request) {
  const header = request.headers.get('Cookie')
  const parsed = await cookie.parse(header)
  return parsed ? parsed.theme : 'system'
}

export const action = defineAction(async ({ request }) => {
  const formData = await request.formData()
  const theme = formData.get('theme')?.toString()
  const redirectTo = formData.get('redirectTo')?.toString()
  return redirect(redirectTo || '/', {
    headers: { 'Set-Cookie': await serializeTheme(theme || 'system') },
  })
})
