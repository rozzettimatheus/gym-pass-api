# Gym Pass API

**_README file under construction_**

An open-source API for managing gyms and users. Project developed inside the [Rocketseat](https://github.com/Rocketseat) Ignite program.

## Author

- [Gabriel Rozzetti](https://github.com/rozzettimatheus)

## Technologies

**Built with Node.js**

**Web framework:**

- Fastify
- Fastify Tools: JWT integration (@fastify/jwt), Cookies (@fastify/cookies)

**Validation**

- Zod

**ORM**

- Prisma

**DB**

- Postgres

**Utils**

- Bcrypt (for password hashing)
- DayJS (for date manipulation)

**Tests**

- Vitests (for unit tests and e2e tests)
- Supertest (for e2e tests - mock requests)

## API Docs

### Users

#### Register a user

`POST /api/users`

#### Authenticate

`POST /api/sessions`

#### Refresh the token

`PATCH /api/token/refresh`

#### Get logged user profile

`GET /api/me`

### Gym

#### Create a gym (admin only)

`POST /api/gyms`

#### Search for gyms

`GET /api/gyms/search`

#### List nearby gyms

`GET /api/gyms/nearby`

### Check-ins

## Learning

With this project, I was able to dive deep into TDD methodology, applying unit tests to use-cases and e2e tests to all app routes. I also learned about implementing a more clean and usable code with SOLID principles, Repository pattern and best practices.

This project implements the RBCA for the users, granting or denying certain actions based on their roles.
