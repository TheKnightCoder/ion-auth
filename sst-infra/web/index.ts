import { appConfigType, updateLambdaEnv } from '../utils'

export default async function Web(appConfig: appConfigType, { auth }) {
  const site = new sst.aws.Nextjs('Web', {
    path: 'apps/web/',
    environment: {
      SST_APP: appConfig.name,
      SST_STAGE: appConfig.stage,
      AUTH_URL: auth.url.apply((url) => url.replace(/\/$/, '')!),
      AUTH_PUBLIC_KEY: auth.key.publicKeyPem,
      CLIENT_ID: process.env.CLIENT_ID!,
    }
  })

  $resolve([auth.authenticator.arn, site.url]).apply(async ([authArn, siteUrl]) => {
    await updateLambdaEnv(authArn, {
      SITE_URL: siteUrl,
    })
    console.log(`Added SITE_URL env var to Auth Function ${authArn}`)
  })

  return { site }
}
