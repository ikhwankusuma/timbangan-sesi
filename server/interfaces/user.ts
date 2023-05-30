import { ObjectId } from "mongodb";

export type UserRole = 'operator' | 'admin'

export interface UserBody {
  name: string
  username: string
  password: string
  role: UserRole
}

export interface UserBase {
  role: UserRole
  name: string
  username: string
  password: string
  create_date: Date
}

export interface User extends UserBase {
  _id: ObjectId
  salt: string
}

export interface UserResponse {
  _id: ObjectId
  name: string
  role: UserRole
}