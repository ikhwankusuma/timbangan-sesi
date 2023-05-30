
import { Supplier, SupplierBody } from "~~/interfaces/supplier"

export default function () {
  const { setAlert } = useAlert()
  const { $fetch } = useNuxtApp()
  const config = useRuntimeConfig()

  const suppliers = useState<Supplier[]>('suppliers', () => null)

  const getSuppliers = async (): Promise<Supplier[]> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/suppliers`, 'get')
      if (response.status !== 200) throw new Error(await response.text())

      suppliers.value = await response.json()
      return suppliers.value
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal memuat supplier',
        message: 'silahkan coba lagi nanti',
      })
    }
  }
  const createSupplier = async (payload: SupplierBody): Promise<string> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/suppliers`, 'post', JSON.stringify(payload))
      if (response.status >= 400) throw new Error(await response.text())
      if (response.status === 200) setAlert({
        type: 'warning',
        title: 'Supplier sudah ada',
        message: 'nama tersebut sudah dipakai'
      })

      return await response.text()
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal membuat supplier',
        message: 'silahkan coba lagi nanti',
      })
    }
  }
  const editSupplier = async (payload: {
    _id: string,
    data: SupplierBody
  }): Promise<Supplier> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/suppliers/${payload._id}`, 'put', JSON.stringify(payload.data))
      if (response.status !== 200) throw new Error(await response.text())

      return await response.json()
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal menyunting supplier',
        message: 'silahkan coba lagi nanti',
      })
    }
  }

  return { suppliers, getSuppliers, createSupplier, editSupplier }
}