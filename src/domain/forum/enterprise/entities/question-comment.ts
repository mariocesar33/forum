import { Comment, CommentProps } from './comment'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { QuestionCommentedEvent } from '../events/question-commented-event'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}

// Comentário de uma Pergunta
export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewQuestionComment = !id

    // Aqui estou criando o evendo
    if (isNewQuestionComment) {
      questionComment.addDomainEvent(
        new QuestionCommentedEvent(questionComment),
      )
    }

    return questionComment
  }
}
