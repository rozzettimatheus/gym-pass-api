import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

// postgresql://docker:docker@localhost:5432/apicheckingym?schema=public
// postgres - allows different schemas (independent)

const prisma = new PrismaClient()

function assertsDatabaseURLExists(
  url: string | undefined,
): asserts url is string {
  if (!url || typeof url !== 'string') {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }
}

function generateDatabaseURL(schemaId: string) {
  assertsDatabaseURLExists(process.env.DATABASE_URL)

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  // executes before every test
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL
    /**
     * not dev, but deploy
     *  - prisma must not compare local schema with existent database
     * - deploy will only execute migrations, skip comparisons
     */
    execSync('npx prisma migrate deploy')

    return {
      // executes after all tests
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
