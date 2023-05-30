
import { Customer, CustomerBody } from "~~/interfaces/customer"

export default function () {
  const { setAlert } = useAlert()
  const { $fetch } = useNuxtApp()
  const config = useRuntimeConfig()

  const customers = useState<Customer[]>('customers', () => null)

  const getCustomers = async (): Promise<Customer[]> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/customers`, 'get')
      if (response.status !== 200) throw new Error(await response.text())

      customers.value = await response.json()
      return customers.value
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal memuat customer',
        message: 'silahkan coba lagi nanti',
      })
    }
  }
  const createCustomer = async (payload: CustomerBody): Promise<string> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/customers`, 'post', JSON.stringify(payload))
      if (response.status >= 400) throw new Error(await response.text())
      if (response.status === 200) setAlert({
        type: 'warning',
        title: 'Customer sudah ada',
        message: 'nama tersebut sudah dipakai'
      })

      return await response.text()
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal membuat customer',
        message: 'silahkan coba lagi nanti',
      })
    }
  }
  const editCustomer = async (payload: {
    _id: string,
    data: CustomerBody
  }): Promise<Customer> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/customers/${payload._id}`, 'put', JSON.stringify(payload.data))
      if (response.status !== 200) throw new Error(await response.text())

      return await response.json()
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal menyunting customer',
        message: 'silahkan coba lagi nanti',
      })
    }
  }

  return { customers, getCustomers, createCustomer, editCustomer }
}