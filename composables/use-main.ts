import { Config, ViewMode } from "~~/interfaces/general"

export default function () {
  const router = useRouter()
  const { setAlert } = useAlert()
  const { $fetch } = useNuxtApp()
  const { public: publicConfig } = useRuntimeConfig()

  const viewMode = useState<ViewMode>('view-mode', () => null)
  const config = useState<Config>('config', () => null)

  const errorHandler = (code: string): string => {
    let message: string = ''
    switch (code) {
      case 'INVALID_COMBINATION':
        message = 'Kombinasi username dan password salah'
        break;
      case 'USER_ALREADY_EXIST':
        message = 'Username tersebut sudah digunakan'
        break;
      default:
        message = 'Terjadi masalah, silahkan coba lagi'
        break;
    }
    return message
  }

  const createConfig = async (payload: Config): Promise<Config> => {
    try {
      const response: Response = await $fetch(`${publicConfig.apiBase}/config`, 'post', JSON.stringify({
        status: payload.status,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        password: payload.password,
      }))
      if (response.status !== 201) throw new Error(await response.text())

      const result: Config = await response.json()

      config.value = result
      return result
    } catch (e: any) {
      setAlert({
        type: 'error',
        title: 'Gagal membuat config',
        message: 'Silahkan coba kembali'
      })
      return null
    }
  }
  const updateConfig = async (payload: Config): Promise<Config> => {
    try {
      const response: Response = await $fetch(`${publicConfig.apiBase}/config`, 'put', JSON.stringify({
        status: payload.status,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        password: payload.password,
      }))
      if (response.status !== 200) throw new Error(await response.text())

      const result: Config = await response.json()

      config.value = result
      return result
    } catch (e: any) {
      setAlert({
        type: 'error',
        title: e.message === 'INVALID_COMBINATION' ? 'Serial key salah!' : 'Gagal membuat config',
        message: 'Silahkan coba kembali'
      })
      return null
    }
  }
  const getConfig = async (): Promise<Config> => {
    try {
      const response: Response = await $fetch(`${publicConfig.apiBase}/config`, 'get')
      if (response.status !== 200) throw new Error(await response.text())

      const result: Config = await response.json()

      config.value = result
      return result
    } catch (e: any) {
      router.push('/config')
      setAlert({
        type: 'warning',
        title: 'Config tidak ditemukan',
        message: 'Tolong konfigurasi aplikasi anda'
      })
      return null
    }
  }

  return { viewMode, config, errorHandler, createConfig, updateConfig, getConfig }
}