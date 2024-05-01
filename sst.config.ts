/// <reference path="./.sst/platform/config.d.ts" />
import Api from './sst-infra/api'

import Web from './sst-infra/web'
import AuthService from './sst-infra/auth-service'
import { getCallerIdentity } from '@pulumi/aws'
import { appConfigType } from './sst-infra/utils'

const name = 'myapp'

export default $config({
  app(input) {
    return {
      name,
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: {
          region: 'us-east-1',
        },
      },
    }
  },
  async run() {
    const appConfig: appConfigType = {
      name,
      stage: $app.stage,
      region: $app.providers?.aws.region,
      accountId: (await getCallerIdentity())?.accountId,
    }

    // await Api() //untested
    const { auth } = await AuthService(appConfig)
    const { site } = await Web(appConfig, { auth })
  },
})
