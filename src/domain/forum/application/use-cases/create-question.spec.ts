import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    // const { question } = await sut.execute({
    const result = await sut.execute({
      authorId: '1',
      title: 'Nova Pergunta',
      content: 'Conteúdo da pergunta',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)

    // O id não pode ser nulo ao undefined, ao seja, o id não pode ser uma coisa
    // que não é verdadeiro para o javascript
    // expect(question.id).toBeTruthy()

    // como tenho um repositorio posso validar que dentro do repositorio,
    // no item[0] que o id dele seja igual ao question.id que foi criado.
    // expect(inMemoryQuestionsRepository.items[0].id).toEqual(question.id)
  })
})
