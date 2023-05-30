import { ObjectId } from "mongodb"

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
  customer_id?: ObjectId
  supplier_id?: ObjectId
  color?: string
  create_date: Date
}

export interface Source extends SourceBase {
  _id: ObjectId
}