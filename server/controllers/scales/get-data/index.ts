import { Request, Response } from "express";
import { ObjectId } from "mongodb";

import { findScaleById } from "../../../connectors/scales/find-by-id";
import { Scale } from "../../../interfaces/scale";
import { errorHandler } from "../../../plugins/errors";

export async function scaletGetDataController(req: Request, res: Response): Promise<void> {
  try {
    const {
      params: {
        _id
      }
    }: {
      params: {
        _id?: string
      }
    } = req

    const scale: Scale = await findScaleById(new ObjectId(_id))

    res.status(200).send(scale)
  } catch (e) {
    errorHandler(e, res)
  }
}