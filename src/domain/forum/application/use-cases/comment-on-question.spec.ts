import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'

import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsCommentsRepository: InMemoryQuestionCommentsRepository

let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionsCommentsRepository,
    )
  })

  it('should be able to comment on questions', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Comentário teste',
    })

    // Espero que la dentro do inMemoryQuestionsCommentsRepository tenho content com o valor 'Comentário teste'
    expect(inMemoryQuestionsCommentsRepository.items[0].content).toEqual(
      'Comentário teste',
    )
  })
})
