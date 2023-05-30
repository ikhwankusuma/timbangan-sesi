import { Request, Response } from "express";

import { getCustomerDataByQuery } from "../../../connectors/customers/get-data-by-query/index";
import { Customer } from "../../../interfaces/customer";
import { errorHandler } from "../../../plugins/errors";

export async function customerGetController(req: Request, res: Response): Promise<void> {
  try {
    const customer: Customer[] = await getCustomerDataByQuery({})

    res.status(200).send(customer)
  } catch (e) {
    errorHandler(e, res)
  }
}