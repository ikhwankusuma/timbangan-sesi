import { Request, Response } from "express";

import { getSupplierDataByQuery } from "../../../connectors/suppliers/get-data-by-query/index";
import { Supplier } from "../../../interfaces/supplier";
import { errorHandler } from "../../../plugins/errors";

export async function supplierGetController(req: Request, res: Response): Promise<void> {
  try {
    const supplier: Supplier[] = await getSupplierDataByQuery({})

    res.status(200).send(supplier)
  } catch (e) {
    errorHandler(e, res)
  }
}