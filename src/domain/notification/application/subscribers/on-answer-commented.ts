import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswerCommentedEvent } from '@/domain/forum/enterprise/events/answer-commented-event'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

export class OnAnswerCommented implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentedEvent.name,
    )
  }

  // Só é chamada quando um novo comentario é criada no banco de dados
  // e vai fazer o envio da notificação
  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerCommentedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString(),
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Novo comentari em "${answer.content
          .substring(0, 40)
          .concat('...')}"`,
        content: answerComment.excerpt,
      })
    }
  }
}
