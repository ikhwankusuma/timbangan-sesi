import path from 'path'
import { sign } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { pbkdf2Sync, randomBytes } from 'crypto'
import { readFile, writeFile } from 'fs/promises'

import { errorHandler } from '../../../plugins/errors'
import { Config } from '../../../interfaces/general'
import { deleteCustomerByQuery } from '../../../connectors/customers/delete-by-query/index'
import { deleteEventByQuery } from '../../../connectors/events/delete-by-query'
import { deleteMaterialByQuery } from '../../../connectors/materials/delete-by-query'
import { deleteScaleByQuery } from '../../../connectors/scales/delete-by-query'
import { deleteSourceByQuery } from '../../../connectors/sources/delete-by-query'
import { deleteSupplierByQuery } from '../../../connectors/suppliers/delete-by-query'
import { deleteUserByQuery } from '../../../connectors/users/delete-by-query'
import { createUser } from '../../../connectors/users/create'

export async function mainPostConfigController(req: Request, res: Response) {
  try {
    const {
      body: {
        status,
        name,
        phone,
        email,
        address,
        password,
        exp_date
      }
    }: {
      body: Config
    } = req
    const triedPassword: string = pbkdf2Sync(password, 'cea1a18cd0e85ca95595662b89907893', 1000, 64, 'sha512').toString('hex')
    if (triedPassword !== 'b28bd47b746611f4f5c57cf0269134cb41d121a276ac46dcd35f0ef8c7613612b8a22193a3fb4283492fe1f9ab56ff38391d7212470968b06c8b5f0f89543f8d') throw new Error('INVALID_COMBINATION')

    const payload: Config = {
      status,
      name,
      phone,
      email,
      address,
      exp_date
    }

    if (payload.status === 'activated') {
      delete payload.exp_date
      delete payload.password
      delete payload.salt
    } else if (payload.status === 'trial' && !payload.exp_date) {
      const salt: string = randomBytes(16).toString('hex')
      const password: string = randomBytes(16).toString('hex')

      payload.exp_date = new Date(new Date().getTime() + 30 * 86400000)
      payload.password = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
      payload.salt = salt

      await writeFile(path.join(__dirname, '../../../../sn.txt'), password)
    }

    await deleteCustomerByQuery({})
    await deleteEventByQuery({})
    await deleteMaterialByQuery({})
    await deleteScaleByQuery({})
    await deleteSourceByQuery({})
    await deleteSupplierByQuery({})
    await deleteUserByQuery({})

    await createUser({
      role: 'admin',
      name: 'Admin',
      password: 'admin',
      username: 'admin',
      create_date: new Date()
    })

    const privateKey: string = await readFile(path.join(__dirname, '../../../../keys/private.key'), 'utf-8')

    const token: string = sign(payload, privateKey, {
      algorithm: 'RS256',
      issuer: 'SwiftDesign',
      audience: process.env.BASE_URL || 'http://localhost:8000'
    })
    await writeFile(path.join(__dirname, '../../../../config.json'), JSON.stringify({ token }))

    res.status(201).send(payload)
  } catch (e: any) {
    errorHandler(e, res)
  }
}