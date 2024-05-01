import { APIGatewayEvent } from 'aws-lambda'
import { sessions } from '../lib/sessions'

export const handler = async (event: APIGatewayEvent) => {
  const { apiId, accountId, requestId } = event.requestContext

  const Resource = `arn:aws:execute-api:${process.env.AWS_REGION}:${accountId}:${apiId}/*/*/*`
  const Deny = {
    principalId: requestId || 'NA',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource,
        },
      ],
    },
  }

  try {
    const bearer = event.authorizationToken.replace('Bearer ', '')
    const session = await sessions.verify(bearer)

    if (session.type === 'user') {
      return {
        principalId: session?.properties?.userId || requestId || 'NA',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource,
            },
          ],
        },
      }
    }

    return Deny
  } catch (error) {
    return Deny
  }
}
