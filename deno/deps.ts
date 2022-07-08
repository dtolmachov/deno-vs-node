// PL
export type { APIGatewayProxyEventV2 } from "https://deno.land/x/lambda@1.23.3/mod.ts"

// DAL
import { v4 } from "https://deno.land/std@0.147.0/uuid/mod.ts"

export const uuid = v4.generate
export { createClient } from "https://denopkg.com/chiefbiiko/dynamodb/mod.ts"
export type { Doc, DynamoDBClient } from "https://denopkg.com/chiefbiiko/dynamodb/mod.ts"
