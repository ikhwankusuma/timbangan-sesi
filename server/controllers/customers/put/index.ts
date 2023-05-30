import { Request, Response } from "express";
import { ObjectId, UpdateResult } from "mongodb";
import { findCustomerById } from "../../../connectors/customers/find-by-id";
import { findCustomerByName } from "../../../connectors/customers/find-by-name";
import { updateCustomer } from "../../../connectors/customers/update";

import { Customer, CustomerBody } from "../../../interfaces/customer";
import { verifyAction } from "../../../plugins/authentication";
import { errorHandler } from "../../../plugins/errors";

export async function customerPutController(req: Request, res: Response): Promise<void> {
  try {
    const {
      params: {
        _id
      },
      body: {
        name,
        address,
        phone,
        email
      },
      user
    }: {
      params: {
        _id?: string
      }
      body: CustomerBody,
      user?: Request['user']
    } = req
    if (!verifyAction(user, 'customer-put')) throw new Error('UNAUTHORIZED')

    let nameChanged: boolean = false

    const customer: Customer = await findCustomerById(new ObjectId(_id))

    if (name !== customer.name) {
      customer.name = name
      nameChanged = true
    }
    customer.address = address
    customer.phone = phone
    customer.email = email
    customer.unique_name = name.replace(/[^\w\s]| /gi, '').toLowerCase()

    if (nameChanged && await findCustomerByName(customer.unique_name)) throw new Error('CUSTOMER_ALREADY_EXIST')

    const { modifiedCount }: UpdateResult = await updateCustomer(customer)
    if (!modifiedCount) throw new Error('CUSTOMER_NOT_UPDATED')

    res.status(200).send(customer)
  } catch (e) {
    errorHandler(e, res)
  }
}