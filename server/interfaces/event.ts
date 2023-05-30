import { ObjectId } from "mongodb"
import { ErrorMessage } from "../plugins/errors"
import { UserRole } from "./user"

type EventActionOperator = 'user-put' | 'customer-get' | 'customer-post' | 'customer-put' | 'supplier-get' | 'supplier-post' | 'supplier-put' | 'material-get' | 'material-post' | 'material-put'
type EventActionAdmin = 'scale-post' | 'scale-put' | 'source-post'

export type EventAction = EventActionOperator | EventActionAdmin

interface EventUser {
  _id: ObjectId
  role: UserRole[]
  name: string
}

export interface EventBase {
  type: 'action' | 'system' | 'error'
  date: Date
  action?: EventActionOperator | EventActionAdmin
  before_data?: any
  after_data?: any
  error_message?: ErrorMessage
  error_stack?: any
  user?: EventUser
}

export interface Event extends EventBase {
  _id: ObjectId
}