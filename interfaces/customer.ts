export interface CustomerBody {
  name: string
  address?: string
  phone?: string
  email?: string
}

export interface CustomerBase {
  name: string
  unique_name: string
  address?: string
  phone?: string
  email?: string
  create_date: Date
}

export interface Customer extends CustomerBase {
  _id: string
}