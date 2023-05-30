import { Request, Response } from "express";

import { getScaleDataByQuery } from "../../../connectors/scales/get-data-by-query";
import { Scale } from "../../../interfaces/scale";
import { errorHandler } from "../../../plugins/errors";

export async function mainGetController(req: Request, res: Response): Promise<void> {
  try {
    const {
      query: {
        record,
        start_date,
        end_date
      }
    }: {
      query: {
        record?: string
        start_date?: string
        end_date?: string
      }
    } = req

    const scales: Scale[] = await getScaleDataByQuery({
      record: record || '',
      start_date: start_date ? new Date(parseInt(start_date)) : null,
      end_date: end_date ? new Date(parseInt(end_date)) : null
    })

    const count: number = scales.reduce((a, b) => {
      return a + b.data.reduce((c, d) => c + d.weight, 0)
    }, 0)

    res.status(200).send({ total: count })
  } catch (e) {
    errorHandler(e, res)
  }
}