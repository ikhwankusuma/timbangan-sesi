import { Request, Response } from 'express'
import { ObjectId, UpdateResult } from 'mongodb'

import { errorHandler } from '../../../plugins/errors'
import { Scale } from '../../../interfaces/scale'
import { verifyAction } from '../../../plugins/authentication'
import { findScaleById } from '../../../connectors/scales/find-by-id'
import { updateScale } from '../../../connectors/scales/update'

export async function scalePutRemoveController(req: Request, res: Response): Promise<void> {
  try {
    const {
      params: {
        scale_id,
        data_id
      },
      user
    }: {
      params: {
        scale_id?: string
        data_id?: string
      }
      user?: Request['user']
    } = req
    if (!verifyAction(user, 'scale-put')) throw new Error('UNAUTHORIZED')

    const scale: Scale = await findScaleById(new ObjectId(scale_id))
    if (!scale) throw new Error('SCALE_NOT_FOUND')

    const index: number = scale.data?.findIndex((a) => a._id.toString() === data_id)
    if (index === -1) throw new Error('DATA_NOT_FOUND')

    scale.data.splice(index, 1)

    const { modifiedCount }: UpdateResult = await updateScale(scale)
    if (!modifiedCount) throw new Error('SCALE_NOT_UPDATED')

    scale.data = scale.data.reverse()

    res.status(200).send(scale)
  } catch (e) {
    errorHandler(e, res)
  }
}