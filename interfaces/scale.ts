export interface ScaleDataBody {
  source_id: string
  material_id?: string
  material_name?: string
  weight: number
}
export interface ScaleData {
  _id: string
  source: {
    _id: string
    name: string
  }
  material: {
    _id: string
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
    _id: string
    name: string
  }
  supplier?: {
    _id: string
    name: string
  }
  note?: string
  data: ScaleData[]
  status: 'weighing' | 'finished'
  start_date: Date
  end_date?: Date
}

export interface Scale extends ScaleBase {
  _id: string
}

export interface ScaleQuery {
  limit?: number
  skip?: number
  record?: string
  start_date?: number
  end_date?: number
  eol?: boolean
}