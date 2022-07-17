import { Repository } from "./repository"
import { Animal } from "./entities/animal.entity"
import { APIGatewayProxyEventV2 } from "aws-lambda"

const tableName = "node_ts_animals"
const repo = new Repository<Animal>(tableName)

function response(body: unknown, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify(body),
  }
}


export async function get(event: APIGatewayProxyEventV2) {
  const id = event?.pathParameters?.id
  if (!id) {
    return response({ message: "No 'id' parameter" }, 400)
  }

  const result = await repo.get(id)

  return response(result)
}

export async function list() {
  const result = await repo.list()

  return response(result)
}

export async function create(event: APIGatewayProxyEventV2) {
  let body: Animal
  try {
    body = JSON.parse(event.body || "")
  } catch {
    return response({ message: "Can not parse JSON"}, 400)
  }

  const result = await repo.create(body as Animal)

  return response(result)
}
