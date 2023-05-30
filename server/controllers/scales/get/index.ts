import { Request, Response } from "express";
import { ObjectId } from "mongodb";

import { getScaleDataByQuery } from "../../../connectors/scales/get-data-by-query";
import { Scale } from "../../../interfaces/scale";
import { errorHandler } from "../../../plugins/errors";

export async function scaleGetController(req: Request, res: Response): Promise<void> {
  try {
    const {
      query: {
        _id,
        record,
        limit,
        skip,
        start_date,
        end_date
      }
    }: {
      query: {
        _id?: string
        record?: string
        limit?: string
        skip?: string
        start_date?: string
        end_date?: string
      }
    } = req

    const scales: Scale[] = await getScaleDataByQuery({
      _id: _id ? new ObjectId(_id) : null,
      record: record || '',
      limit: parseInt(limit) || 0,
      skip: parseInt(skip) || 0,
      start_date: start_date ? new Date(parseInt(start_date)) : null,
      end_date: end_date ? new Date(parseInt(end_date)) : null
    })

    res.status(200).send(scales)
  } catch (e) {
    errorHandler(e, res)
  }
}