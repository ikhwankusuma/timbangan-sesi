
import { Scale, ScaleBody, ScaleDataBody, ScaleQuery } from "~~/interfaces/scale"

export default function () {
  const { setAlert } = useAlert()
  const { $fetch } = useNuxtApp()
  const config = useRuntimeConfig()

  const scales = useState<Scale[]>('scales', () => null)
  const threshold = useState<number>('scale-threshold', () => 0)
  const summary = useState<number>('scale-summary', () => 0)
  const query = useState<ScaleQuery>('scale-query', () => ({
    limit: 5,
    skip: 0,
    eol: false
  }))

  const loadThreshold = (): void => {
    threshold.value = parseInt(localStorage.getItem('scale-threshold')) || 0
  }
  const setThreshold = (payload: { threshold: number }): void => {
    if (payload.threshold >= 0) {
      localStorage.setItem('scale-threshold', payload.threshold.toString())
      threshold.value = payload.threshold
    }
  }
  const getScale = async (payload: { _id: string }): Promise<Scale[]> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/scales/${payload._id}`, 'get')
      if (response.status !== 200) throw new Error(await response.text())

      scales.value = await response.json()
      return scales.value
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal memuat data',
        message: 'silahkan coba lagi nanti'
      })
    }
  }
  const getScales = async (): Promise<Scale[]> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/scales?${query.value.limit ? `limit=${query.value.limit}&` : ''}${query.value.skip ? `skip=${query.value.skip}&` : ''}${query.value.start_date ? `start_date=${query.value.start_date}&` : ''}${query.value.end_date ? `end_date=${query.value.end_date}&` : ''}${query.value.record ? `record=${query.value.record}` : ''
        }`, 'get')
      if (response.status !== 200) throw new Error(await response.text())

      const result: Scale[] = await response.json()
      if (!query.value.skip) {
        await getSummary()
        scales.value = result
        query.value.skip += query.value.limit
      } else {
        scales.value.push(...result)
        query.value.skip += query.value.limit
        if (result.length < query.value.limit)
          query.value.eol = true
      }

      return scales.value
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal memuat data',
        message: 'silahkan coba lagi nanti'
      })
    }
  }
  const getSummary = async (): Promise<void> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}?${query.value.start_date ? `start_date=${query.value.start_date}&` : ''}${query.value.end_date ? `end_date=${query.value.end_date}&` : ''}${query.value.record ? `record=${query.value.record}` : ''
        }`, 'get')
      if (response.status !== 200) throw new Error(await response.text())

      const result: { total: number } = await response.json()
      summary.value = result?.total || 0
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal memuat data',
        message: 'silahkan coba lagi nanti'
      })
    }
  }
  const createScale = async (payload: ScaleBody): Promise<string> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/scales`, 'post', JSON.stringify(payload))
      if (response.status !== 201) throw new Error(await response.text())

      query.value.skip = 0
      query.value.eol = false
      await getScales()

      return await response.text()
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal membuat sesi',
        message: 'silahkan coba lagi nanti'
      })
    }
  }
  const addScaleData = async (payload: {
    _id: string,
    data: ScaleDataBody
  }): Promise<Scale> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/scales/add/${payload._id}`, 'put', JSON.stringify(payload.data))
      if (response.status !== 200) throw new Error(await response.text())

      const scale: Scale = await response.json()

      const index: number = scales.value?.findIndex((a) => a._id === scale._id)
      if (index > -1) {
        scales.value[index] = scale
      }

      return scale
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal menambahkan data',
        message: 'silahkan coba lagi nanti'
      })
    }
  }
  const removeScaleData = async (payload: {
    scale_id: string,
    data_id: string
  }): Promise<Scale> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/scales/remove/${payload.scale_id}/${payload.data_id}`, 'put')
      if (response.status !== 200) throw new Error(await response.text())

      const scale: Scale = await response.json()

      const index: number = scales.value?.findIndex((a) => a._id === scale._id)
      if (index > -1) {
        scales.value[index] = scale
      }

      return scale
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal menghapus data',
        message: 'silahkan coba lagi nanti'
      })
    }
  }
  const finishScale = async (payload: {
    _id: string
  }): Promise<Scale> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/scales/finish/${payload._id}`, 'put')
      if (response.status !== 200) throw new Error(await response.text())

      const scale: Scale = await response.json()

      const index: number = scales.value?.findIndex((a) => a._id === scale._id)
      if (index > -1) {
        scales.value[index] = scale
      }

      return scale
    } catch (e) {
      setAlert({
        type: 'error',
        title: 'Gagal menyelesaikan sesi',
        message: 'silahkan coba lagi nanti'
      })
    }
  }

  return { scales, threshold, summary, query, loadThreshold, setThreshold, getScale, getScales, createScale, removeScaleData, addScaleData, finishScale }
}