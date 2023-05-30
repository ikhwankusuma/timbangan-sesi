import { ObjectId } from "mongodb"

export interface SupplierBody {
  name: string
  address?: string
  phone?: string
  email?: string
}

export interface SupplierBase {
  name: string
  unique_name: string
  address?: string
  phone?: string
  email?: string
  create_date: Date
}

export interface Supplier extends SupplierBase {
  _id: ObjectId
}