import {
  LambdaClient,
  GetFunctionConfigurationCommand,
  UpdateFunctionConfigurationCommand,
} from '@aws-sdk/client-lambda'

export function get(val: any) {
  return val.apply((url) => url!) as string
}

export type appConfigType = {
  name: string
  stage: string
  region: string
  accountId: string
}

export async function updateLambdaEnv(functionArn: string, newVariables: Record<string, string>) {
  try {
    const client = new LambdaClient()

    // Fetch the current environment configuration
    const getCommand = new GetFunctionConfigurationCommand({ FunctionName: functionArn })
    const currentConfig = await client.send(getCommand)

    // Combine the existing variables with the new variables
    const updatedVariables = {
      ...currentConfig.Environment.Variables,
      ...newVariables,
    }

    // Update the Lambda function configuration
    const updateCommand = new UpdateFunctionConfigurationCommand({
      FunctionName: functionArn,
      Environment: {
        Variables: updatedVariables,
      },
    })
    await client.send(updateCommand)

    console.log(`${functionArn} environment variables updated successfully!`)
  } catch (error) {
    console.error(`Failed to update environment variables: ${functionArn} `, error)
  }
}
