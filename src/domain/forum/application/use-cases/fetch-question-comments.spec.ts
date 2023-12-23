import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryQuestonCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestonCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestonCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestonCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      }),
    )
    await inMemoryQuestonCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      }),
    )
    await inMemoryQuestonCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      }),
    )

    const { questionComments } = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    // espero um array com 3 items.
    expect(questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestonCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question-3'),
        }),
      )
    }

    const { questionComments } = await sut.execute({
      questionId: 'question-3',
      page: 2,
    })

    // Espero que na pagina 2, deve ter apenas 2 items
    expect(questionComments).toHaveLength(2)
  })
})
