import { Request, Response } from "express";
import { InsertOneResult } from "mongodb";
import { createMaterial } from "../../../connectors/materials/create";
import { findMaterialByName } from "../../../connectors/materials/find-by-name";

import { Material, MaterialBase, MaterialBody } from "../../../interfaces/material";
import { verifyAction } from "../../../plugins/authentication";
import { errorHandler } from "../../../plugins/errors";

export async function materialPostController(req: Request, res: Response): Promise<void> {
  try {
    const {
      body: {
        name,
      },
      user
    }: {
      body: MaterialBody,
      user?: Request['user']
    } = req
    if (!verifyAction(user, 'material-post')) throw new Error('UNAUTHORIZED')

    const payload: MaterialBase = {
      name,
      unique_name: name.replace(/[^\w\s]| /gi, '').toLowerCase(),
      create_date: new Date()
    }

    const material: Material = await findMaterialByName(payload.unique_name)
    if (material) res.status(200).send(material._id.toString())
    else {
      const { insertedId: newMaterialId }: InsertOneResult = await createMaterial(payload)
      res.status(201).send(newMaterialId.toString())
    }
  } catch (e) {
    errorHandler(e, res)
  }
}