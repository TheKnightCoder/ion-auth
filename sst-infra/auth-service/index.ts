import { appConfigType } from '../utils'

export default async function AuthService(appConfig: appConfigType) {
  const table = new sst.aws.Dynamo('AuthTable', {
    fields: {
      pk: 'string',
      sk: 'string',
    },
    primaryIndex: {
      hashKey: 'pk',
      rangeKey: 'sk',
    },
    transform: {
      table: (args) => {
        args.ttl = {
          attributeName: 'ttl',
          enabled: true,
        }
      },
    },
  })

  const auth = new sst.aws.Auth('Auth', {
    authenticator: {
      permissions: [
        {
          actions: ['ses:*'],
          resources: ['*'],
        },
        {
          actions: ['ssm:GetParameter'],
          resources: [`arn:aws:ssm:${appConfig.region}:${appConfig.accountId}:*`],
        },
      ],
      handler: 'apps/auth-service/api/session-create.handler',
      environment: {
        SST_APP: appConfig.name,
        SST_STAGE: appConfig.stage,
        TABLE: table.name,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
        CLIENT_ID: process.env.CLIENT_ID!,
        SITE_URL: $dev ? process.env.SITE_URL! : '', // Later populated using aws sdk
        SENDER_EMAIL: process.env.SENDER_EMAIL!,
      },
      link: [table],
    },
  })

  return { table, auth }
}
