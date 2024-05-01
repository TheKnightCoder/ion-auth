import { Entity } from 'electrodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Resource } from 'sst'
import { v4 as uuid } from 'uuid'

const client = new DynamoDBClient()

const table = Resource.AuthTable.name

const OtpSent = new Entity(
  {
    model: {
      entity: 'otpSent',
      version: '1',
      service: 'auth',
    },
    attributes: {
      email: {
        type: 'string',
        readOnly: true,
        required: true,
      },
      otpSentId: {
        type: 'string',
        default: () => uuid(),
        readOnly: true,
        required: true,
      }, // timestamp
      updatedAt: {
        type: 'number',
        required: true,
        default: () => Date.now(),
        set: () => Date.now(),
      },
    },
    indexes: {
      byEmail: {
        pk: {
          field: 'pk',
          composite: ['email'],
        },
        sk: {
          field: 'sk',
          composite: [],
        },
      },
    },
  },
  { client, table },
)

export { OtpSent }
