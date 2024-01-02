import { Comment, CommentProps } from './comment'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AnswerCommentedEvent } from '../events/answer-commented-event'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
}

// Comentário de uma resposta
export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewAnswerComment = !id

    // Aqui estou criando o evendo
    if (isNewAnswerComment) {
      answerComment.addDomainEvent(new AnswerCommentedEvent(answerComment))
    }

    return answerComment
  }
}
