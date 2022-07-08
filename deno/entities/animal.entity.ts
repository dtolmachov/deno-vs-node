import { BaseEntity } from "./base.entity.ts"

export interface Animal extends BaseEntity {
  name: string
  isRare: boolean
}
