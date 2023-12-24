import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'

import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
    })

    // Espero que depois de apagar, la dentro do inMemoryAnswersRepository o items não tenha nada la dentro
    expect(inMemoryAnswersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

    // Espero que quando chamo o caso de uso de remoção de uma pergunta,
    // passando um autor que não é o autor da pergunta que criou a pergunta ele rejeita e retorna um erro.
    // expect(() => {
    //   return sut.execute({
    //     authorId: 'author-2',
    //     answerId: 'answer-1',
    //   })
    //  }).rejects.toBeInstanceOf(Error)
  })
})
