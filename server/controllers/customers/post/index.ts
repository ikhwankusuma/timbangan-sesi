import { Request, Response } from "express";
import { InsertOneResult } from "mongodb";
import { createCustomer } from "../../../connectors/customers/create";
import { findCustomerByName } from "../../../connectors/customers/find-by-name";

import { Customer, CustomerBase, CustomerBody } from "../../../interfaces/customer";
import { verifyAction } from "../../../plugins/authentication";
import { errorHandler } from "../../../plugins/errors";

export async function customerPostController(req: Request, res: Response): Promise<void> {
  try {
    const {
      body: {
        name,
        address,
        phone,
        email
      },
      user
    }: {
      body: CustomerBody,
      user?: Request['user']
    } = req
    if (!verifyAction(user, 'customer-post')) throw new Error('UNAUTHORIZED')

    const payload: CustomerBase = {
      name,
      address,
      phone,
      email,
      unique_name: name.replace(/[^\w\s]| /gi, '').toLowerCase(),
      create_date: new Date()
    }

    const customer: Customer = await findCustomerByName(payload.unique_name)
    if (customer) res.status(200).send(customer._id.toString())
    else {
      const { insertedId: newCustomerId }: InsertOneResult = await createCustomer(payload)
      res.status(201).send(newCustomerId.toString())
    }
  } catch (e) {
    errorHandler(e, res)
  }
}