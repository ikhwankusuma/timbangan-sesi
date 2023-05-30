import { Request, Response } from "express";
import { InsertOneResult } from "mongodb";
import { createSupplier } from "../../../connectors/suppliers/create";
import { findSupplierByName } from "../../../connectors/suppliers/find-by-name";

import { Supplier, SupplierBase, SupplierBody } from "../../../interfaces/supplier";
import { verifyAction } from "../../../plugins/authentication";
import { errorHandler } from "../../../plugins/errors";

export async function supplierPostController(req: Request, res: Response): Promise<void> {
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
      body: SupplierBody,
      user?: Request['user']
    } = req
    if (!verifyAction(user, 'supplier-post')) throw new Error('UNAUTHORIZED')

    const payload: SupplierBase = {
      name,
      address,
      phone,
      email,
      unique_name: name.replace(/[^\w\s]| /gi, '').toLowerCase(),
      create_date: new Date()
    }

    const supplier: Supplier = await findSupplierByName(payload.unique_name)
    if (supplier) res.status(200).send(supplier._id.toString())
    else {
      const { insertedId: newSupplierId }: InsertOneResult = await createSupplier(payload)
      res.status(201).send(newSupplierId.toString())
    }
  } catch (e) {
    errorHandler(e, res)
  }
}