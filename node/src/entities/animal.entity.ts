import { BaseEntity } from "./base.entity"

export interface Animal extends BaseEntity {
  name: string
  isRare: boolean
}
