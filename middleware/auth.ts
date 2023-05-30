export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    const { getConfig } = useMain()
    const { user, logout, refresh } = useUser()

    await getConfig()
    await refresh()

    if (!user.value) {
      logout()
      return '/auth'
    }
    return true
  } catch (e) {
    return '/config'
  }
})