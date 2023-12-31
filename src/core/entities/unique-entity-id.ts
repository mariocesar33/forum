import { randomUUID } from 'node:crypto'

export class UniqueEntityId {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID() // gerar um id caso não tenha identificado
  }

  public equals(id: UniqueEntityId) {
    return id.toValue() === this.value
  }
}
