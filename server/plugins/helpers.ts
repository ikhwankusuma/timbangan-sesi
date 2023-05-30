import { getScaleCount } from "../connectors/scales/get-count";

const months: string[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

export async function generateRecordNumber(): Promise<string> {
  const date: Date = new Date()
  const count: number = await getScaleCount()

  let str: string = ''

  str += `${date.getFullYear()}/${months[date.getMonth()]}/${(count + 1).toString().padStart(5, '0')}`
  return str
}

export function generateRandomString(length: number = 5): string {
  let str: string = ''
  const availableChars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  for (let i = 0; i < length; i++) {
    str += availableChars[Math.round(Math.random() * (availableChars.length - 1))]
    if (i === length - 1) return str
  }
}