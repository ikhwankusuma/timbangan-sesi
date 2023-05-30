import path from 'path'
import { sign, verify } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { pbkdf2Sync } from 'crypto'
import { readFile, writeFile } from 'fs/promises'

import { errorHandler } from '../../../plugins/errors'
import { Config } from '../../../interfaces/general'

export async function mainPutConfigController(req: Request, res: Response) {
  try {
    const {
      body: {
        name,
        phone,
        email,
        address,
        password
      }
    }: {
      body: Config
    } = req
    const rawToken: string = await readFile(path.join(__dirname, '../../../../config.json'), 'utf-8')
    const objToken: { token: string } = JSON.parse(rawToken)

    if (!objToken?.token) throw new Error('NO_CONFIG')

    const publicKey: string = await readFile(path.join(__dirname, '../../../../keys/public.pem'), 'utf-8')

    const oldToken: string = objToken.token
    const config: Config = verify(oldToken, publicKey, {
      algorithms: ['RS256'],
      issuer: 'SwiftDesign',
      audience: process.env.BASE_URL || 'http://localhost:8000'
    }) as Config

    if (name && typeof name === 'string') config.name = name
    if (phone && typeof phone === 'string') config.phone = phone
    if (email && typeof email === 'string') config.email = email
    if (address && typeof address === 'string') config.address = address
    if (password && config.status === 'trial') {
      const triedPassword: string = pbkdf2Sync(password, config.salt, 1000, 64, 'sha512').toString('hex')
      if (triedPassword !== config.password) throw new Error('INVALID_COMBINATION')
      config.status = 'activated'
      delete config.exp_date
      delete config.password
      delete config.salt
    }

    const privateKey: string = await readFile(path.join(__dirname, '../../../../keys/private.key'), 'utf-8')

    delete config.iat
    delete config.aud
    delete config.iss

    const token: string = sign(config, privateKey, {
      algorithm: 'RS256',
      issuer: 'SwiftDesign',
      audience: process.env.BASE_URL || 'http://localhost:8000'
    })
    await writeFile(path.join(__dirname, '../../../../config.json'), JSON.stringify({ token }))

    res.status(200).send(config)
  } catch (e: any) {
    errorHandler(e, res)
  }
}