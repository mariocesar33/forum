import { QuestionComment } from '../../enterprise/entities/question-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface QuestionCommentsRepository {
  create(question: QuestionComment): Promise<void>
  delete(questionComment: QuestionComment): Promise<void>
  findById(id: string): Promise<QuestionComment | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
}
