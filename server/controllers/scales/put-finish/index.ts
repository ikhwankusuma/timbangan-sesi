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

export async function scalePutFinishController(req: Request, res: Response): Promise<void> {
  try {
    const {
      params: {
        scale_id
      },
      user
    }: {
      params: {
        scale_id?: string
      }
      user?: Request['user']
    } = req
    if (!verifyAction(user, 'scale-put')) throw new Error('UNAUTHORIZED')

    const scale: Scale = await findScaleById(new ObjectId(scale_id))
    if (!scale) throw new Error('SCALE_NOT_FOUND')

    scale.status = 'finished'
    scale.end_date = new Date()

    const { modifiedCount }: UpdateResult = await updateScale(scale)
    if (!modifiedCount) throw new Error('SCALE_NOT_UPDATED')

    scale.data = scale.data.reverse()

    res.status(200).send(scale)
  } catch (e) {
    errorHandler(e, res)
  }
}