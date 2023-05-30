
import { Material, MaterialBody } from "~~/interfaces/material"

export default function () {
  const { setAlert } = useAlert()
  const { $fetch } = useNuxtApp()
  const config = useRuntimeConfig()

  const materials = useState<Material[]>('materials', () => null)

  const getMaterials = async (): Promise<Material[]> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/materials`, 'get')
      if (response.status !== 200) throw new Error(await response.text())

      materials.value = await response.json()
      return materials.value
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal memuat material',
        message: 'silahkan coba lagi nanti',
      })
    }
  }
  const createMaterial = async (payload: MaterialBody): Promise<string> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/materials`, 'post', JSON.stringify(payload))
      if (response.status >= 400) throw new Error(await response.text())
      if (response.status === 200) setAlert({
        type: 'warning',
        title: 'Material sudah ada',
        message: 'nama tersebut sudah dipakai'
      })

      return await response.text()
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal membuat material',
        message: 'silahkan coba lagi nanti',
      })
    }
  }
  const editMaterial = async (payload: {
    _id: string,
    data: MaterialBody
  }): Promise<Material> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/materials/${payload._id}`, 'put', JSON.stringify(payload.data))
      if (response.status !== 200) throw new Error(await response.text())

      return await response.json()
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal menyunting material',
        message: 'silahkan coba lagi nanti',
      })
    }
  }

  return { materials, getMaterials, createMaterial, editMaterial }
}