import { OnAnswerCommented } from './on-answer-commented'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'

import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'

import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'

import { makeAnswer } from '@/test/factories/make-answer'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { SpyInstance } from 'vitest'
import { waitFor } from '@/test/utils/wait-for'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Commented', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // Aqui estou criando o subscribers (começa a ouvir o evento de um novo comentario criado)
    new OnAnswerCommented(inMemoryAnswersRepository, sendNotificationUseCase)
  })

  it('should  send a notification when an answer is created', async () => {
    const answer = makeAnswer()
    const answerComment = makeAnswerComment({ answerId: answer.id })

    inMemoryAnswersRepository.create(answer)

    // No momento que salvo o comentario no banco de dados, o metodo sendNewCommentNotification()
    // de dentro da classe OnAnswerCommented é ativada.
    inMemoryAnswerCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
