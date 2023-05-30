import { Request, Response } from "express";
import { ObjectId, UpdateResult } from "mongodb";
import { findSupplierById } from "../../../connectors/suppliers/find-by-id";
import { findSupplierByName } from "../../../connectors/suppliers/find-by-name";
import { updateSupplier } from "../../../connectors/suppliers/update";

import { Supplier, SupplierBody } from "../../../interfaces/supplier";
import { verifyAction } from "../../../plugins/authentication";
import { errorHandler } from "../../../plugins/errors";

export async function supplierPutController(req: Request, res: Response): Promise<void> {
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
      body: SupplierBody,
      user?: Request['user']
    } = req
    if (!verifyAction(user, 'supplier-put')) throw new Error('UNAUTHORIZED')

    let nameChanged: boolean = false

    const supplier: Supplier = await findSupplierById(new ObjectId(_id))

    if (name !== supplier.name) {
      supplier.name = name
      nameChanged = true
    }
    supplier.address = address
    supplier.phone = phone
    supplier.email = email
    supplier.unique_name = name.replace(/[^\w\s]| /gi, '').toLowerCase()

    if (nameChanged && await findSupplierByName(supplier.unique_name)) throw new Error('SUPPLIER_ALREADY_EXIST')

    const { modifiedCount }: UpdateResult = await updateSupplier(supplier)
    if (!modifiedCount) throw new Error('SUPPLIER_NOT_UPDATED')

    res.status(200).send(supplier)
  } catch (e) {
    errorHandler(e, res)
  }
}