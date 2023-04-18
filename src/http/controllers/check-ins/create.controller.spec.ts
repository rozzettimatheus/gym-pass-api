import request from 'supertest'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { client } from '@/lib/prisma'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to check in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    // insert directly into DB
    const { id: gymId } = await client.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -21.7828621,
        longitude: -48.1855472,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -21.7828621,
        longitude: -48.1855472,
      })

    expect(response.statusCode).toEqual(201)
  })
})
