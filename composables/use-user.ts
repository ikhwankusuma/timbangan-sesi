import { CookieRef } from "nuxt/dist/app/composables";
import { User, UserBody } from "~~/interfaces/user";

import useAlert from "./use-alert";

export default function () {
  const router = useRouter()
  const { setAlert } = useAlert()
  const { $fetch, $setDefaults } = useNuxtApp()
  const config = useRuntimeConfig()

  const user = useState<User | null>('user', () => null)
  const atkCookie: CookieRef<string> = useCookie<string>('atk', {
    maxAge: 1800
  })
  const rtkCookie: CookieRef<string> = useCookie<string>('rtk', {
    maxAge: 86400
  })

  const login = async (payload: { username: string; password: string }): Promise<User> => {
    const response: Response = await $fetch(`${config.public.apiBase}/users/login`, 'post', JSON.stringify({ username: payload.username, password: payload.password }))
    if (response.status !== 200) throw new Error(await response.text())

    const result: { atk: string; rtk: string; user: User } = await response.json()
    if (!result.atk || !result.rtk) throw new Error('')
    atkCookie.value = result.atk
    rtkCookie.value = result.rtk
    $setDefaults({
      headers: {
        'Authorization': `Bearer ${result.atk}`
      }
    })
    user.value = result.user
    return result.user
  }

  const refresh = async (): Promise<User | null> => {
    try {
      if (!rtkCookie.value) throw new Error('')
      $setDefaults({
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const response: Response = await $fetch(`${config.public.apiBase}/users/refresh`, 'post', JSON.stringify({ rtk: rtkCookie.value }))
      if (response.status !== 200) throw new Error(await response.text())

      const result: { atk: string; rtk: string; user: User } = await response.json()
      if (!result.atk || !result.rtk) throw new Error('')
      atkCookie.value = result.atk
      rtkCookie.value = result.rtk
      $setDefaults({
        headers: {
          'Authorization': `Bearer ${result.atk}`
        }
      })
      user.value = result.user
      return result.user
    } catch {
      if (rtkCookie.value || atkCookie.value) {
        setAlert({
          type: 'warning',
          title: 'Session ended',
          message: 'Please reenter your credentials'
        })
        logout()
        router.push('/auth')
      } else {
        logout()
      }
      return null
    }
  }

  const logout = (): void => {
    atkCookie.value = ''
    rtkCookie.value = ''
    $setDefaults({
      headers: {
        'Authorization': null
      }
    })
    user.value = null
  }

  const createAccount = async (payload: { name: string; username: string; password: string }): Promise<string> => {
    const response: Response = await $fetch(`${config.public.apiBase}/users`, 'post', JSON.stringify({ name: payload.name, username: payload.username, password: payload.password, }))
    if (response.status !== 201) throw new Error(await response.text())

    const result: string = await response.text()

    return result
  }

  const updateAccount = async (payload: UserBody): Promise<User> => {
    const response: Response = await $fetch(`${config.public.apiBase}/users/${payload._id}`, 'put', JSON.stringify(payload))
    if (response.status !== 200) throw new Error(await response.text())

    const result: User = await response.json()

    return result
  }

  return {
    user,
    login,
    logout,
    refresh,
    createAccount,
    updateAccount
  }
}