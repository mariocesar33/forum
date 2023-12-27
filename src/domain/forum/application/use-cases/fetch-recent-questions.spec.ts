import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 11, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 11, 18) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 11, 23) }),
    )

    // const { questions } = await sut.execute({
    const result = await sut.execute({
      page: 1,
    })

    // espero que o primeiro objeto que venha dentro de array,
    // seja o objeto que contendo cratedAt com a data mas recente, assim sucessivamente.
    // expect(questions).toEqual([
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 11, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 11, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 11, 18) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    // const { questions } = await sut.execute({
    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.questions).toHaveLength(2)

    // Espero que na pagina 2 tenha apenas 2 items
    // expect(questions).toHaveLength(2)
  })
})
