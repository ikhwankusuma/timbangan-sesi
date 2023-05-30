import { CookieRef } from "nuxt/dist/app/composables"
import { User } from "~~/interfaces/user"
import useUser from "~~/composables/use-user"

export default defineNuxtPlugin(() => {
  const { refresh } = useUser()
  const runtime = useRuntimeConfig()

  const atkCookie: CookieRef<string> = useCookie<string>('atk', {
    maxAge: 1800
  })
  const rtkCookie: CookieRef<string> = useCookie<string>('rtk', {
    maxAge: 86400
  })

  let config: RequestInit = {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  return {
    provide: {
      setDefaults: (option: RequestInit): void => {
        config = { ...config, ...option, headers: { ...option.headers, 'Content-Type': 'application/json' } }
      },
      fetch: async (url: string, method: string, body?: string | FormData): Promise<Response> => {
        const option: RequestInit = {
          ...config,
          method,
          body,
        }
        if (body && body instanceof FormData) option.headers = {
          ...option.headers,
          'Content-Type': ''
        }

        let response: Response = await fetch(url, option)

        if (response.status === 401) {
          const refreshResponse: Response = await fetch(`${runtime.public.apiBase}/users/refresh`, {
            ...config,
            method: 'post',
            body: JSON.stringify({ rtk: rtkCookie.value })
          })
          if (refreshResponse.status !== 200) throw new Error(await refreshResponse.text())

          const result: { atk: string; rtk: string; user: User } = await refreshResponse.json()
          if (!result.atk || !result.rtk) throw new Error('')
          atkCookie.value = result.atk
          rtkCookie.value = result.rtk
          const user: User | null = await refresh()
          if (user) response = await fetch(url, option)
        }

        return response
      }
    }
  }
})