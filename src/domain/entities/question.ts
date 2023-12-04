import { Slug } from "./value-objects/slug"
import { Entity } from "../../core/entities/entity"
import { UniqueEntityId } from "../../core/entities/unique-entity-id"

interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  title: string
  slug: Slug
  content: string
  createdAt: Date
  updatedAt?: Date
}

// Pergunta
export class Question extends Entity<QuestionProps> {}