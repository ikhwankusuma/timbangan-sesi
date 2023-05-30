import { Request, Response } from "express";

import { getSourceDataByQuery } from "../../../connectors/sources/get-data-by-query";
import { Source } from "../../../interfaces/source";
import { errorHandler } from "../../../plugins/errors";

export async function sourceGetController(req: Request, res: Response): Promise<void> {
  try {
    const sources: Source[] = await getSourceDataByQuery({})

    res.status(200).send(sources)
  } catch (e) {
    errorHandler(e, res)
  }
}