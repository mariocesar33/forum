import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export function makeQuestion(override: Partial<QuestionProps> = {}) {
  const question = Question.create({
    authorId: new UniqueEntityId(),
    title: 'Example question',
    content: 'Example content',
    ...override,
  })

  return question
}
