import { Alert } from "~~/interfaces/alert"

export default () => {
  const alert = useState<Alert | null>('alert', () => null)

  const setAlert = (data: Alert): void => {
    alert.value = data
  }

  const removeAlert = (): void => {
    alert.value = null
  }

  return { alert, setAlert, removeAlert }
}