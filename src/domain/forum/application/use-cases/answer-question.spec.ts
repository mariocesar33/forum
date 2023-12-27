import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new AnswerQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create an answer', async () => {
    // const { answer } = await sut.execute({
    const result = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'Conteúdo da resposta',
      attachmentsIds: ['1', '2'],
    })

    // O id não pode ser nulo ao undefined, ao seja, o id não pode ser uma coisa
    // que não é verdadeiro para o javascript
    // expect(answer.id).toBeTruthy()

    // como tenho um repositorio posso validar que dentro do meu repositorio,
    // no item[0] que o id dele seja igual ao answer.id que foi criado.
    // expect(inMemoryQuestionsRepository.items[0].id).toEqual(answer.id)

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.answer)
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
})
