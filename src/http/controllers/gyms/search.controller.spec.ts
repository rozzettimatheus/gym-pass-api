import request from 'supertest'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, undefined, true)

    await Promise.all([
      request(app.server)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Javascript Gym',
          description: 'some description',
          phone: '11999999999',
          latitude: -21.7828621,
          longitude: -48.1855472,
        }),
      request(app.server)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Typescript Gym',
          description: 'some description',
          phone: '11999999999',
          latitude: -21.7828621,
          longitude: -48.1855472,
        }),
    ])

    const response = await request(app.server)
      .get('/api/gyms/search')
      .query({
        q: 'Javascript',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym',
      }),
    ])
  })
})
