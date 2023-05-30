import { Request, Response } from "express";

import { getMaterialDataByQuery } from "../../../connectors/materials/get-data-by-query";
import { Material } from "../../../interfaces/material";
import { errorHandler } from "../../../plugins/errors";

export async function materialGetController(req: Request, res: Response): Promise<void> {
  try {
    const material: Material[] = await getMaterialDataByQuery({})

    res.status(200).send(material)
  } catch (e) {
    errorHandler(e, res)
  }
}