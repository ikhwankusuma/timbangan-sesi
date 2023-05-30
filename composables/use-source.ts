
import { Source, SourceBody } from "~~/interfaces/source"

export default function () {
  const { setAlert } = useAlert()
  const { $fetch } = useNuxtApp()
  const config = useRuntimeConfig()

  const sources = useState<Source[]>('sources', () => null)

  const getSources = async (): Promise<Source[]> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/sources`, 'get')
      if (response.status !== 200) throw new Error(await response.text())

      sources.value = await response.json()
      return sources.value
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal memuat customer',
        message: 'silahkan coba lagi nanti',
      })
    }
  }
  const createSource = async (payload: SourceBody): Promise<string> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/sources`, 'post', JSON.stringify(payload))
      if (response.status >= 400) throw new Error(await response.text())

      await getSources()
      return await response.text()
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal memuat customer',
        message: 'silahkan coba lagi nanti',
      })
    }
  }

  return { sources, getSources, createSource }
}