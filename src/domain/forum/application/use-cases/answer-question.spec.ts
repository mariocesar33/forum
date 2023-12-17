import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let inMemoryQuestionsRepository: InMemoryAnswersRepository

// sut => System Under Test
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create an answer', async () => {
    const { answer } = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'Conteúdo da resposta',
    })

    // O id não pode ser nulo ao undefined, ao seja, o id não pode ser uma coisa
    // que não é verdadeiro para o javascript
    expect(answer.id).toBeTruthy()
    // como tenho um repositorio posso validar que dentro do meu repositorio,
    // no item[0] que o id dele seja igual ao answer.id que foi criado.
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(answer.id)
  })
})
