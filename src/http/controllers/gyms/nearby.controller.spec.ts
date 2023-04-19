import request from 'supertest'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, undefined, true)

    await Promise.all([
      request(app.server)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Near Gym',
          latitude: -21.7828621,
          longitude: -48.1855472,
          phone: null,
          description: null,
        }),
      request(app.server)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Far away Gym',
          latitude: -21.1687427,
          longitude: -47.8083742,
          phone: null,
          description: null,
        }),
    ])

    const response = await request(app.server)
      .get('/api/gyms/nearby')
      .query({
        latitude: -21.7828621,
        longitude: -48.1855472,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
