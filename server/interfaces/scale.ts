import { ObjectId } from "mongodb"

export interface ScaleDataBody {
  source_id: string
  material_id?: string
  material_name?: string
  weight: number
}
export interface ScaleData {
  _id: ObjectId
  source: {
    _id: ObjectId
    name: string
  }
  material: {
    _id: ObjectId
    name: string
  }
  date: Date
  weight: number
}

export interface ScaleBody {
  customer_id?: string
  customer_name?: string
  supplier_id?: string
  supplier_name?: string
  note?: string
}

export interface ScaleBase {
  number: string
  customer?: {
    _id: ObjectId
    name: string
  }
  supplier?: {
    _id: ObjectId
    name: string
  }
  note?: string
  data: ScaleData[]
  status: 'weighing' | 'finished'
  start_date: Date
  end_date?: Date
}

export interface Scale extends ScaleBase {
  _id: ObjectId
}