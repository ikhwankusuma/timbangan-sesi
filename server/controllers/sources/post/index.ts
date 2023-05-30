import { Request, Response } from 'express'
import { InsertOneResult, ObjectId } from 'mongodb'

import { errorHandler } from '../../../plugins/errors'
import { verifyAction } from '../../../plugins/authentication'
import { Source, SourceBase, SourceBody } from '../../../interfaces/source'
import { createSource } from '../../../connectors/sources/create'
import { findSourceByName } from '../../../connectors/sources/find-by-name/index'
import { findCustomerById } from '../../../connectors/customers/find-by-id/index'
import { Customer } from '../../../interfaces/customer'
import { Supplier } from '../../../interfaces/supplier'
import { findSupplierById } from '../../../connectors/suppliers/find-by-id/index'

export async function sourcePostController(req: Request, res: Response): Promise<void> {
  try {
    const {
      body: {
        name,
        type,
        license,
        customer_id,
        supplier_id,
        color
      },
      user
    }: {
      body: SourceBody
      user?: Request['user']
    } = req
    if (!verifyAction(user, 'source-post')) throw new Error('UNAUTHORIZED')

    const payload: SourceBase = {
      name,
      type,
      license,
      color,
      unique_name: name.replace(/[^\w\s]| /gi, '').toLowerCase(),
      create_date: new Date()
    }

    if (customer_id && supplier_id)
      throw new Error('SOURCE_CAN_NOT_HAVE_CUSTOMER_AND_SUPPLIER')

    if (customer_id) {
      payload.customer_id = new ObjectId(customer_id)
      const customer: Customer = await findCustomerById(payload.customer_id)
      if (!customer) throw new Error('SOURCE_CUSTOMER_INVALID')
    } else if (supplier_id) {
      payload.supplier_id = new ObjectId(supplier_id)
      const supplier: Supplier = await findSupplierById(payload.supplier_id)
      if (!supplier) throw new Error('SOURCE_CUSTOMER_INVALID')
    }

    const source: Source = await findSourceByName(payload.unique_name)
    if (source) res.status(200).send(source._id.toString())
    else {
      const { insertedId: newSourceId }: InsertOneResult = await createSource(payload)
      res.status(201).send(newSourceId.toString())
    }
  } catch (e) {
    errorHandler(e, res)
  }
}