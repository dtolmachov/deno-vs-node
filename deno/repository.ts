import { BaseEntity } from "./entities/base.entity.ts"
import { createClient, DynamoDBClient, Doc, uuid } from "./deps.ts"

export class Repository<T extends BaseEntity>{
  #client: DynamoDBClient
  #tableName: string

  constructor(tableName: string) {
    this.#client = createClient()
    this.#tableName = tableName
  }

  public async create(entity: T): Promise<T | undefined> {
    entity.id = uuid()
    entity.createdAt = new Date().getTime()
    const params = {
      TableName: this.#tableName,
      Item: entity
    }

    try {
      await this.#client.putItem(params)
      return this.get(entity.id)
    } catch (e) {
      console.error(`Repository - Table ${this.#tableName} - Create error - `, e)
      return undefined
    }
  }

  public async get(id: string): Promise<T | undefined> {
    const params = {
      TableName: this.#tableName,
      Key: {
        id: id,
      },
    }

    try {
      const result = await this.#client.getItem(params)
      return result?.Item
    } catch (e) {
      console.error(`Repository - Table ${this.#tableName} - Get error - `, e)
      return undefined
    }
  }

  public async list(): Promise<T[] | undefined> {
    const params = {
      TableName: this.#tableName,
    }

    try {
      const result = await this.#client.scan(params)
      const items: T[] = []

      if (Symbol.iterator in Object(result)) {
        for await (const page of result as AsyncIterableIterator<Doc>) {
          items.push(...page.Items)
        }
      } else {
        items.push(...result.Items)
      }

      return items
    } catch (e) {
      console.error(`Repository - Table ${this.#tableName} - list error - `, e)
      return undefined
    }
  }
}
