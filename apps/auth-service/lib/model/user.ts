import { Entity } from 'electrodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Resource } from 'sst'
import { v4 as uuid } from 'uuid'

const client = new DynamoDBClient()

const table = Resource.AuthTable.name

const User = new Entity(
  {
    model: {
      entity: 'user',
      version: '1',
      service: 'auth',
    },
    attributes: {
      email: {
        type: 'string',
        readOnly: true,
        required: true,
      },
      userId: {
        type: 'string',
        default: () => uuid(),
        readOnly: true,
        required: true,
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
          composite: [],
        },
      },
    },
  },
  { client, table },
)

export { User }
