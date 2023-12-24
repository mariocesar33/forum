import { EditAnswerUseCase } from './edit-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'

import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-1',
      answerId: newAnswer.id.toString(),
      content: 'Conteúdo teste',
    })

    // toMatchObject => Vai verificar se as propriedades que estou passsado,
    // estão dentro do item (item[0]) que estou passando também.
    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Conteúdo teste',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: newAnswer.id.toString(),
      content: 'Conteúdo teste',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

    // Espero que quando chamo o caso de uso de editar de uma pergunta,
    // passando o ID do autor que não é o autor da pergunta ele deve rejeitar, e retorna um erro.
    // expect(() => {
    //   return sut.execute({
    //     authorId: 'author-2',
    //     answerId: newAnswer.id.toString(),
    //     content: 'Conteúdo teste',
    //   })
    // }).rejects.toBeInstanceOf(Error)
  })
})
