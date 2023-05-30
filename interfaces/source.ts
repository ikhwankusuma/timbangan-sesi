export interface SourceBody {
  name: string
  type: 'truck' | 'any'
  license?: string
  customer_id?: string
  supplier_id?: string
  color?: string
}

export interface SourceBase {
  name: string
  unique_name: string
  type: 'truck' | 'any'
  license?: string
  customer_id?: string
  supplier_id?: string
  color?: string
  create_date: Date
}

export interface Source extends SourceBase {
  _id: string
}