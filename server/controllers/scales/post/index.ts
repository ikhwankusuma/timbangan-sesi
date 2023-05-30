import { Request, Response } from 'express'
import { InsertOneResult, ObjectId } from 'mongodb'

import { errorHandler } from '../../../plugins/errors'
import { verifyAction } from '../../../plugins/authentication'
import { generateRecordNumber } from '../../../plugins/helpers'
import { ScaleBase, ScaleBody } from '../../../interfaces/scale'
import { createScale } from '../../../connectors/scales/create'
import { findCustomerById } from '../../../connectors/customers/find-by-id/index'
import { Customer, CustomerBase } from '../../../interfaces/customer'
import { Supplier, SupplierBase } from '../../../interfaces/supplier'
import { findSupplierById } from '../../../connectors/suppliers/find-by-id'
import { findCustomerByName } from '../../../connectors/customers/find-by-name/index'
import { createCustomer } from '../../../connectors/customers/create/index'
import { findSupplierByName } from '../../../connectors/suppliers/find-by-name'
import { createSupplier } from '../../../connectors/suppliers/create'

export async function scalePostController(req: Request, res: Response): Promise<void> {
  try {
    const {
      body: {
        customer_id,
        customer_name,
        supplier_id,
        supplier_name,
        note
      },
      user
    }: {
      body: ScaleBody
      user?: Request['user']
    } = req
    if (!verifyAction(user, 'scale-post')) throw new Error('UNAUTHORIZED')

    const payload: ScaleBase = {
      number: await generateRecordNumber(),
      customer: null,
      supplier: null,
      status: 'weighing',
      note: note || null,
      data: [],
      start_date: new Date()
    }

    if (!customer_name && !customer_id && !supplier_name && !supplier_id)
      throw new Error('SCALE_MUST_HAVE_CUSTOMER_OR_SUPPLIER')

    if (customer_id) {
      const customer: Customer = await findCustomerById(new ObjectId(customer_id))
      if (customer) {
        payload.customer = {
          _id: customer._id,
          name: customer.name
        }
      }
    } else if (customer_name) {
      const customerPayload: CustomerBase = {
        name: customer_name,
        unique_name: customer_name.replace(/[^\w\s]| /gi, '').toLowerCase(),
        create_date: new Date()
      }
      const customer: Customer = await findCustomerByName(customerPayload.unique_name)
      if (customer) {
        payload.customer = {
          _id: customer._id,
          name: customer.name
        }
      } else {
        const { insertedId: newCustomerId }: InsertOneResult = await createCustomer(customerPayload)
        payload.customer = {
          _id: newCustomerId,
          name: customer_name
        }
      }
    } else if (supplier_id) {
      const supplier: Supplier = await findSupplierById(new ObjectId(supplier_id))
      if (supplier) {
        payload.supplier = {
          _id: supplier._id,
          name: supplier.name
        }
      }
    } else if (supplier_name) {
      const supplierPayload: SupplierBase = {
        name: supplier_name,
        unique_name: supplier_name.replace(/[^\w\s]| /gi, '').toLowerCase(),
        create_date: new Date()
      }
      const supplier: Supplier = await findSupplierByName(supplierPayload.unique_name)
      if (supplier) {
        payload.supplier = {
          _id: supplier._id,
          name: supplier.name
        }
      } else {
        const { insertedId: newSupplierId }: InsertOneResult = await createSupplier(supplierPayload)
        payload.supplier = {
          _id: newSupplierId,
          name: supplier_name
        }
      }
    }

    const { insertedId: newScaleId }: InsertOneResult = await createScale(payload)

    res.status(201).send(newScaleId.toString())
  } catch (e) {
    errorHandler(e, res)
  }
}