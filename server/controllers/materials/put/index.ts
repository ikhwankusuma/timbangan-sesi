import { Request, Response } from "express";
import { ObjectId, UpdateResult } from "mongodb";
import { findMaterialById } from "../../../connectors/materials/find-by-id";
import { findMaterialByName } from "../../../connectors/materials/find-by-name";
import { updateMaterial } from "../../../connectors/materials/update";

import { Material, MaterialBody } from "../../../interfaces/material";
import { verifyAction } from "../../../plugins/authentication";
import { errorHandler } from "../../../plugins/errors";

export async function materialPutController(req: Request, res: Response): Promise<void> {
  try {
    const {
      params: {
        _id
      },
      body: {
        name,
      },
      user
    }: {
      params: {
        _id?: string
      }
      body: MaterialBody,
      user?: Request['user']
    } = req
    if (!verifyAction(user, 'material-put')) throw new Error('UNAUTHORIZED')

    let nameChanged: boolean = false

    const material: Material = await findMaterialById(new ObjectId(_id))

    if (name !== material.name) {
      material.name = name
      nameChanged = true
    }
    material.unique_name = name.replace(/[^\w\s]| /gi, '').toLowerCase()

    if (nameChanged && await findMaterialByName(material.unique_name)) throw new Error('MATERIAL_ALREADY_EXIST')

    const { modifiedCount }: UpdateResult = await updateMaterial(material)
    if (!modifiedCount) throw new Error('MATERIAL_NOT_UPDATED')

    res.status(200).send(material)
  } catch (e) {
    errorHandler(e, res)
  }
}