import { EditQuestionUseCase } from './edit-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'

import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      authorId: 'author-1',
      questionId: newQuestion.id.toString(),
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
    })

    // toMatchObject => Vai verificar se as propriedades que estou passsado,
    // estão dentro do item (item[0]) que estou passando também.
    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
    })
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: newQuestion.id.toString(),
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

    // Espero que quando chamo o caso de uso de editar de uma pergunta,
    // passando o ID do autor que não é o autor da pergunta ele deve rejeitar, e retorna um erro.
    // expect(() => {
    //   return sut.execute({
    //     authorId: 'author-2',
    //     questionId: newQuestion.id.toString(),
    //     title: 'Pergunta teste',
    //     content: 'Conteúdo teste',
    //   })
    // }).rejects.toBeInstanceOf(Error)
  })
})
