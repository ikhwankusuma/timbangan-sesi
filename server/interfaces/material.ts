import { ObjectId } from "mongodb"

export interface MaterialBody {
  name: string
}

export interface MaterialBase {
  name: string
  unique_name: string
  create_date: Date
}

export interface Material extends MaterialBase {
  _id: ObjectId
}