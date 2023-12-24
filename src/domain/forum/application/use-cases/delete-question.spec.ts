import { DeleteQuestionUseCase } from './delete-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'

import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
    })

    // Espero que depois de apagar, la dentro do inMemoryQuestionsRepository o items não tenha nada la dentro
    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

    // Espero que quando chamo o caso de uso de remoção de uma pergunta,
    // passando um autor que não é o autor da pergunta que criou a pergunta ele rejeita e retorna um erro.
    // expect(() => {
    //   return sut.execute({
    //     authorId: 'author-2',
    //     questionId: 'question-1',
    //   })
    // }).rejects.toBeInstanceOf(Error)
  })
})
