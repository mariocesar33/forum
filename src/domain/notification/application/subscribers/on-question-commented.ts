import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { QuestionCommentedEvent } from '@/domain/forum/enterprise/events/question-commented-event'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

export class OnQuestionCommented implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentNotification.bind(this),
      QuestionCommentedEvent.name,
    )
  }

  // Só é chamada quando um novo comentario é criada no banco de dados
  // e vai fazer o envio da notificação
  private async sendNewQuestionCommentNotification({
    questionComment,
  }: QuestionCommentedEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Novo comentari em "${question.title
          .substring(0, 40)
          .concat('...')}"`,
        content: questionComment.excerpt,
      })
    }
  }
}
