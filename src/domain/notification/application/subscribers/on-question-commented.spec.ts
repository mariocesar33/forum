import { OnQuestionCommented } from './on-question-commented'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'

import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'

import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'

import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { SpyInstance } from 'vitest'
import { waitFor } from '@/test/utils/wait-for'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Question Commented', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // Aqui estou criando o subscribers (começa a ouvir o evento de um novo comentario criado)
    new OnQuestionCommented(
      inMemoryQuestionsRepository,
      sendNotificationUseCase,
    )
  })

  it('should  send a notification when an question is created', async () => {
    const question = makeQuestion()
    const questionComment = makeQuestionComment({ questionId: question.id })

    inMemoryQuestionsRepository.create(question)

    // No momento que salvo o comentario no banco de dados, o metodo sendNewCommentNotification()
    // de dentro da classe OnQuestionCommented é ativada.
    inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
