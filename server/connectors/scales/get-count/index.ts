import { collections } from "../../../plugins/connections";

export async function getScaleCount(): Promise<number> {
  const currentDate: Date = new Date(new Date().setHours(0, 0, 0, 0))

  const maxDate: Date = new Date(currentDate.setFullYear(currentDate.getMonth() === 11 ? currentDate.getFullYear() + 1 : currentDate.getFullYear(), currentDate.getMonth() === 11 ? 0 : currentDate.getMonth() + 1, 1))
  const minDate: Date = new Date(new Date(new Date().setHours(0, 0, 0, 0)).setDate(1))

  const count: number = await collections.scales.countDocuments({
    start_date: {
      $gte: minDate,
      $lt: maxDate
    }
  })

  return count
}