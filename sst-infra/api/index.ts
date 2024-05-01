export default async function Api() {
  // UNTESTED Custom Auth may need changes
  const api = new sst.aws.ApiGatewayV2('Api')
  const apiId = (api as any).api?.id

  const customAuthorizer = new sst.aws.Function('CustomAuthorizer', {
    handler: 'apps/auth-service/api/sessionverify.handler',
  })
  const invokeArn = (customAuthorizer as any).function?.invokeArn

  const authorizer = new aws.apigatewayv2.Authorizer('Authorizer', {
    apiId,
    authorizerType: 'REQUEST',
    authorizerUri: invokeArn,
    identitySources: ['$request.header.Authorization'],
    name: 'APIKeyAuthorizer',
    authorizerPayloadFormatVersion: '2.0',
    authorizerResultTtlInSeconds: 300,
  })

  const r = api.route(
    'GET /',
    {
      handler: 'apps/example/api/test-db.handler',
    },
    {
      transform: {
        route: (args) => {
          args.authorizationType = 'CUSTOM'
          args.authorizerId = authorizer.id
        },
      },
    },
  )
}
