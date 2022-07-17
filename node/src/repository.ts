import { DynamoDB } from "aws-sdk"
import { v4 as uuid } from "uuid"

import { BaseEntity } from "./entities/base.entity"

export class Repository<T extends BaseEntity> {
  private client: DynamoDB.DocumentClient
  private tableName: string

  constructor(tableName: string) {
    this.client = new DynamoDB.DocumentClient()
    this.tableName = tableName
  }

  public async create(entity: T): Promise<T | undefined> {
    entity.id = uuid()
    entity.createdAt = new Date().getTime()
    const params = {
      TableName: this.tableName,
      Item: entity
    }

    try {
      await this.client.put(params).promise()
      return this.get(entity.id!)
    } catch (e) {
      console.error(`Repository - Table ${this.tableName} - Create error - `, e)
      return undefined
    }
  }

  public async get(id: string): Promise<T | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: id,
      },
    }

    try {
      const result = await this.client.get(params).promise()
      return result?.Item as T
    } catch (e) {
      console.error(`Repository - Table ${this.tableName} - Get error - `, e)
      return undefined
    }
  }

  public async list(): Promise<T[] | undefined> {
    const params: DynamoDB.ScanInput = {
      TableName: this.tableName,
    }
    const items: T[] = []

    try {
      let result;
      do{
        result = await this.client.scan(params).promise()
        items.push(...result.Items as T[])
        params.ExclusiveStartKey = result.LastEvaluatedKey;
      } while (typeof result.LastEvaluatedKey !== "undefined");
    
      return items
    } catch (e) {
      console.error(`Repository - Table ${this.tableName} - list error - `, e)
      return undefined
    }
  }
}
