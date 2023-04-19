
# Gym Pass API 

***README file under construction***

An open-source API for managing gyms and users. Project developed inside the [Rocketseat](https://github.com/Rocketseat) Ignite program.



## Author

Gabriel Rozzetti
- Reach me out at [Github](https://github.com/rozzettimatheus) or [Linkedin](https://www.linkedin.com/in/rozzettimatheus/)
## Technologies

- Node.js
- Fastify
- Fastify adapters: 
    - JWT integration (@fastify/jwt)
    - Cookies (@fastify/cookies)
- Zod (schema validation)
- Prisma (ORM)
- Postgres
- Docker and Docker Compose
- Bcrypt (for password hashing)
- DayJS (for date manipulation)
- Vitest (for unit tests and e2e tests)
- Supertest (for e2e tests - mock requests)


## Install

- Node.js version: **18.16.0**


```bash
  cd gym-pass
  npm i
```

### Setup Docker Postgres

```bash
  docker compose up --build -d
```

### Setup Environment Variables

Create a `.env` file in the root folder and copy the variables from the `.env.example` file.

Complete the `DATABASE_URL` with username, password, Postgres PORT (default: 5432) and database name.

`NODE_ENV` accepted options: `dev` | `test` | `production`

Fill the other variables also.


### Setup Prisma

```bash
  # run migrations first
  npx prisma migrate dev

  # check if DB is ok
  npx prisma studio
```

## Running

```bash
  # development mode  
  npm run start:dev

  # build and run
  npm run build
  npm start
```

## Running Tests

### Unit tests

```bash
  npm run test

  # watch mode
  npm run test:watch

  # coverage
  npm run test:coverage
```

### E2E tests

```bash
  # run first to create the prisma test environment
  npm run test:e2e

  # watch mode
  npm run test:e2e:watch
```
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

#### Retorna todos os itens

```http
  GET /api/items
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API |

#### Retorna um item

```http
  GET /api/items/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do item que você quer |



## Learning

With this project, I was able to dive deep into TDD methodology, applying unit tests to use-cases and e2e tests to all app routes. I also learned about implementing a more clean and usable code with SOLID principles, Repository pattern and best practices. 

This project implements the RBCA for the users, granting or denying certain actions based on their roles.

## License

[MIT](https://choosealicense.com/licenses/mit/)

