import "sst"
declare module "sst" {
  export interface Resource {
    AuthTable: {
      name: string
      type: "sst.aws.Dynamo"
    }
    WebTable: {
      name: string
      type: "sst.aws.Dynamo"
    }
  }
}
export {}