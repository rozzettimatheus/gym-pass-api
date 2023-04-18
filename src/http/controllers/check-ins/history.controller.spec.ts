import request from 'supertest'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { client } from '@/lib/prisma'

describe('History Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the check-ins history', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await client.user.findFirstOrThrow()

    const { id: gymId } = await client.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -21.7828621,
        longitude: -48.1855472,
      },
    })

    await client.checkIn.createMany({
      data: [
        {
          gym_id: gymId,
          user_id: user.id,
        },
        {
          gym_id: gymId,
          user_id: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gymId,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gymId,
        user_id: user.id,
      }),
    ])
  })
})
