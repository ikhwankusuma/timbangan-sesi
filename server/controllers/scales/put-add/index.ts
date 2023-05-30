import { Request, Response } from 'express'
import { InsertOneResult, ObjectId, UpdateResult } from 'mongodb'

import { errorHandler } from '../../../plugins/errors'
import { Scale, ScaleData, ScaleDataBody } from '../../../interfaces/scale'
import { verifyAction } from '../../../plugins/authentication'
import { findScaleById } from '../../../connectors/scales/find-by-id'
import { updateScale } from '../../../connectors/scales/update'
import { findSourceById } from '../../../connectors/sources/find-by-id'
import { Source } from '../../../interfaces/source'
import { createMaterial } from '../../../connectors/materials/create'
import { Material, MaterialBase } from '../../../interfaces/material'
import { findMaterialById } from '../../../connectors/materials/find-by-id'
import { findMaterialByName } from '../../../connectors/materials/find-by-name'
import { sendSignal } from '../../../plugins/ports'

export async function scalePutAddController(req: Request, res: Response): Promise<void> {
  try {
    const {
      params: {
        scale_id
      },
      body: {
        source_id,
        material_id,
        material_name,
        weight
      },
      user
    }: {
      body: ScaleDataBody
      params: {
        scale_id?: string
      }
      user?: Request['user']
    } = req
    if (!verifyAction(user, 'scale-put')) throw new Error('UNAUTHORIZED')

    const scale: Scale = await findScaleById(new ObjectId(scale_id))
    if (!scale) throw new Error('SCALE_NOT_FOUND')

    const source: Source = await findSourceById(new ObjectId(source_id))
    if (!source) throw new Error('SOURCE_NOT_FOUND')

    if (scale.data?.length >= parseInt(process.env.SESSION_LENGTH))
      throw new Error('SCALE_DATA_LIMIT')

    let finish: boolean = false
    if (scale.data?.length === parseInt(process.env.SESSION_LENGTH) - 1)
      finish = true

    const payload: ScaleData = {
      _id: new ObjectId(),
      source: {
        _id: new ObjectId(source._id),
        name: source.name
      },
      material: null,
      date: new Date(),
      weight
    }

    if (!material_id && !material_name)
      throw new Error('INVALID_MATERIAL')

    if (material_id) {
      const material: Material = await findMaterialById(new ObjectId(material_id))
      payload.material = {
        _id: material._id,
        name: material.name
      }
    } else {
      const materialPayload: MaterialBase = {
        name: material_name,
        unique_name: material_name.replace(/[^\w\s]| /gi, '').toLowerCase(),
        create_date: new Date()
      }
      const material: Material = await findMaterialByName(materialPayload.unique_name)
      if (material) {
        payload.material = {
          _id: material._id,
          name: material.name
        }
      } else {
        const { insertedId: newMaterialId }: InsertOneResult = await createMaterial(materialPayload)
        payload.material = {
          _id: newMaterialId,
          name: material_name
        }
      }
    }

    if (!scale.data?.length) scale.data = []
    scale.data.push(payload)

    if (finish) {
      scale.status = 'finished'
      scale.end_date = new Date()
    }

    const { modifiedCount }: UpdateResult = await updateScale(scale)
    if (!modifiedCount) throw new Error('SCALE_NOT_UPDATED')

    scale.data = scale.data.reverse()

    sendSignal('on')

    res.status(200).send(scale)
  } catch (e) {
    errorHandler(e, res)
  }
}