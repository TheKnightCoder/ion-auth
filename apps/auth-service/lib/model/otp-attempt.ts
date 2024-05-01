import { Entity } from 'electrodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Resource } from 'sst'
import { v4 as uuid } from 'uuid'

const client = new DynamoDBClient()

const table = Resource.AuthTable.name

const minutes = (n) => Date.now() + n * 60 * 1000
const OtpAttempt = new Entity(
  {
    model: {
      entity: 'otpAttempt',
      version: '1',
      service: 'auth',
    },
    attributes: {
      email: {
        type: 'string',
        readOnly: true,
        required: true,
      },
      otpAttemptId: {
        type: 'string',
        default: () => uuid(),
        readOnly: true,
        required: true,
      },
      createdAt: {
        type: 'number',
        readOnly: true,
        required: true,
        default: () => Date.now(),
      },
      ttl: {
        type: 'number',
        readOnly: true,
        required: true,
        default: () => minutes(10),
        set: () => minutes(10),
      },
    },
    indexes: {
      attempts: {
        pk: {
          field: 'pk',
          composite: ['email'],
        },
        sk: {
          field: 'sk',
          composite: ['createdAt', 'otpAttemptId'],
        },
      },
    },
  },
  { client, table },
)

async function hasExceededMaxOtpAttempts(email: string) {
  const attempts = await OtpAttempt.query
    .attempts({
      email,
    })
    .gte({
      createdAt: Date.now() - 1 * 60 * 1000, // 1 minute
    })
    .go()

  if (attempts.data.length >= 5) {
    return true
  }
  return false
}
export { OtpAttempt, hasExceededMaxOtpAttempts }
