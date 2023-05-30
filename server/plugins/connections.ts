import * as mongoDB from "mongodb"

import { Customer } from "../interfaces/customer"
import { Event } from "../interfaces/event"
import { Material } from "../interfaces/material"
import { Scale } from "../interfaces/scale"
import { Source } from "../interfaces/source"
import { Supplier } from "../interfaces/supplier"
import { User } from '../interfaces/user'

interface Collections {
  customers?: mongoDB.Collection<Customer>
  events?: mongoDB.Collection<Event>
  materials?: mongoDB.Collection<Material>
  scales?: mongoDB.Collection<Scale>
  sources?: mongoDB.Collection<Source>
  suppliers?: mongoDB.Collection<Supplier>
  users?: mongoDB.Collection<User>
}

export const collections: Collections = {}

export async function connectToDatabase(): Promise<void> {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017')
  await client.connect()

  const db: mongoDB.Db = client.db(process.env.MONGO_DB_NAME || 'weigh-session')

  collections.customers = db.collection<Customer>('customers')
  collections.events = db.collection<Event>('events')
  collections.materials = db.collection<Material>('materials')
  collections.scales = db.collection<Scale>('scales')
  collections.sources = db.collection<Source>('sources')
  collections.suppliers = db.collection<Supplier>('suppliers')
  collections.users = db.collection<User>('users')
}