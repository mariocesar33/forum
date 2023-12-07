import { Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
  create(questions: Question): Promise<void>
}
